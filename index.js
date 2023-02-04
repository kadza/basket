
import players from "./players.json" assert { type: 'json' };

const createPlayersTable = (players) => {
  var table = document.createElement("table");
  var row = table.insertRow(-1);
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "Imię";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Ocena";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Gra?";
  row.appendChild(headerCell);
  for (var i = 0; i < players.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = players[i].name;
    cell = row.insertCell(-1);
    cell.innerHTML = players[i].rating;
    cell = row.insertCell(-1);
    var element = document.createElement("input");
    element.type = "checkbox";
    element.name = `${players[i].name}-is-playing`;
    cell.appendChild(element);
  }
  var dvTable = document.getElementById("dvTable");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

const createTeamsTable = (teams) => {
  // create table with teams with ratings and players with their rating
  var table = document.createElement("table");
  var row = table.insertRow(-1);
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "Drużyna";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Średnia ocena";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Gracze";
  row.appendChild(headerCell);
  for (var i = 0; i < teams.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = i + 1;
    cell = row.insertCell(-1);
    cell.innerHTML = teams[i].avgRating.toFixed(2);
    cell = row.insertCell(-1);
    cell.innerHTML = teams[i].players.map(player => `${player.name} (${player.rating})`).join(", ");
  }
  var dvTable = document.getElementById("teamsTable");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

const pickTeams = (players) => {
  // sort players in descending order by their rating
  players.sort((a, b) => b.rating - a.rating);

  // divide players into 4 groups of 3 players such that the average ratings are as close as possible
  let groups = [[], [], [], []];
  let avg = players.reduce((sum, player) => sum + player.rating, 0) / 12;

  for (let i = 0; i < players.length;) {
    for (let j = 0; j < 4; j++) {
      if (groups[j].length < 3) {
        groups[j].push(players[i++]);
      }
    }

    groups.sort((a, b) => {
      let diffA = Math.abs(a.reduce((sum, player) => sum + player.rating, 0) / a.length - avg);
      let diffB = Math.abs(b.reduce((sum, player) => sum + player.rating, 0) / b.length - avg);
      return diffA - diffB;
    });
  }

  // calculate the average rating for each group
  let avgGrades = groups.map(group => {
    let sum = 0;
    for (let player of group) {
      sum += player.rating;
    }
    return sum / group.length;
  });

  // print the results in a table format
  console.log("Group | Average Grade | Players");
  console.log("------|---------------|--------");
  for (let i = 0; i < groups.length; i++) {
    console.log(`${i + 1}     | ${avgGrades[i].toFixed(2)}     | ${groups[i].map(player => player.id).join(", ")}`);
  }

  // return groups with avg rating and all players with their rating
  return groups.map((group, i) => {
    return {
      avgRating: avgGrades[i],
      players: group
    }
  }
  );

}

export const generateTeams = () => {
  const playersPlaying = players.filter(player => document.querySelector(`input[name="${player.name}-is-playing"]`).checked);
  const teams = pickTeams(playersPlaying);
  createTeamsTable(teams);
}

createPlayersTable(players);
//on select all button click select all checkboxes
document.getElementById("select-all").addEventListener("click", function () {
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => el.checked = true);
});
document.getElementById("submit").addEventListener("click", generateTeams);
