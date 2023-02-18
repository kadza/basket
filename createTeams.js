function createTeams(players) {
  //sort players by rating descending
  const playersSorted = players.sort((a, b) => b.rating - a.rating);
  //create four groups with equal amount of players, add player to a group with the lowest average rating
  const groups = [[], [], [], []];
  for (let i = 0; i < playersSorted.length; i++) {
    const minNumberOfPlayersInGroup = Math.min(groups[0].length, groups[1].length, groups[2].length, groups[3].length);
    const groupsWithMinNumberOfPlayers = groups.filter(group => group.length === minNumberOfPlayersInGroup);
    const group = groupsWithMinNumberOfPlayers
      .sort((a, b) => {
        const avgA = (a.length > 0) ? a.reduce((acc, curr) => acc + curr.rating, 0) / a.length : 0;
        const avgB = (b.length > 0) ? b.reduce((acc, curr) => acc + curr.rating, 0) / b.length : 0;
        return avgA - avgB;
      }
      )[0];
    group.push(playersSorted[i]);
  }


  //create teams
  const teams = [];
  for (let i = 0; i < groups.length; i++) {
    const team = {
      players: [],
      avgRating: 0,
    };
    for (let j = 0; j < groups[i].length; j++) {
      team.players.push(groups[i][j]);
      team.avgRating += groups[i][j].rating;
    }
    team.avgRating /= team.players.length;
    teams.push(team);
  }

  return teams;
}

module.exports = createTeams;