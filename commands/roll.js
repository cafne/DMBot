module.exports = {
  name: "roll",
  desc: "dice roll",
  args: true,
  usage: "<no of dice>d<no of sides>",
  execute(message, args) {
    args = args[0].split("d")

    // Check if there are only two arguments given, and if they are numbers
    if (args.length == 2 && !args.some(isNaN)) {
      var num = args[0]
      var sides = args[1]
      var result = {}

      // Create the embed
      const embed = {
        "description": "",
        "color": 12042918,
        "footer": {
          "text": ""
        },
        "author": {
          "name": "",
          "icon_url": ""
        }
      }

      // Start rolling dice
      for (x=1, len=num; x <= num; x++) {
        result[x] = Math.floor(Math.random() * sides+1)
      }

      // Update Embed
      embed["description"] = `Rolled a ${Object.values(result).reduce((first, next) => first + next)}`
      embed["author"]["name"] = message.author.username
      embed["author"]["icon_url"] = message.author.avatarURL()
      embed["footer"]["text"] = Object.values(result).toString().replace(/,/g, "+")

      message.channel.send(`${num}D${sides}`)
      message.channel.send({embed: embed})
    }
    else {
      message.channel.send("Incorrect syntax.")
    }
  }
}
