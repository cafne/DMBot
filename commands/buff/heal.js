var {members, member_embed} = require('../../globals.js')
const {player_stats} = require('../../config.json')
const args_parse = require('../../components/args_parse.js')

// TODO: Embed for buffs

module.exports = {
  name: "heal",
  desc: "Restores all of a character's health.",
  usage: "!heal <list>, <of>, <characters>",

  async execute(message, args) {
    for (let member of args) {
      let find = members.find(item => item.name == member)
      if (find) {
        Object.keys(player_stats).forEach((item) => {
          find[item].remove_all_from_source("damage")
        })
        let embed = {
          author: {
            name: `${find.title} > Heal`,
            icon_url: message.guild.members.cache.get(find.player_id).user.avatarURL()
          },
          description: "Fully healed!"
        }
        await message.channel.send({embed: embed})
      }
    }
  }
}
