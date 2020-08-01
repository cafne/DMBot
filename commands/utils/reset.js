var {members, buffs, alias, skills, items} = require('../../globals.js')
var {player_stats} = require('../../config.json')
const {save_all, load} = require('../../globals.js');
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "reset",
  desc: "Resets all data.",
  args: true,
  admin: true,
  async execute(message, args) {
    if (args.includes("all")) {
      args = ["alias", "items", "members", "skills", "buffs", "player_stats"]
    }
    if (await confirm_message(`are you sure you want to reset the following data?:\`\`\`\n${args.toString().replace(/,/g, "\n")}\`\`\`\n`, message)){
      args.forEach((item) => {
        switch (item) {
          case "alias":
            alias.splice(0, alias.length)
            break;
          case "members":
            members.splice(0, members.length)
            break;
          case "skills":
            skills.splice(0, skills.length)
            break;
          case "buffs":
            buffs.splice(0, buffs.length)
            break;
          case "items":
            items.splice(0, items.length)
            break;
          case "player_stats":
            player_stats = {}
            break;
          default:
            console.log(item);
            break;
        }
      });
      save_all()
      await message.channel.send("```Data reset.```")
    }
  }
}
