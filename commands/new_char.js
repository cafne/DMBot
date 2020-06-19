var {members} = require('../globals.js')
const Player = require('../components/player.js')

module.exports = {
  name: "newchar",
  desc: "creates new character",
  args: true,
  execute(message, args) {
    members.push(Player.create(args[0], 12))
    message.channel.send(`Created new character ${args[0]}`)
  }
}
