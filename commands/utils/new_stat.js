var { player_stats } = require('../../config.json')
var { members } = require('../../globals.js')
const confirm_message = require('../../components/confirm_message.js')
const {save} = require('../../globals.js')
const Stat = require('../../components/stats.js')

module.exports = {
    name: "newstat",
    desc: "Creates a new Stat and assigns it to all characters.",
    args: true,
    admin: true,
    async execute(message, args) {
      args = args.filter((item, i, self) => {
        return !player_stats.includes(item.toLowerCase()) && self.indexOf(item) == i
      })
      console.log(args);
      if (await confirm_message(`Add the following stats?\`\`\`\n${args.toString().replace(/,/g, "\n")}\`\`\``, message)) {
        args.forEach((item) => {
          player_stats.push(item.toLowerCase())
          for (var i = 0; i < members.length; i++) {
            members[i][item] = Stat.create(item, 1)
          }
        })
        save(members, "members")
        save(player_stats, "player_stats", location="config.json")
        await message.channel.send("Updated all stats.")
      }
    }
  }
