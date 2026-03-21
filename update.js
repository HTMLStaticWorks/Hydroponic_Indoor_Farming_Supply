const fs = require('fs');
const path = require('path');

const htmlFile = 'c:\\slot 4\\Hydroponic Indoor Farming Supply\\dashboard.html';
let content = fs.readFileSync(htmlFile, 'utf-8');
let lines = content.split('\n');

let growStart = -1;
let delivStart = -1;
let endOverview = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!-- Grow Cycles -->')) growStart = i;
    if (lines[i].includes('<!-- Recurring Deliveries -->')) delivStart = i;
    if (lines[i].includes('<!-- Quick Actions & Progress -->')) endOverview = i - 1;
}

if (growStart !== -1 && delivStart !== -1 && endOverview !== -1) {
    let growLines = lines.slice(growStart, delivStart);
    let delivLines = lines.slice(delivStart, endOverview + 1);

    // Remove them from lines
    lines.splice(growStart, (endOverview + 1) - growStart);

    // Re-find placeholders
    let growPhStart = lines.findIndex(l => l.includes('<div id="grow-cycles" class="content-section d-none">'));
    if (growPhStart !== -1) {
        lines.splice(growPhStart + 1, 4, ...growLines);
    }

    let delivPhStart = lines.findIndex(l => l.includes('<div id="deliveries" class="content-section d-none">'));
    if (delivPhStart !== -1) {
        lines.splice(delivPhStart + 1, 4, ...delivLines);
    }

    fs.writeFileSync(htmlFile, lines.join('\n'));
    console.log("HTML restructuring completed successfully with Node.js.");
} else {
    console.log("Could not find sections to extract.");
}
