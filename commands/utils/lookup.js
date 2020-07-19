const args_parse = require('../../components/args_parse.js')
const {member_embed, item_embed, buff_embed, skill_embed,
  members, buffs, skills, items} = require('../../globals.js')

module.exports = {
  name: "lookup",
  desc: "",
  usage: "!lookup <search>, options, go, here",
  args: true,
  async execute(message, args) {
    let search = args[0]
    let search_in = {"members": members, "buffs": buffs, "skills": skills, "items": items}
    let found = undefined

    if (args.length > 1) {
      let filtered = {}
      Object.keys(search_in).forEach((key) => {
        if (args.includes(key)) {
          filtered[key] = search_in[key]
        }
      });
      search_in = filtered
    }

    for (let key of Object.keys(search_in)) {
      found = search_in[key].find(item => item.name == search)
      var found_in_key = key
      if (found) break;
    }

    if (!found) return ;

    switch (found_in_key) {
      case "members":
        var embed = member_embed(found, message.guild)
        break;

      case "items":
        var embed = item_embed(found)
        break;

      case "buffs":
        var embed = buff_embed(found)
        break;

      case "skills":
        var embed = skill_embed(found)
        break;

      default:
        return
    }
    message.channel.send({embed: embed})
  }
}
