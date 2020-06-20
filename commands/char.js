var { members } = require('../globals.js')

module.exports = {
    name: "status",
    desc: "Prints character info.",
    args: true,
    execute(message, args) {
      for (character of members) {
        // Placeholder test. If character exists echo name
        if (character.name == args[0]) {
          message.channel.send("Character exists: " + character.name.charAt(0).toUpperCase() + character.name.substr(1))
          return
        }
      }
      message.channel.send("Nothing found.")
    }
}
