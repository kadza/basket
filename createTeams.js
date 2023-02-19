function createEmptyTeams(numberOfPlayers, numberOfTeams) {
  const teams = []

  const teamSize = Math.floor(numberOfPlayers / numberOfTeams);
  const numberOfTeamsWithExtraPlayer = numberOfPlayers % numberOfTeams;
  for (let i = 0; i < numberOfTeams; i++) {
    teams.push({
      players: [],
      size: teamSize + (i < numberOfTeamsWithExtraPlayer ? 1 : 0),
      avgRating: 0
    });
  }

  return teams;
}

function createTeams(players, numberOfTeams) {
  //sort players by rating descending
  const playersSorted = players.sort((a, b) => b.rating - a.rating);

  const teams = createEmptyTeams(players.length, numberOfTeams);
  // get team min size
  const minTeamSize = Math.min(...teams.map(team => team.size));

  for (let i = 0; i < playersSorted.length; i++) {
    //filter teams with the number of players pushed is less than the team size
    const notFullTeams = teams.filter(team => team.players.length < team.size).sort((a, b) => a.avgRating - b.avgRating);

    //filter teams with the minimum number of players from all teams
    const sortedTeamsByNumberOfPlayers = notFullTeams.sort((a, b) => a.players.length - b.players.length)
    const teamsWithMinNumberOfPlayers = sortedTeamsByNumberOfPlayers.filter(team => team.players.length === sortedTeamsByNumberOfPlayers[0].players.length);

    // check if teams have equal size, if not then add player to the team with smaller size
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

module.exports = createTeams;