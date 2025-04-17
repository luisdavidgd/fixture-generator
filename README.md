# Fixture Generator

A web application built with Vue 3 and Tailwind CSS that allows you to easily generate and manage tournament fixtures.  
Perfect for sports competitions, card games, board games, or any event where players face each other round by round.

## Features

- 🛠️ Automatic fixture generation with support for an odd number of players (including rest rounds).
- 📅 Clear visualization of rounds, matchups, and players resting.
- 📝 Enter and edit match results with automatic standings updates.
- 📥 Export and import fixtures in CSV format to continue your tournament later.
- 📱 Responsive design optimized for mobile devices.

## Installation & Usage

### Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/luisdavidgd/fixture-generator.git
   cd fixture-generator
   ```
2. Install dependencies:

```bash
npm install
# or
yarn install
```
3. Start the development server:
```bash
npm run dev
# or
yarn dev
```
4. Open http://localhost:5173 in your browser to use the app.

## How to Use
### Generate a Fixture
1. Enter the names of the participants (one per line).

2. Click on Generate Fixture to create the schedule.

3. View the generated rounds and export the fixture as a CSV if needed.

### Continue a Tournament
1. In the Continue Tournament section, upload a previously exported CSV file.

2. Edit match results directly in the interface.

3. The standings will update automatically.

4. Export the updated CSV to save your progress.

## Project Structure
```bash
fixture-generator/
├── public/
│   └── ... static assets
├── src/
│   ├── components/      # Vue components
│   ├── views/           # App views
│   ├── App.vue
│   ├── main.js
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```
## Contributing
Contributions are welcome!
To contribute:

1. Fork the repo

2. Create a new branch: git checkout -b feature/your-feature-name

3. Make your changes and commit them: git commit -m 'Add feature'

4. Push to your branch: git push origin feature/your-feature-name

5. Open a Pull Request

## License
This project is licensed under the MIT License.