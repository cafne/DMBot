var {members, save} = require('../globals.js')
const Player = require('../components/player.js')

module.exports = {
  name: "newchar",
  desc: "creates new character",
  args: true,
  execute(message, args) {
    for (character of members){
      if (character.name == args[0]){
        message.channel.send("That character already exists!")
        return
      }
    }
    members.push(Player.create(args[0], 12))
    save(members, "members")
    message.channel.send(`Created new character ${args[0]}`)
  }
}
