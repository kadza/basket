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

//preassignedPlayersTeams = [{playerId: 1, teamId: 1}, {playerId: 2, teamId: 2}]
function createTeams(players, numberOfTeams, preassignedPlayersTeams = []) {

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

  return teams;
}

export default createTeams;