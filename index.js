
import createTeams from "./createTeams.js";

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

export const generateTeams = () => {
  const playersPlaying = players.filter(player => document.querySelector(`input[name="${player.name}-is-playing"]`).checked);
  const teams = createTeams(playersPlaying, 4);
  console.log(teams);
  createTeamsTable(teams);
}

// async fetch players from json file
const players = await fetch("players.json").then(response => response.json());

createPlayersTable(players);
//on select all button click select all checkboxes
document.getElementById("select-all").addEventListener("click", function () {
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => el.checked = true);
});
document.getElementById("submit").addEventListener("click", generateTeams);
