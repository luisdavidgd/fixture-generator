<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-4 text-center">Fixture Generator</h1>

    <div class="mb-4">
      <label for="tournament_name" class="block mb-2 text-lg"
        >Tournament Name:</label
      >
      <input
        v-model="tournamentName"
        id="tournament_name"
        type="text"
        class="w-full p-2 mt-1 border rounded"
        placeholder="Enter the tournament name"
      />
    </div>

    <label for="participants" class="block mb-2 text-lg"
      >Enter player names (one per line):</label
    >
    <textarea
      v-model="participantInput"
      id="participants"
      rows="6"
      class="w-full border p-2 mb-4 rounded-lg"
    ></textarea>

    <div class="flex flex-wrap gap-4 justify-center mb-4">
      <button
        @click="generateFixtures"
        class="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition-colors"
      >
        Generate Fixture
      </button>
      <button
        v-if="rounds.length > 0"
        @click="saveAsCSV"
        class="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-400 transition-colors"
      >
        Save as CSV
      </button>
    </div>

    <!-- Summary table -->
    <h2 v-if="rounds.length > 0" class="text-xl font-semibold mb-2 text-center">
      Fixture Summary
    </h2>
    <table
      v-if="rounds.length > 0"
      class="min-w-full table-auto border border-gray-300 mb-6"
    >
      <thead class="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2 border">Date</th>
          <th class="px-4 py-2 border">Match #</th>
          <th class="px-4 py-2 border">Player 1</th>
          <th class="px-4 py-2 border">Player 2</th>
          <th class="px-4 py-2 border">Rest</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(matches, roundIndex) in rounds" :key="roundIndex">
          <tr
            v-for="(match, i) in matches.filter((m) => !m.rest)"
            :key="`match-${roundIndex}-${i}`"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-4 py-2 border text-center">
              Date #{{ roundIndex + 1 }}
            </td>
            <td class="px-4 py-2 border text-center">{{ i + 1 }}</td>
            <td class="px-4 py-2 border text-center">{{ match[0] }}</td>
            <td class="px-4 py-2 border text-center">{{ match[1] }}</td>
            <td class="px-4 py-2 border text-center">—</td>
          </tr>
          <tr
            v-if="matches.find((m) => m.rest)"
            :key="`rest-${roundIndex}`"
            class="italic text-gray-400 dark:text-gray-400"
          >
            <td class="px-4 py-2 border text-center">
              Date #{{ roundIndex + 1 }}
            </td>
            <td class="px-4 py-2 border text-center">—</td>
            <td class="px-4 py-2 border text-center">—</td>
            <td class="px-4 py-2 border text-center">—</td>
            <td class="px-4 py-2 border text-center">
              {{ matches.find((m) => m.rest).rest }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <h2 v-if="rounds.length > 0" class="text-xl font-semibold mb-2 text-center">
      Matches for Date
    </h2>

    <div v-for="(matches, roundIndex) in rounds" :key="roundIndex" class="mb-6">
      <h3 class="text-lg font-medium mb-2">Matchday #{{ roundIndex + 1 }}</h3>

      <table class="min-w-full table-auto border border-gray-300">
        <thead class="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 border">Match #</th>
            <th class="px-4 py-2 border">Player 1</th>
            <th class="px-4 py-2 border">Player 2</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(match, i) in matches.filter((m) => !m.rest)"
            :key="i"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-4 py-2 border text-center">{{ i + 1 }}</td>
            <td class="px-4 py-2 border text-center">{{ match[0] }}</td>
            <td class="px-4 py-2 border text-center">{{ match[1] }}</td>
          </tr>
        </tbody>
      </table>

      <p
        v-if="matches.find((m) => m.rest)"
        class="mt-2 italic text-gray-600 dark:text-gray-400"
      >
        <strong>Rest:</strong> {{ matches.find((m) => m.rest).rest }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const participantInput = ref('')
const tournamentName = ref('')
const rounds = ref([])

const getParticipants = () => {
  return participantInput.value
    .trim()
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p !== '')
}

const validateParticipants = (players) => {
  if (players.length < 2) {
    alert('You must provide at least two participants.')
    return false
  }
  return true
}

const preparePlayers = (players) => {
  if (players.length % 2 !== 0) {
    players.push('Rest')
  }
  return players
}

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const generateRounds = (players) => {
  const totalRounds = players.length - 1
  const result = []
  let currentPlayers = [...players]

  for (let round = 0; round < totalRounds; round++) {
    const matches = []
    for (let i = 0; i < players.length / 2; i++) {
      const p1 = currentPlayers[i]
      const p2 = currentPlayers[players.length - 1 - i]
      if (p1 === 'Rest') {
        matches.push({ rest: p2 })
      } else if (p2 === 'Rest') {
        matches.push({ rest: p1 })
      } else {
        matches.push([p1, p2])
      }
    }
    result.push(matches)
    currentPlayers = [
      currentPlayers[0],
      ...currentPlayers.slice(2),
      currentPlayers[1],
    ]
  }

  return result
}

const generateFixtures = () => {
  const players = getParticipants()
  if (!validateParticipants(players)) return

  const shuffled = shuffleArray(players)
  const fullList = preparePlayers(shuffled)
  rounds.value = generateRounds(fullList)
}

async function saveAsCSV() {
  const rows = []
  if (!rounds.value || rounds.value.length === 0) {
    console.error('No rounds data available to save CSV.')
    return
  }

  console.log('Saving CSV...')

  rows.push([
    'Date',
    'Match Number',
    'Player 1',
    'Player 2',
    'Player 1 Score',
    'Player 2 Score',
    'Rest',
  ])

  rounds.value.forEach((matches, roundIndex) => {
    let matchNumber = 1
    let restPlayer = null

    matches.forEach((match) => {
      if (!match.rest) {
        rows.push([
          `Date #${roundIndex + 1}`,
          matchNumber++,
          match[0],
          match[1],
          '',
          '',
          '',
        ])
      } else {
        restPlayer = match.rest
      }
    })

    if (restPlayer) {
      rows.push([`Date #${roundIndex + 1}`, '', '', '', '', '', restPlayer])
    }
  })

  const csvContent = rows.map((row) => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })

  // Use current timestamp and tournament name for file name
  const timestamp = new Date().toISOString().split('T')[0]
  const fileName = tournamentName.value
    ? `${timestamp}_${tournamentName.value}.csv`
    : `${timestamp}_tournament.csv`

  if (window.showSaveFilePicker) {
    try {
      console.log('Attempting to open Save File Picker...')
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      console.log('File picker opened successfully. Saving the file...')
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()

      console.log('CSV saved successfully.')
    } catch (err) {
      console.error('Error saving fixture CSV:', err)
    }
  } else {
    // Fallback for iOS/Safari
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
</script>

<style scoped>
/* Make the buttons look better */
button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Make textarea more responsive */
textarea {
  resize: vertical;
  min-height: 100px;
}

/* Small screen adjustments */
@media (max-width: 640px) {
  .p-4 {
    padding: 2rem;
  }

  h1 {
    font-size: 2.25rem;
  }

  .mb-4 {
    margin-bottom: 1.5rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}
</style>
