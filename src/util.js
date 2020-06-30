function sortByOasis(a, b) {
  return oasisToNumber(b.oasis) - oasisToNumber(a.oasis);
}

function oasisToNumber(string) {
  let oasis = string.split("/");
  return Number(oasis[1] + oasis[0].padStart(4, "0"));
}

module.exports = {
  sortByOasis,
};
