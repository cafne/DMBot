var {members, buffs, alias, skills, items, prefix} = require('../../globals.js')
const {save_all, load} = require('../../globals.js');

module.exports = {
  name: "list",
  desc: "Lists custom data.",
  args: true,
  args_length: 1,
  execute(message, args) {
    args = args.shift()
    let send = {title: `Data > ${args.charAt(0).toUpperCase()+args.substr(1)}`}
    switch (args) {
      case "alias":
        if (alias.length) {
          send.description = alias.map(item => {
            return `${prefix+Object.keys(item).toString()}:\`\`\`\n${Object.values(item).toString().replace(/,/g, "\n")}\`\`\`\n`
          }).toString().replace(/,/g, "")
        } else send.description = "```No ailases registered.```"
        break;
      case "members":
        if (members.length) {
          send.description = "```\n" + members.map(char => char.title).toString().replace(/,/g, "\n") + "```"
        } else {
          send.description = "```No characters registered.```"
        }
        break;
      case "skills":
        if (skills.length) {
          send.description = "```\n" +skills.map(skill => `${skill.title}:\n${skill.desc}`).toString().replace(/,/g, "\n\n") + "```"
        } else {
          send.description = "```No skills registered.```"
        }
        break;
      case "buffs":
      if (buffs.length) {
          send.description = "```\n" + buffs.map(buff => `${buff.title}:\n${buff.desc}`).toString().replace(/,/g, "\n\n") + "```"
        } else {
          send.description = "```No buffs registered.```"
        }
        break;
      case "items":
      if (items.length) {
          send.description = "```\n" + items.map(item => `${item.charAt(0).toUpperCase()+item.substr(1)}:\n${skill.desc}`).toString().replace(/,/g, "\n\n") +"```"
        } else {
          send.description = "```No items registered.```"
        }
        break;
      default:
        console.log(`${args} is not part of global data.`);
        return
    }
    message.channel.send({embed: send})
  }
}
