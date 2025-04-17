<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-4 text-center">Continue Tournament</h1>

    <!-- Upload Section -->
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-6">
      <div class="flex flex-col w-full sm:w-auto">
        <label
          for="file_input"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Upload file
        </label>
        <input
          id="file_input"
          type="file"
          @change="handleFileUpload"
          accept=".csv"
          class="block w-full sm:w-64 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <div class="flex gap-2 flex-wrap sm:flex-nowrap justify-center">
        <button
          @click="loadFixture"
          class="bg-blue-400 text-white px-4 py-2 rounded"
        >
          Load
        </button>
        <button
          @click="saveUpdatedCSV"
          class="bg-green-400 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          @click="rounds = []; standings = []; fileContent = null"
          class="bg-red-400 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Fixture & Standings -->
    <div v-if="rounds.length" class="mb-4">
      <h2 class="text-xl font-semibold text-center">Fixture Matches</h2>
    </div>

    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Rounds -->
      <div class="flex-1 sm:overflow-y-auto sm:max-h-[80vh]" v-if="rounds.length">
        <div
          v-for="(round, roundIndex) in rounds"
          :key="roundIndex"
          class="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow"
        >
          <h3 class="text-lg font-semibold mb-4 text-blue-400 text-center">
            {{ round.date }}
          </h3>
          <div
            v-for="(match, matchIndex) in round.matches"
            :key="matchIndex"
            class="mb-4 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <template v-if="match.rest">
              <p class="font-medium text-center text-red-400">
                Rest: {{ match.rest }}
              </p>
            </template>
            <template v-else>
              <p class="font-semibold text-center mb-2">
                Match {{ matchIndex + 1 }}: {{ match.players[0] }} vs
                {{ match.players[1] }}
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <div class="flex items-center gap-2 justify-center">
                  <label class="w-24 text-right">{{ match.players[0] }}</label>
                  <input
                    type="number"
                    v-model.number="match.scores[0]"
                    class="w-16 px-2 py-1 border rounded text-center"
                    @input="updateStandings"
                  />
                </div>
                <div class="flex items-center gap-2 justify-center">
                  <label class="w-24 text-right">{{ match.players[1] }}</label>
                  <input
                    type="number"
                    v-model.number="match.scores[1]"
                    class="w-16 px-2 py-1 border rounded text-center"
                    @input="updateStandings"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Standings -->
      <div v-if="standings.length" class="w-full sm:w-64 flex-shrink-0">
        <h2 class="text-xl font-semibold mb-2 text-center">Current Standings</h2>
        <table class="w-full border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr>
              <th class="border px-2 py-2">Player</th>
              <th class="border px-2 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in standings" :key="index">
              <td class="border px-2 py-2">{{ player.player }}</td>
              <td class="border px-2 py-2">{{ player.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const rounds = ref([])
const standings = ref([])
const fileContent = ref(null)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target.result
  }
  reader.readAsText(file)
}

function loadFixture() {
  if (!fileContent.value) {
    alert('Please upload a CSV file.')
    return
  }

  const content = fileContent.value
  const rows = content.split('\n').map((row) => row.split(','))

  const parsedRounds = []
  let currentRound = null
  let currentDate = ''
  const startIndex = rows[0][0] === 'Date' ? 1 : 0

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i].map((cell) => cell.trim())
    const [date, matchNumber, p1, p2, s1, s2, rest] = row

    if (!date) continue

    if (date !== currentDate) {
      currentDate = date
      currentRound = { date, matches: [] }
      parsedRounds.push(currentRound)
    }

    if (rest) {
      currentRound.matches.push({ rest })
    } else {
      currentRound.matches.push({
        players: [p1, p2],
        scores: [parseInt(s1) || '', parseInt(s2) || ''],
      })
    }
  }

  rounds.value = parsedRounds
  updateStandings()
}

function updateStandings() {
  const scoreMap = {}

  rounds.value.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.players && match.players.length === 2) {
        const [p1, p2] = match.players
        const s1 = parseInt(match.scores?.[0])
        const s2 = parseInt(match.scores?.[1])

        if (isNaN(s1) || isNaN(s2)) return

        if (!scoreMap[p1]) scoreMap[p1] = 0
        if (!scoreMap[p2]) scoreMap[p2] = 0

        if (s1 > s2) {
          scoreMap[p1] += 3
        } else if (s1 < s2) {
          scoreMap[p2] += 3
        } else {
          scoreMap[p1] += 1
          scoreMap[p2] += 1
        }
      }
    })
  })

  standings.value = Object.entries(scoreMap)
    .map(([player, points]) => ({ player, points }))
    .sort((a, b) => b.points - a.points)
}

function saveUpdatedCSV() {
  const rows = [
    [
      'Date',
      'Match Number',
      'Player 1',
      'Player 2',
      'Player 1 Score',
      'Player 2 Score',
      'Rest',
    ],
  ]

  rounds.value.forEach((round) => {
    let matchNumber = 1

    round.matches.forEach((match) => {
      if (match.rest) {
        rows.push([round.date, matchNumber, '', '', '', '', match.rest])
      } else {
        const score1 = match.scores?.[0] ?? ''
        const score2 = match.scores?.[1] ?? ''
        rows.push([
          round.date,
          matchNumber,
          match.players[0],
          match.players[1],
          score1,
          score2,
          '',
        ])
      }
      matchNumber++
    })
  })

  const csvContent = rows.map((row) => row.join(',')).join('\n')
  const encodedUri =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'updated_fixture.csv')
  document.body.appendChild(link)
  link.click()
}
</script>

<style scoped>
input[type='number'] {
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 4px;
}
</style>
