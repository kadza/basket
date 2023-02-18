const createTeams = require("./createTeams")

function assertTeams(teams, avgRating1, avgRating2, avgRating3, avgRating4) {
  //console errors if teams avgRating up to 2 decimal places is not equal to 6.93, 6.73, 6.73, 6.73
  if (teams[0].avgRating.toFixed(2) !== avgRating1.toString()) {
    console.error(`!!! First team avgRating is not equal to ${avgRating1}`)
  }
  if (teams[1].avgRating.toFixed(2) !== avgRating2.toString()) {
    console.error(`!!! Second team avgRating is not equal to ${avgRating2}`)
  }
  if (teams[2].avgRating.toFixed(2) !== avgRating3.toString()) {
    console.error(`!!! Third team avgRating is not equal to ${avgRating3}`)
  }
  if (teams[3].avgRating.toFixed(2) !== avgRating4.toString()) {
    console.error(`!!! Fourth team avgRating is not equal to ${avgRating4}`)
  }
}

function logTeams(teams) {
  console.table(teams.map(team => {
    return {
      avgRating: team.avgRating,
      players: team.players.map(player => `${player.name} (${player.rating})`).join(", ")
    }
  }))
}

function players_16() {
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

  const teams = createTeams(players)

  logTeams(teams)
  assertTeams(teams, 6.93, 6.73, 6.73, 6.73)
}

function players_15() {
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

  const teams = createTeams(players)

  logTeams(teams)
  assertTeams(teams, 6.93, 6.73, 6.73, 6.73)
}

players_15()
// players_16()