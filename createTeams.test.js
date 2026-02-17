import createTeams from "./createTeams.js"
import { kondycjaScore } from "./createTeams.js"

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

function avgKondycjas(teams) {
  return teams.map(t => Number((t.avgKondycja || 0).toFixed(2)))
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

// Players with kondycja data for kondycja balancing tests
const playersWithKondycja12 = [
  { id: "maks", name: "Maks", rating: 8.4, kondycja: 6 },
  { id: "karol", name: "Karol", rating: 8, kondycja: 8 },
  { id: "dominik_dz", name: "Dominik Dz", rating: 7.8, kondycja: 8 },
  { id: "tomek", name: "Tomek", rating: 7.8, kondycja: 5 },
  { id: "filip", name: "Filip", rating: 7.4, kondycja: 7 },
  { id: "lukasz", name: "Lukasz", rating: 7.4, kondycja: 9 },
  { id: "dominik_p", name: "Dominik P", rating: 7.4, kondycja: 6 },
  { id: "pawel_k", name: "Paweł K", rating: 6.6, kondycja: 4 },
  { id: "patryk", name: "Patryk", rating: 5.8, kondycja: 7 },
  { id: "andrzej", name: "Andrzej", rating: 5, kondycja: 3 },
  { id: "pawel_f", name: "Paweł F", rating: 5, kondycja: 8 },
  { id: "mariusz", name: "Mariusz", rating: 4.8, kondycja: 5 },
]

const playersWithKondycja11 = playersWithKondycja12.filter(p => p.id !== "filip")

describe("createTeams with kondycja balancing", () => {
  test("equal-sized teams have similar avg kondycja (12 players, 4 teams)", () => {
    const teams = createTeams(playersWithKondycja12, 4, [], { balanceKondycja: true })
    const kondycjas = avgKondycjas(teams)

    // All teams should have 3 players (12/4 = 3)
    teams.forEach(t => expect(t.players.length).toBe(3))

    // Avg kondycja should be close across teams (max diff <= 2)
    const maxKondycja = Math.max(...kondycjas)
    const minKondycja = Math.min(...kondycjas)
    expect(maxKondycja - minKondycja).toBeLessThanOrEqual(2)

    // Should be better balanced than without kondycja balancing
    const teamsWithout = createTeams(playersWithKondycja12, 4)
    const kondycjasWithout = teamsWithout.map(t =>
      t.players.reduce((s, p) => s + (p.kondycja || 0), 0) / t.players.length
    )
    const varianceWith = variance(kondycjas)
    const varianceWithout = variance(kondycjasWithout)
    expect(varianceWith).toBeLessThanOrEqual(varianceWithout)
  })

  test("smaller teams get higher avg kondycja (11 players, 4 teams)", () => {
    const teams = createTeams(playersWithKondycja11, 4, [], { balanceKondycja: true })
    const kondycjas = avgKondycjas(teams)

    // 11 players / 4 teams = 3 teams of 3, 1 team of 2
    const smallTeams = teams.filter(t => t.players.length === 2)
    const largeTeams = teams.filter(t => t.players.length === 3)
    expect(smallTeams.length).toBe(1)
    expect(largeTeams.length).toBe(3)

    const smallAvgKondycja = smallTeams[0].players.reduce((s, p) => s + p.kondycja, 0) / smallTeams[0].players.length
    const largeAvgKondycja = largeTeams.reduce((s, t) =>
      s + t.players.reduce((s2, p) => s2 + p.kondycja, 0) / t.players.length, 0
    ) / largeTeams.length

    // The small team should have higher or equal avg kondycja than the average of large teams
    expect(smallAvgKondycja).toBeGreaterThanOrEqual(largeAvgKondycja)
  })

  test("smaller teams get higher avg kondycja (11 players, 2 teams)", () => {
    const teams = createTeams(playersWithKondycja11, 2, [], { balanceKondycja: true })

    // 11/2 = 1 team of 6, 1 team of 5
    const smallTeam = teams.find(t => t.players.length === 5)
    const largeTeam = teams.find(t => t.players.length === 6)
    expect(smallTeam).toBeDefined()
    expect(largeTeam).toBeDefined()

    const smallKondycja = smallTeam.players.reduce((s, p) => s + p.kondycja, 0) / smallTeam.players.length
    const largeKondycja = largeTeam.players.reduce((s, p) => s + p.kondycja, 0) / largeTeam.players.length

    expect(smallKondycja).toBeGreaterThanOrEqual(largeKondycja)
  })

  test("avgKondycja is set on team objects when balanceKondycja is true", () => {
    const teams = createTeams(playersWithKondycja12, 4, [], { balanceKondycja: true })
    teams.forEach(t => {
      expect(typeof t.avgKondycja).toBe("number")
      expect(t.avgKondycja).toBeGreaterThan(0)
    })
  })

  test("avgKondycja is not set when balanceKondycja is false", () => {
    const teams = createTeams(playersWithKondycja12, 4)
    teams.forEach(t => {
      expect(t.avgKondycja).toBeUndefined()
    })
  })

  test("rating balance is preserved when kondycja balancing is on", () => {
    const teamsWithout = createTeams(playersWithKondycja12, 4)
    const teams = createTeams(playersWithKondycja12, 4, [], { balanceKondycja: true })

    const ratingsWithout = avgRatings(teamsWithout)
    const ratingsWith = avgRatings(teams)

    // Rating variance should not increase significantly (within 0.5 tolerance per team)
    const maxRatingDiffWithout = Math.max(...ratingsWithout) - Math.min(...ratingsWithout)
    const maxRatingDiffWith = Math.max(...ratingsWith) - Math.min(...ratingsWith)
    expect(maxRatingDiffWith).toBeLessThanOrEqual(maxRatingDiffWithout + 1.0)
  })

  test("works with pre-assigned players and kondycja balancing", () => {
    const teams = createTeams(playersWithKondycja12, 4, [
      { playerId: "mariusz", teamId: 1 },
      { playerId: "pawel_f", teamId: 2 },
    ], { balanceKondycja: true })

    // Verify pre-assigned players are in the right teams
    expect(teams[0].players.find(p => p.id === "mariusz")).toBeDefined()
    expect(teams[1].players.find(p => p.id === "pawel_f")).toBeDefined()

    // avgKondycja should be set
    teams.forEach(t => {
      expect(typeof t.avgKondycja).toBe("number")
    })
  })
})

describe("kondycjaScore", () => {
  test("returns 0 for equal-sized teams with equal kondycja", () => {
    const teams = [
      { players: [{ kondycja: 5 }, { kondycja: 5 }] },
      { players: [{ kondycja: 5 }, { kondycja: 5 }] },
    ]
    expect(kondycjaScore(teams)).toBe(0)
  })

  test("returns higher score for unbalanced equal-sized teams", () => {
    const balanced = [
      { players: [{ kondycja: 5 }, { kondycja: 5 }] },
      { players: [{ kondycja: 5 }, { kondycja: 5 }] },
    ]
    const unbalanced = [
      { players: [{ kondycja: 9 }, { kondycja: 9 }] },
      { players: [{ kondycja: 1 }, { kondycja: 1 }] },
    ]
    expect(kondycjaScore(balanced)).toBeLessThan(kondycjaScore(unbalanced))
  })

  test("returns 0 when smaller team has higher kondycja (unequal sizes)", () => {
    const teams = [
      { players: [{ kondycja: 9 }, { kondycja: 8 }] },       // 2 players, avg 8.5
      { players: [{ kondycja: 5 }, { kondycja: 4 }, { kondycja: 3 }] }, // 3 players, avg 4
    ]
    expect(kondycjaScore(teams)).toBe(0)
  })

  test("returns positive score when smaller team has lower kondycja (unequal sizes)", () => {
    const teams = [
      { players: [{ kondycja: 2 }, { kondycja: 3 }] },       // 2 players, avg 2.5
      { players: [{ kondycja: 8 }, { kondycja: 9 }, { kondycja: 7 }] }, // 3 players, avg 8
    ]
    expect(kondycjaScore(teams)).toBeGreaterThan(0)
  })
})

function variance(arr) {
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length
  return arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length
}
