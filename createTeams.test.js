import createTeams from "./createTeams.js"

const players12 = [
  { id: "maks", name: "Maks", rating: 8.4 },
  { id: "karol", name: "Karol", rating: 8 },
  { id: "dominik_dz", name: "Dominik Dz", rating: 7.8 },
  { id: "tomek", name: "Tomek", rating: 7.8 },
  { id: "filip", name: "Filip", rating: 7.4 },
  { id: "lukasz", name: "Lukasz", rating: 7.4 },
  { id: "dominik_p", name: "Dominik P", rating: 7.4 },
  { id: "pawel_k", name: "Paweł K", rating: 6.6 },
  { id: "patryk", name: "Patryk", rating: 5.8 },
  { id: "andrzej", name: "Andrzej", rating: 5 },
  { id: "pawel_f", name: "Paweł F", rating: 5 },
  { id: "mariusz", name: "Mariusz", rating: 4.8 },
]

const players11 = players12.filter(p => p.id !== "filip")

function avgRatings(teams) {
  return teams.map(t => Number(t.avgRating.toFixed(2)))
}

describe("createTeams", () => {
  test("balances 12 players into 4 teams", () => {
    const teams = createTeams(players12, 4)
    expect(avgRatings(teams)).toEqual([6.93, 6.73, 6.73, 6.73])
  })

  test("balances 11 players into 4 teams", () => {
    const teams = createTeams(players11, 4)
    expect(avgRatings(teams)).toEqual([6.27, 6.67, 6.47, 7.9])
  })

  test("respects pre-assigned players (12 players)", () => {
    const teams = createTeams(players12, 4, [
      { playerId: "mariusz", teamId: 1 },
      { playerId: "pawel_f", teamId: 2 },
    ])
    expect(avgRatings(teams)).toEqual([6.67, 6.47, 6.93, 7.07])
  })

  test("respects pre-assigned players (11 players)", () => {
    const players = players12.filter(p => p.id !== "mariusz")
    const teams = createTeams(players, 4, [
      { playerId: "karol", teamId: 4 },
      { playerId: "maks", teamId: 4 },
    ])
    expect(avgRatings(teams)).toEqual([6.73, 6.73, 6.6, 8.2])
  })
})
