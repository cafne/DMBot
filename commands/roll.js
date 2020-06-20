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


      //Start rolling dice

      for (x=1, len=num; x <= num; x++) {
        result[x] = Math.floor(Math.random() * sides) + 1
      }

      // Each time the dice are rolled, we record the roll number and roll result and store it in a new property of <result>
      // We do this rather than just adding the roll result to a total so that we can list each individual roll in the Discord Embed
      // footer

      // Update Embed

      // .reduce() is used to reduce an array to a single object.
      // The function passed to .reduce() executes from the leftmost item to the next item on the right. The item on the
      // right becomes the new leftmost item, and so forth.
      // In this case, we are telling the function to add all the roll results in our <result> object one at a time from
      // left to right until only the last roll remains. The bot reports this as the final roll value.

      embed["description"] = `Rolled a ${Object.values(result).reduce((first, next) => first + next)}`
      embed["author"]["name"] = message.author.username
      embed["author"]["icon_url"] = message.author.avatarURL()
      embed["footer"]["text"] = Object.values(result).toString().replace(/,/g, "+")

      message.channel.send({embed: embed})
    }
    else {
      message.channel.send("Incorrect syntax.")
    }
  }
}
