<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-4">Continue Tournament</h1>

    <div class="flex gap-2 mb-4">
      <input class="bg-blue-400 text-white px-4 py-2 rounded" type="file" @change="handleFileUpload" accept=".csv" />
      <button @click="loadFixture" class="bg-blue-500 text-white px-4 py-2 rounded">Load Fixture</button>
      <button @click="saveUpdatedCSV" class="bg-green-500 text-white px-4 py-2 rounded">Save Updated Fixture</button>
    </div>

    <div class="flex gap-6">
      <div class="flex-1 overflow-y-auto max-h-[80vh]" v-if="rounds.length">
        <div v-for="(round, roundIndex) in rounds" :key="roundIndex" class="mb-6">
          <h3 class="text-lg font-semibold">{{ round.date }}</h3>
          <div v-for="(match, matchIndex) in round.matches" :key="matchIndex" class="mb-2">
            <template v-if="match.rest">
              <p><strong>Rest:</strong> {{ match.rest }}</p>
            </template>
            <template v-else>
              <p>
                {{ matchIndex + 1 }}) {{ match.players[0] }} vs {{ match.players[1] }}<br />
                Score for {{ match.players[0] }}:
                <input
                  type="number"
                  v-model.number="match.scores[0]"
                  class="w-12 mx-2"
                  @input="updateStandings"
                />
                Score for {{ match.players[1] }}:
                <input
                  type="number"
                  v-model.number="match.scores[1]"
                  class="w-12 ml-2"
                  @input="updateStandings"
                />
              </p>
            </template>
          </div>
        </div>
      </div>

      <div class="w-64 flex-shrink-0">
        <h2 class="text-xl font-semibold mb-2">Standings</h2>
        <table class="w-full border border-gray-300">
          <thead>
            <tr>
              <th class="border px-2 py-1">Player</th>
              <th class="border px-2 py-1">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in standings" :key="index">
              <td class="border px-2 py-1">{{ player.player }}</td>
              <td class="border px-2 py-1">{{ player.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const rounds = ref([]);
const standings = ref([]);
const fileContent = ref(null);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileContent.value = e.target.result;
  };
  reader.readAsText(file);
}

function loadFixture() {
  if (!fileContent.value) {
    alert('Please upload a CSV file.');
    return;
  }

  const content = fileContent.value;
  const rows = content.split('\n').map(row => row.split(','));

  const parsedRounds = [];
  let currentRound = null;
  let currentDate = '';
  const startIndex = rows[0][0] === "Date" ? 1 : 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i].map(cell => cell.trim());
    const [date, matchNumber, p1, p2, s1, s2, rest] = row;

    if (!date) continue;

    if (date !== currentDate) {
      currentDate = date;
      currentRound = { date, matches: [] };
      parsedRounds.push(currentRound);
    }

    if (rest) {
      currentRound.matches.push({ rest });
    } else {
      currentRound.matches.push({
        players: [p1, p2],
        scores: [parseInt(s1) || '', parseInt(s2) || '']
      });
    }
  }

  rounds.value = parsedRounds;
  updateStandings();
}

function updateStandings() {
  const scoreMap = {};

  rounds.value.forEach(round => {
    round.matches.forEach(match => {
      if (match.players && match.players.length === 2) {
        const [p1, p2] = match.players;
        const s1 = parseInt(match.scores?.[0]);
        const s2 = parseInt(match.scores?.[1]);

        if (isNaN(s1) || isNaN(s2)) return;

        if (!scoreMap[p1]) scoreMap[p1] = 0;
        if (!scoreMap[p2]) scoreMap[p2] = 0;

        if (s1 > s2) {
          scoreMap[p1] += 3;
        } else if (s1 < s2) {
          scoreMap[p2] += 3;
        } else {
          scoreMap[p1] += 1;
          scoreMap[p2] += 1;
        }
      }
    });
  });

  standings.value = Object.entries(scoreMap)
    .map(([player, points]) => ({ player, points }))
    .sort((a, b) => b.points - a.points);
}

function saveUpdatedCSV() {
  const rows = [["Date", "Match Number", "Player 1", "Player 2", "Player 1 Score", "Player 2 Score", "Rest"]];

  rounds.value.forEach((round) => {
    let matchNumber = 1;

    round.matches.forEach((match) => {
      if (match.rest) {
        rows.push([round.date, matchNumber, '', '', '', '', match.rest]);
      } else {
        const score1 = match.scores?.[0] ?? '';
        const score2 = match.scores?.[1] ?? '';
        rows.push([
          round.date,
          matchNumber,
          match.players[0],
          match.players[1],
          score1,
          score2,
          ''
        ]);
      }
      matchNumber++;
    });
  });

  const csvContent = rows.map(row => row.join(",")).join("\n");
  const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'updated_fixture.csv');
  document.body.appendChild(link);
  link.click();
}
</script>

<style scoped>
input[type="number"] {
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 4px;
}
</style>
