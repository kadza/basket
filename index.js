
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

function createGroups1(players) {
  const playersSorted = players.sort((a, b) => b.rating - a.rating);

  const group1 = [];
  const group2 = [];
  const group3 = [];
  const group4 = [];

  for (let i = 0; i < playersSorted.length; i++) {
    const minNumberOfPlayersInGroup = Math.min(group1.length, group2.length, group3.length, group4.length);
    const groups = [group1, group2, group3, group4].filter(group => group.length < minNumberOfPlayersInGroup + 1);

    const group = groups
      .sort((a, b) => {
        const avgA = (a.length > 0) ? a.reduce((acc, curr) => acc + curr.rating, 0) / a.length : 0;
        const avgB = (b.length > 0) ? b.reduce((acc, curr) => acc + curr.rating, 0) / b.length : 0;
        return avgA - avgB;
      }
      )[0];

    group.push(playersSorted[i]);
  }

  return [group1, group2, group3, group4].map(group => {
    return {
      avgRating: group.reduce((acc, curr) => acc + curr.rating, 0) / group.length,
      players: group
    }
  }
  );
}

function createGroups(players) {
  const playersSorted = players.sort((a, b) => b.rating - a.rating);
  // crate 4 groups which total amount of players is equal to players.length


  // fill groups with players
  for (let i = 0; i < playersSorted.length; i++) {
    groups[i % groups.length].push(playersSorted[i]);
  }
}



export const generateTeams = () => {
  const playersPlaying = players.filter(player => document.querySelector(`input[name="${player.name}-is-playing"]`).checked);
  const teams = createGroups(playersPlaying);
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
