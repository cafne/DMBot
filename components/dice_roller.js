module.exports = function dice_roller(num, sides) {
  let result = {}

  // Each time the dice are rolled, we record the roll number and roll result and store it in a new property of <result>
  // We do this rather than just adding the roll result to a total so that we can list each individual roll in the Discord Embed
  // footer

  for (let x=1, len=num; x <= num; x++) {
    result[x] = Math.floor(Math.random() * sides) + 1
  }
  return result
}
