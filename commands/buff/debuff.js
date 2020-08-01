var {buffs, members} = require('../../globals.js')
const {player_stats} = require('../../config.json')
const args_parse = require('../../components/args_parse.js')

// TODO: Embed for buffs

module.exports = {
  name: "debuff",
  desc: "Removes a buff from a character.",
  usage: "!debuff <target> > <buffs>, <or>, <stats>",

  async execute(message, args) {
    let character = args[0].substr(0, args[0].indexOf(">")).trim()
    args[0] = args[0].substr(args[0].indexOf(">")+1).trim()

    character = members.find(item => item.name == character)

    if (!character) return `Not a valid character.`;

    if (args[0] != "all") {
      for (let key of args) {
        if (Object.keys(player_stats).includes(key)) {
          character[key].remove_all_from_source(null)
        } else {
          let buff = buffs.find(item => item.name == key)
          if (!buff) return `Invalid named buff: ${key}`
          character.unequip(buff)
        }
      }
    } else {
      character.unequip_all()
    }
    await message.channel.send("Removed buffs.")
  }
}
