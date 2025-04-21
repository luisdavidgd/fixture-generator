<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Fixture from Spreadsheet</h1>

    <div v-if="loading" class="text-gray-500">Loading CSV...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Layout -->
    <div class="flex flex-col lg:flex-row lg:gap-6">
      <!-- Left side: Rounds (scrollable only in lg) -->
      <div
        class="flex-1 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2"
      >
        <div
          v-for="(matchups, round) in rounds"
          :key="round"
          class="mb-6 border p-4 rounded shadow"
        >
          <h2 class="text-xl font-semibold mb-2">{{ round }}</h2>
          <ul>
            <li
              v-for="(match, index) in matchups"
              :key="index"
              class="mb-2 flex justify-between"
            >
              <span v-if="match.type === 'match'">
                <span v-if="match.score1 !== '' && match.score2 !== ''">
                  <span :class="{ 'font-bold': match.score1 > match.score2 }">
                    {{ match.player1 }} ({{ match.score1 }})
                  </span>
                  vs
                  <span :class="{ 'font-bold': match.score2 > match.score1 }">
                    {{ match.player2 }} ({{ match.score2 }})
                  </span>
                </span>
                <span v-else> {{ match.player1 }} vs {{ match.player2 }} </span>
              </span>
              <span v-else class="italic text-gray-600">
                {{ match.player }} rest
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right side: Standings -->
      <div
        class="mt-8 lg:mt-0 lg:w-80 lg:shrink-0 border p-4 rounded shadow h-fit lg:sticky lg:top-4 lg:self-start"
      >
        <h2 class="text-xl font-bold mb-4">Standings</h2>
        <table class="min-w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-600 text-left">
              <th class="p-2 border">Player</th>
              <th class="p-2 border">GP</th>
              <th class="p-2 border">W</th>
              <th class="p-2 border">L</th>
              <!-- <th class="p-2 border">BYE</th> -->
              <th class="p-2 border">PTS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="[player, stats] in sortedStandings"
              :key="player"
              class="border-t"
            >
              <td class="p-2 border">{{ player }}</td>
              <td class="p-2 border">{{ stats.played }}</td>
              <td class="p-2 border">{{ stats.wins }}</td>
              <td class="p-2 border">{{ stats.losses }}</td>
              <!-- <td class="p-2 border">{{ stats.byes }}</td> -->
              <td class="p-2 border font-bold">{{ stats.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Get the spreadsheet ID from the URL route
const route = useRoute()
const spreadsheetId = route.params.spreadsheetId
const gid = route.query.gid || 0

// Build the Google Sheets CSV export URL
const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&id=${spreadsheetId}&gid=${gid}`

const rounds = ref({})
const loading = ref(true)
const error = ref('')

// Parse the CSV into a dictionary of rounds
function parseCSV(csv) {
  const lines = csv
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  lines.shift() // Remove the header row

  const parsedRounds = {}

  for (const line of lines) {
    const [date, , player1, player2, score1, score2, rest] = line
      .split(',')
      .map((s) => s.trim())

    if (!parsedRounds[date]) {
      parsedRounds[date] = []
    }

    if (player1 && player2) {
      parsedRounds[date].push({
        type: 'match',
        player1,
        player2,
        score1,
        score2,
      })
    } else if (rest) {
      parsedRounds[date].push({
        type: 'bye',
        player: rest,
      })
    }
  }

  return parsedRounds
}

// Load and parse the CSV on component mount
onMounted(async () => {
  try {
    const res = await fetch(csvUrl)
    if (!res.ok) throw new Error('Failed to load CSV file')
    const csvText = await res.text()
    rounds.value = parseCSV(csvText)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Compute standings from parsed rounds
const standings = computed(() => {
  const stats = {}

  for (const matchups of Object.values(rounds.value)) {
    for (const match of matchups) {
      if (match.type === 'match') {
        const { player1, player2, score1, score2 } = match

        if (!stats[player1])
          stats[player1] = { played: 0, wins: 0, losses: 0, byes: 0, points: 0 }
        if (!stats[player2])
          stats[player2] = { played: 0, wins: 0, losses: 0, byes: 0, points: 0 }

        const hasScores = score1 !== '' && score2 !== ''

        if (hasScores) {
          stats[player1].played++
          stats[player2].played++

          if (+score1 > +score2) {
            stats[player1].wins++
            stats[player2].losses++
            stats[player1].points++
          } else if (+score2 > +score1) {
            stats[player2].wins++
            stats[player1].losses++
            stats[player2].points++
          }
        }
      } else if (match.type === 'bye') {
        const player = match.player
        if (!stats[player])
          stats[player] = { played: 0, wins: 0, losses: 0, byes: 0, points: 0 }
        stats[player].byes++
      }
    }
  }

  return stats
})

const sortedStandings = computed(() => {
  return Object.entries(standings.value).sort(([, a], [, b]) => {
    if (b.points !== a.points) return b.points - a.points
    return b.wins - a.wins
  })
})
</script>
