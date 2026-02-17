function createEmptyTeams(numberOfPlayers, numberOfTeams) {
  const teams = []

  const teamSize = Math.floor(numberOfPlayers / numberOfTeams);
  const numberOfTeamsWithExtraPlayer = numberOfPlayers % numberOfTeams;
  for (let i = 0; i < numberOfTeams; i++) {
    teams.push({
      players: [],
      size: teamSize + (i < numberOfTeamsWithExtraPlayer ? 1 : 0),
      avgRating: 0,
      id: i + 1
    });
  }

  return teams;
}

function recalcAvg(team) {
  if (team.players.length === 0) {
    team.avgRating = 0;
    team.avgKondycja = 0;
    return;
  }
  team.avgRating = team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length;
  team.avgKondycja = team.players.reduce((sum, p) => sum + (p.kondycja || 0), 0) / team.players.length;
}

function kondycjaScore(teams) {
  const allEqual = teams.every(t => t.players.length === teams[0].players.length);
  const avgKondycjas = teams.map(t => {
    if (t.players.length === 0) return 0;
    return t.players.reduce((s, p) => s + (p.kondycja || 0), 0) / t.players.length;
  });

  if (allEqual) {
    // Minimize variance of avg kondycja across teams
    const mean = avgKondycjas.reduce((s, v) => s + v, 0) / avgKondycjas.length;
    return avgKondycjas.reduce((s, v) => s + (v - mean) ** 2, 0);
  } else {
    // Smaller teams should have higher kondycja
    // Penalize when a smaller team has lower kondycja than a larger team
    let score = 0;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        if (teams[i].players.length < teams[j].players.length) {
          score += Math.max(0, avgKondycjas[j] - avgKondycjas[i]);
        } else if (teams[j].players.length < teams[i].players.length) {
          score += Math.max(0, avgKondycjas[i] - avgKondycjas[j]);
        }
      }
    }
    return score;
  }
}

function optimizeKondycja(teams, lockedPlayerIds = [], ratingTolerance = 1.0) {
  const lockedSet = new Set(lockedPlayerIds);
  let improved = true;
  let iterations = 0;
  const maxIterations = 100;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        for (let pi = 0; pi < teams[i].players.length; pi++) {
          for (let pj = 0; pj < teams[j].players.length; pj++) {
            const playerI = teams[i].players[pi];
            const playerJ = teams[j].players[pj];

            // Don't swap pre-assigned players
            if (lockedSet.has(playerI.id) || lockedSet.has(playerJ.id)) continue;

            // Only swap players with similar ratings to preserve rating balance
            if (Math.abs(playerI.rating - playerJ.rating) > ratingTolerance) continue;

            const currentScore = kondycjaScore(teams);

            // Tentatively swap
            teams[i].players[pi] = playerJ;
            teams[j].players[pj] = playerI;

            const newScore = kondycjaScore(teams);

            if (newScore < currentScore - 0.001) {
              // Keep the swap
              improved = true;
              recalcAvg(teams[i]);
              recalcAvg(teams[j]);
            } else {
              // Revert
              teams[i].players[pi] = playerI;
              teams[j].players[pj] = playerJ;
            }
          }
        }
      }
    }
  }
}

//preassignedPlayersTeams = [{playerId: 1, teamId: 1}, {playerId: 2, teamId: 2}]
function createTeams(players, numberOfTeams, preassignedPlayersTeams = [], options = {}) {

  //filter players that are not preassigned to any team
  const playersNotPreassigned = players.filter(player => !preassignedPlayersTeams.find(preassignedPlayer => preassignedPlayer.playerId === player.id));

  //sort players by rating descending
  const playersSorted = playersNotPreassigned.sort((a, b) => b.rating - a.rating);

  const teams = createEmptyTeams(players.length, numberOfTeams);

  //assign preassigned players to teams
  preassignedPlayersTeams.forEach(preassignedPlayer => {
    const team = teams.find(team => team.id === preassignedPlayer.teamId);
    //find player by id
    const player = players.find(player => player.id === preassignedPlayer.playerId);
    team.players.push(player);
    team.avgRating = (team.avgRating * (team.players.length - 1) + player.rating) / team.players.length;
  });

  for (let i = 0; i < playersSorted.length; i++) {
    //filter teams with the number of players pushed is less than the team size
    const notFullTeams = teams.filter(team => team.players.length < team.size).sort((a, b) => a.avgRating - b.avgRating);

    //filter teams with the minimum number of players from all teams
    const sortedTeamsByNumberOfPlayers = notFullTeams.sort((a, b) => a.players.length - b.players.length)
    const teamsWithMinNumberOfPlayers = sortedTeamsByNumberOfPlayers.filter(team => team.players.length === sortedTeamsByNumberOfPlayers[0].players.length);

    if (teamsWithMinNumberOfPlayers.length > 1) {
      // filter teams with the smallest team size property from all teams with the smallest number of players
      const sortedTeamsBySize = teamsWithMinNumberOfPlayers.sort((a, b) => a.size - b.size)
      const teamsWithMinSize = sortedTeamsBySize.filter(team => team.size === sortedTeamsBySize[0].size);

      // check if teams have equal size, if not then add player to the team with smaller average rating
      if (teamsWithMinSize.length > 1) {
        teamsWithMinSize[0].players.push(playersSorted[i]);
        teamsWithMinSize[0].avgRating = (teamsWithMinSize[0].avgRating * (teamsWithMinSize[0].players.length - 1) + playersSorted[i].rating) / teamsWithMinSize[0].players.length;
      } else if (teamsWithMinSize.length === 1) {
        teamsWithMinSize[0].players.push(playersSorted[i]);
        teamsWithMinSize[0].avgRating = (teamsWithMinSize[0].avgRating * (teamsWithMinSize[0].players.length - 1) + playersSorted[i].rating) / teamsWithMinSize[0].players.length;
      } else {
        // push player to the team with the smallest average rating from all teams with the smallest number of players
        teamsWithMinNumberOfPlayers[0].players.push(playersSorted[i]);
        teamsWithMinNumberOfPlayers[0].avgRating = (teamsWithMinNumberOfPlayers[0].avgRating * (teamsWithMinNumberOfPlayers[0].players.length - 1) + playersSorted[i].rating) / teamsWithMinNumberOfPlayers[0].players.length;
      }
    } else {
      teamsWithMinNumberOfPlayers[0].players.push(playersSorted[i]);
      teamsWithMinNumberOfPlayers[0].avgRating = (teamsWithMinNumberOfPlayers[0].avgRating * (teamsWithMinNumberOfPlayers[0].players.length - 1) + playersSorted[i].rating) / teamsWithMinNumberOfPlayers[0].players.length;
    }
  }

  if (options.balanceKondycja) {
    const lockedPlayerIds = preassignedPlayersTeams.map(p => p.playerId);
    optimizeKondycja(teams, lockedPlayerIds);
    // Recalculate avgKondycja for all teams
    teams.forEach(recalcAvg);
  }

  return teams;
}

// Exported for testing
export { kondycjaScore, optimizeKondycja };
export default createTeams;
