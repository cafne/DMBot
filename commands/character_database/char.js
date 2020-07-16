var { members } = require('../../globals.js')

module.exports = {
    name: "status",
    desc: "Prints character info.",
    args: true,
    execute(message, args) {
      // Placeholder test. If character exists echo name
      let character = members.find(character => character.name == args[0])
      if (character) {
        let embed = {
          "author": {
            "name": args[0].charAt(0).toUpperCase() + args[0].substr(1),
            "icon_url": message.author.avatarURL()
          },
          "fields": [
            {
              "name": ":crossed_swords: Stats",
              "value": character.get_stats(true)
            },
          ]
        }
        //message.channel.send("Character exists: " + args[0].charAt(0).toUpperCase() + args[0].substr(1))
        message.channel.send({embed: embed})
        return
      }
      message.channel.send("Nothing found.")
    }
}
