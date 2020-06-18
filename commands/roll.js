module.exports = {
  name: "roll",
  desc: "dice roll",
  args: true,
  usage: "<no of dice>d<no of sides>",
  execute(message, args) {
    args = args[0].split("d")
    if (args.length == 2 && !args.some(isNaN)) {
      var num = args[0]
      var sides = args[1]
      message.channel.send(`${num}D${sides}`)
    }
    else {
      message.channel.send("Incorrect syntax.")
    }
  }
}
