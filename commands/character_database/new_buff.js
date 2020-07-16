var {buffs} = require('../../globals.js')
const Buff = require('../../components/buff.js')
const args_parse = require('../../components/args_parse.js')
const confirm_message = require('../../components/confirm_message.js');
const {player_stats} = require('../../config.json')

module.exports = {
  name: "newbuff",
  desc: "Adds a new buff to the database.",
  usage: "!newbuff <name> >" +
         "desc: <description>" +
         "str/int/hp/dex: <number>",

  async execute(message, args) {

    // Unpack arguments: for options explaination see /components/args_parse.js
    let mods = {}
    player_stats.forEach((item) => {
      mods[item] = "modifier"
    });

    args = args_parse(args, true, mods)

    // Exit if non-optional values were not set
    if (!args || !args.hasOwnProperty("name")) return message.channel.send("```Error: arguments are not valid.```")

    let newbuff = Buff.create(args)

    // Lazy embed
    let embed = {
      "title": newbuff.title,
      "description": (args.desc) ? args.desc.charAt(0).toUpperCase() + args.desc.substr(1) : "",
      "fields": [
        {
          "name": ":shield: Stat Changes:",
          "value": newbuff.get_stats(pretty_print=true)
        }
      ]
    }

    message.channel.send({embed:embed})
    if (await confirm_message("are you sure you want to create this buff?", message)) {
      buffs.push(newbuff)
      save(buffs, "buffs")
      message.channel.send(`\`\`\`Created buff: ${newbuff.title}\`\`\``)
    } else return ;
  }
}
