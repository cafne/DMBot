var {buffs, members} = require('../../globals.js')
const {player_stats} = require('../../config.json')
const args_parse = require('../../components/args_parse.js')
const StatModifier = require('../../components/stat_modifier.js')

// TODO: Embed for buffs

module.exports = {
  name: "buff",
  desc: "Applies a buff to a character.",
  usage: "!buff <target> > <buffs>, <stat> +/- <number>",

  async execute(message, args) {
    // !buff character > poisoned, downed
    // !buff character > buffs: poisoned, hp-2, str-2
    let mods = {buffs: "array"}
    Object.keys(player_stats).forEach((item) => {
      mods[item] = "modifier"
    });

    args = args_parse(args, true, mods, singlesKey="buffs")

    if (!args || !args.hasOwnProperty("name")) {
      return console.log(`Arguments are not valid: ${args}`);
    }

    let buff_list = []
    for (item in args.buffs) {
      buff_list.push(buffs.find(buff => buff.name == args.buffs[item]))
    }
    if (buff_list.includes(undefined)) return await message.channel.send("```Error: Named buffs do not exist.```")

    let character = members.find(item => item.name == args.name)
    if (!character) return await message.channel.send("```Error: Character does not exist.```")

    let stat_list = {}
    for (let key of Object.keys(args)) {
      if (!["buffs", "name"].includes(key)) {
        if (!Object.keys(player_stats).includes(key)) return console.log("Error parsing stat mods.")
        stat_list[key] = StatModifier.create(args[key])
      }
    }

    buff_list.forEach((item) => {
      character.equip(item)
    });

    Object.keys(stat_list).forEach((item) => {
      character[item].add_modifier(stat_list[item])
    });

    await message.channel.send(`${character.name} got buffed!`)
  }
}
