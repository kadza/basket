const createTeams = require("./createTeams")

function assertTeams(teams, avgRatings) {
  teams.forEach((team, index) => {
    if (team.avgRating.toFixed(2) !== avgRatings[index].toFixed(2)) {
      console.error(`!!! Team ${index + 1} avgRating ${team.avgRating.toFixed(2)} is not equal to ${avgRatings[index]}`)
    }
  })
}

function logTeams(teams) {
  console.table(teams.map(team => {
    return {
      avgRating: Number(team.avgRating.toFixed(2)),
      players: team.players.map(player => `${player.name} (${player.rating})`).join(", ")
    }
  }))
}

function players_12() {
  const players = [
    {
      "id": "maks",
      "name": "Maks",
      "rating": 8.4
    },
    {
      "id": "karol",
      "name": "Karol",
      "rating": 8
    },
    {
      "id": "dominik_dz",
      "name": "Dominik Dz",
      "rating": 7.8
    },
    {
      "id": "tomek",
      "name": "Tomek",
      "rating": 7.8
    },
    {
      "id": "filip",
      "name": "Filip",
      "rating": 7.4
    },
    {
      "id": "lukasz",
      "name": "Lukasz",
      "rating": 7.4
    },
    {
      "id": "dominik_p",
      "name": "Dominik P",
      "rating": 7.4
    },
    {
      "id": "pawel_k",
      "name": "Paweł K",
      "rating": 6.6
    },
    {
      "id": "patryk",
      "name": "Patryk",
      "rating": 5.8
    },
    {
      "id": "andrzej",
      "name": "Andrzej",
      "rating": 5
    },
    {
      "id": "pawel_f",
      "name": "Paweł F",
      "rating": 5
    },
    {
      "id": "mariusz",
      "name": "Mariusz",
      "rating": 4.8
    }
  ]

  const teams = createTeams(players, 4)

  logTeams(teams)
  assertTeams(teams, [6.93, 6.73, 6.73, 6.73])
}

function players_11() {
  const players = [
    {
      "id": "maks",
      "name": "Maks",
      "rating": 8.4
    },
    {
      "id": "karol",
      "name": "Karol",
      "rating": 8
    },
    {
      "id": "dominik_dz",
      "name": "Dominik Dz",
      "rating": 7.8
    },
    {
      "id": "tomek",
      "name": "Tomek",
      "rating": 7.8
    },
    {
      "id": "lukasz",
      "name": "Lukasz",
      "rating": 7.4
    },
    {
      "id": "dominik_p",
      "name": "Dominik P",
      "rating": 7.4
    },
    {
      "id": "pawel_k",
      "name": "Paweł K",
      "rating": 6.6
    },
    {
      "id": "patryk",
      "name": "Patryk",
      "rating": 5.8
    },
    {
      "id": "andrzej",
      "name": "Andrzej",
      "rating": 5
    },
    {
      "id": "pawel_f",
      "name": "Paweł F",
      "rating": 5
    },
    {
      "id": "mariusz",
      "name": "Mariusz",
      "rating": 4.8
    }
  ]

  const teams = createTeams(players, 4)

  logTeams(teams)
  assertTeams(teams, [6.27, 6.67, 6.47, 7.90])
}

players_11()
players_12()