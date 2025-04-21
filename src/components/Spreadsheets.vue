<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-4">💡 Using Google Spreadsheets</h1>
    <!-- Spreadsheet Section -->
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-6 justify-center">
      <div class="flex flex-col w-full sm:w-auto">
        <label
          for="spreadsheet_id"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Spreadsheet ID
        </label>
        <input
          id="spreadsheet_id"
          v-model="spreadsheetId"
          type="text"
          placeholder="Enter Spreadsheet ID"
          class="block w-full sm:w-64 text-sm border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div class="flex flex-col w-full sm:w-auto">
        <label
          for="gid"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          GID
        </label>
        <input
          id="gid"
          v-model="gid"
          type="text"
          placeholder="Enter GID"
          class="block w-full sm:w-64 text-sm border border-gray-300 rounded-lg p-2"
        />
      </div>
      <button
        @click="navigateToSpreadsheet"
        class="bg-indigo-400 text-white px-4 py-2 rounded mt-4 sm:mt-0"
      >
        Spreadsheet View
      </button>
    </div>

    <p class="mb-2 text-left">
      After generating the fixture, you can export it as a CSV file and import
      it into a Google Spreadsheet. If the spreadsheet is <b>public</b> (or
      anyone with the link can view), you can use the fields above to display
      the fixture online in real time using the <b>Spreadsheet View</b>.
    </p>
    <p class="mb-2 text-left">
      This allows anyone to follow the tournament results live, as long as the
      spreadsheet is kept up to date by the tournament administrator.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const spreadsheetId = ref('')
const gid = ref('')

const router = useRouter()

function navigateToSpreadsheet() {
  if (!spreadsheetId.value || !gid.value) {
    alert('Please provide both Spreadsheet ID and GID.')
    return
  }

  router.push(`/spreadsheets/${spreadsheetId.value}?gid=${gid.value}`)
}
</script>