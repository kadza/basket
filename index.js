
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

  //add cell with initial team header
  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Drużyna";
  row.appendChild(headerCell);

  for (var i = 0; i < players.length; i++) {
    row = table.insertRow(-1);
    var element = document.createElement("input");
    element.type = "checkbox";
    element.name = `${players[i].id}-is-playing`;
    var cell = row.insertCell(-1);
    cell.appendChild(element);

    cell = row.insertCell(-1);
    cell.innerHTML = players[i].name;

    cell = row.insertCell(-1);
    cell.innerHTML = players[i].rating;

    //add cell with initial team dropdown options should be either 2 teams or 4 teams depending on selected number of teams
    cell = row.insertCell(-1);
    var select = document.createElement("select");
    select.name = `${players[i].id}-team`;
    //get selected number of teams
    var numberOfTeams = document.getElementById("numberOfTeams").value;
    //add option for no team
    var option = document.createElement("option");
    option.value = 0;
    option.text = "Dowolna";
    select.appendChild(option);
    //create options for teams
    for (var j = 1; j <= numberOfTeams; j++) {
      var option = document.createElement("option");
      option.value = j;
      option.text = `Drużyna ${j}`;
      select.appendChild(option);
    }
    cell.appendChild(select);
  }
  var dvTable = document.getElementById("dvTable");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

//on number of teams change update initial team dropdown options
document.getElementById("numberOfTeams").addEventListener("change", () => {
  const players = document.querySelectorAll("select[name$='-team']");
  const numberOfTeams = document.getElementById("numberOfTeams").value;
  players.forEach(player => {
    player.innerHTML = "";
    var option = document.createElement("option");
    option.value = 0;
    option.text = "Dowolna";
    player.appendChild(option);
    for (var j = 1; j <= numberOfTeams; j++) {
      var option = document.createElement("option");
      option.value = j;
      option.text = `Drużyna ${j}`;
      player.appendChild(option);
    }
  });
});

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
  //get preassigned player ids with their teams
  let preassignedPlayers = Array.from(document.querySelectorAll("select[name$='-team']")).map(player => ({ playerId: player.name.split("-")[0], teamId: parseInt(player.value) }));
  // filter out from preassigned players those that are not playing and have team with id 0
  preassignedPlayers = preassignedPlayers.filter(player => player.teamId !== 0).filter(player => document.querySelector(`input[name="${player.playerId}-is-playing"]`).checked);


  const playersPlaying = players.filter(player => document.querySelector(`input[name="${player.id}-is-playing"]`).checked);


  const teams = createTeams(playersPlaying, numberOfTeams, preassignedPlayers);
  console.log(teams);
  createTeamsTable(teams);
}

//add error handling and loading indicator
const response = await fetch("https://opensheet.elk.sh/1YhSB3nBayF7bAMrUyPJPfOnR0QIC1ptdnoqRscz6xYY/tech")
const json = await response.json()
const players = json.map(player => ({ id: player.id, name: player.name, rating: Number.parseFloat(player.avg.replace(",", ".")) }));

createPlayersTable(players);
document.getElementById("submit").addEventListener("click", () => generateTeams(players, parseInt(document.getElementById("numberOfTeams").value)));
