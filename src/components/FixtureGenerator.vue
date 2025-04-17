<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-4 text-center">Fixture Generator</h1>

    <label for="participants" class="block mb-2 text-lg">Enter player names (one per line):</label>
    <textarea v-model="participantInput" id="participants" rows="6" class="w-full border p-2 mb-4 rounded-lg"></textarea>

    <div class="flex flex-wrap gap-4 justify-center mb-4">
      <button @click="generateFixtures" class="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors">
        Generate Fixture
      </button>
      <button v-if="rounds.length > 0" @click="saveAsCSV" class="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition-colors">
        Save as CSV
      </button>
    </div>

    <div v-if="rounds.length > 0">
      <div v-for="(matches, roundIndex) in rounds" :key="roundIndex" class="mb-6">
        <h3 class="font-semibold text-xl mb-2">Date #{{ roundIndex + 1 }}</h3>
        <div v-for="(match, i) in matches" :key="i" class="mb-2">
          <p v-if="match.rest" class="text-gray-600"><strong>Rest:</strong> {{ match.rest }}</p>
          <p v-else class="text-lg">{{ i + 1 }}) {{ match[0] }} vs {{ match[1] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const participantInput = ref('')
const rounds = ref([])

const getParticipants = () => {
  return participantInput.value
    .trim()
    .split('\n')
    .map(p => p.trim())
    .filter(p => p !== '')
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
    currentPlayers = [currentPlayers[0], ...currentPlayers.slice(2), currentPlayers[1]]
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

const saveAsCSV = () => {
  const rows = []
  if (rounds.value.length === 0) {
    alert('No fixture generated to save!')
    return
  }

  rows.push(['Date', 'Match Number', 'Player 1', 'Player 2', 'Player 1 Score', 'Player 2 Score', 'Rest'])

  rounds.value.forEach((matches, roundIndex) => {
    let matchNumber = 1
    let restPlayer = null

    matches.forEach(match => {
      if (!match.rest) {
        rows.push([`Date #${roundIndex + 1}`, matchNumber++, match[0], match[1], '', '', ''])
      } else {
        restPlayer = match.rest
      }
    })

    if (restPlayer) {
      rows.push([`Date #${roundIndex + 1}`, '', '', '', '', '', restPlayer])
    }
  })

  const csvContent = rows.map(row => row.join(',')).join('\n')
  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'fixture_with_scores.csv')
  document.body.appendChild(link)
  link.click()
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
