
import createTeams from "./createTeams.js";

const createPlayersTable = (players) => {
  players = players.sort((a, b) => b.rating - a.rating);
  var table = document.createElement("table");
  var row = table.insertRow(-1);
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "Gra?";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Imię";
  row.appendChild(headerCell);
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Ocena";
  row.appendChild(headerCell);
  for (var i = 0; i < players.length; i++) {
    row = table.insertRow(-1);
    var element = document.createElement("input");
    element.type = "checkbox";
    element.name = `${players[i].name}-is-playing`;
    var cell = row.insertCell(-1);
    cell.appendChild(element);

    cell = row.insertCell(-1);
    cell.innerHTML = players[i].name;

    cell = row.insertCell(-1);
    cell.innerHTML = players[i].rating;
  }
  var dvTable = document.getElementById("dvTable");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

const createTeamsTable = (teams) => {
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

export const generateTeams = (players, numberOfTeams) => {
  const playersPlaying = players.filter(player => document.querySelector(`input[name="${player.name}-is-playing"]`).checked);
  const teams = createTeams(playersPlaying, numberOfTeams);
  console.log(teams);
  createTeamsTable(teams);
}

//add error handling and loading indicator
const response = await fetch("https://opensheet.elk.sh/1YhSB3nBayF7bAMrUyPJPfOnR0QIC1ptdnoqRscz6xYY/tech")
const json = await response.json()
const players = json.map(player => ({ id: player.id, name: player.name, rating: Number.parseFloat(player.avg.replace(",", ".")) }));

createPlayersTable(players);
document.getElementById("submit").addEventListener("click", () => generateTeams(players, parseInt(document.getElementById("numberOfTeams").value)));
