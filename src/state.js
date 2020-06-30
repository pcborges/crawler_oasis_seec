const fs = require("fs");

function save(fileName, content) {
  const contentString = JSON.stringify(content);
  return fs.writeFileSync(fileName, contentString);
}

function load(fileName) {
  try {
    const fileBuffer = fs.readFileSync(fileName, "utf-8");
    const contentJson = JSON.parse(fileBuffer);
    return contentJson;
  } catch (err) {
    throw new Error("Arquivo não existente.");
  }
}

function deleteState(fileName) {
  return fs.unlinkSync(fileName);
}

module.exports = { save, load, deleteState };
