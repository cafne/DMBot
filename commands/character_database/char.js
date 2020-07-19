var { members } = require('../../globals.js')
const { member_embed } = require('../../globals.js')

module.exports = {
    name: "status",
    desc: "Prints character info.",
    args: true,
    async execute(message, args) {
      let character = members.find(character => character.name == args[0])
      if (character) {
        let embed = member_embed(character, message.guild, true)
        await message.channel.send({embed: embed})
        return
      }
      await message.channel.send("Nothing found.")
    }
}
