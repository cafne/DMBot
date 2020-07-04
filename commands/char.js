var { members } = require('../globals.js')

module.exports = {
    name: "status",
    desc: "Prints character info.",
    args: true,
    execute(message, args) {
      // Placeholder test. If character exists echo name
      if (members.some(character => character.name == args[0])) {
        message.channel.send("Character exists: " + args[0].charAt(0).toUpperCase() + args[0].substr(1))
        return
      }
      message.channel.send("Nothing found.")
    }
}
