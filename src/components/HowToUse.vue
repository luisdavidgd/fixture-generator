<template>
  <div class="max-w-2xl mx-auto p-4 text-left pb-20">
    <h1 class="text-2xl font-bold mb-4">How to Use</h1>

    <p class="mb-2">
      This app helps you generate and track a tournament fixture.
    </p>

    <h2 class="text-xl font-semibold mt-4 mb-2">Step-by-step instructions:</h2>
    <ol class="list-decimal list-inside space-y-2">
      <li>
        Go to <strong>"Home"</strong> and add all participants.
      </li>
      <li>
        Once the fixture is generated, click <strong>"Save as CSV"</strong> to
        save it.
      </li>
      <li>
        To update match results later, go to
        <strong>"Continue"</strong>.
      </li>
      <li>Upload the previously downloaded CSV file.</li>
      <li>
        Edit the match results, save it and download the
        <strong>updated CSV</strong> when done.
      </li>
      <li>
        You can re-upload the updated CSV at any time to continue where you left
        off.
      </li>
    </ol>

    <h2 class="text-xl font-semibold mt-4 mb-2">Why this flow?</h2>
    <p>
      The app does not use a database or store your data online. All progress is
      saved in your CSV file. This allows us to host the app freely using GitHub
      Pages, but it means your tournament data lives only in your downloaded
      file.
    </p>
  </div>
</template>
  