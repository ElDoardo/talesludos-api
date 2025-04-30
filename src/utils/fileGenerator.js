const fs = require('fs').promises;
const path = require('path');

async function ensureDirectoryExists(dirPath) {
    try {
        await fs.access(dirPath);
    } catch (error) {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Gerar index.html
async function generateGameIndex({ folder, imageName }) {
    const fullPath = path.join(__dirname, `../../${folder}`);
    await ensureDirectoryExists(fullPath);
    
    const content = `
<!DOCTYPE html>
<html>
<head>
    <script src='js/p5.js'></script>
    <script src='js/p5.dom.min.js'></script>
    <script src='js/p5.sound.min.js'></script>
    <link rel='stylesheet' type='text/css' href='css/style.css'>
    <meta charset='utf-8'>
</head>
<body>
    <span style='display:none;'><img src='media/marca.png' id='marca'></span>
    <span style='display:none;'><img src='media/walk.png' id='walk'></span>
    <span style='display:none;'><img src='media/idle.png' id='idle'></span>
    <script src='config/game.js'></script>
    <script src='config/digitos.js'></script>
    <script src='js/scenario.js'></script>
    <script src='js/particula.js'></script>
    <script src='js/sketch.js'></script>
    <script src='js/confetti.js'></script>
</body>
    <span style='display:none;'><img src='media/tablet.png' id='fundo'></span>
    <span style='display:none;'><img src='media/${imageName}' id='mapa'></span>
</html>`;

    await fs.writeFile(path.join(fullPath, 'index.html'), content);
}

// Gerar game.js
async function generateGameScript({ folder, title, description, marks, links, scenes, challenges }) {
    const configPath = path.join(__dirname, `../../${folder}/config`);
    await ensureDirectoryExists(configPath);

    const content = `
var game = {
    "title": "${title.replace(/"/g, '\\"')}",
    "introduce": "${description.replace(/"/g, '\\"').replace(/\r|\n/g, '')}",
    "marks": ${marks},
    "links": ${links},
    "scenes": ${scenes},
    "challenges": ${challenges}
}`;

    await fs.writeFile(path.join(configPath, 'game.js'), content);
}

module.exports = { generateGameIndex, generateGameScript };