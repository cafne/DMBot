const args_parse = require('../../components/args_parse.js')
const {member_embed, item_embed, buff_embed, skill_embed, lookup} = require('../../globals.js')

module.exports = {
  name: "lookup",
  desc: "",
  usage: "!lookup <search>, options, go, here",
  args: true,
  async execute(message, args) {
    let search = args.shift()
    let found = lookup(search, args)
    if (!found) return ;

    switch (found.found_in_key) {
      case "members":
        var embed = member_embed(found.item, message.guild)
        break;

      case "items":
        var embed = item_embed(found.item)
        break;

      case "buffs":
        var embed = buff_embed(found.item)
        break;

      case "skills":
        var embed = skill_embed(found.item)
        break;

      default:
        return
    }
    message.channel.send({embed: embed})
  }
}
