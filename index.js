const crawler = require("./src/crawler");
const sheets = require("./src/googleSheets");
const sanitizer = require("./src/sanitizer");

async function start() {
  try {
    await crawler.start();
    await sheets.get();
    const sanitizedData = await sanitizer.start();
    await sheets.update(sanitizedData);
  } catch (err) {
    console.error("> [Error]", err);
  }
}

start();
