var {members, skills, save} = require('../../globals.js')
const Player = require('../../components/player.js')
const Skill = require('../../components/skill.js');
const Buff = require('../../components/buff.js')

module.exports = {
  name: "skill",
  desc: "preforms dice roll",
  args: false,
  args_length: 2,
  get_alias(cmd) {
    if (skills.length) {
      if (skills.map(item => item.name).includes(cmd)) {
        return this
      }
    }
    return false
  },
  execute(message, args) {
    if (!args.length) {
      return
    }
    else {
      if (args.length == 2) {
        var character = members.find(character => character.name == args[0])
        var skill = skills.find(skill => skill.name == args[1])
      } else if (args.length == 1) {
        var character = members.find(character => character.player_id == message.author.id)
        var skill = skills.find(skill => skill.name == args[0])
      } else return message.channel.send("Please specify a skill and character.")

      if (!character || !skill) return

      // Use the skill
      let result = skill.use(character)

      // Start Embed building
      let character_name = character.name.charAt(0).toUpperCase() + character.name.substr(1)
      let title = `${skill.name.charAt(0).toUpperCase() + skill.name.substr(1)}`
      let footer = `${Object.values(result.roll).toString().replace(/,/g, " + ")}`

      for (var i = 0; i < Object.keys(result.stats).length; i++) {
        if (i > 0 || footer) footer += " + "
        footer += `${result.stats[Object.keys(result.stats)[i]]} (${Object.keys(result.stats)[i].toUpperCase()})`
      }

      let embed = {
        "title": title,
        "description": skill.get_desc(character),
        "color": 12042918,
        "footer": {
          "text": footer
        },
        "author": {
          "name": `${character_name} > Use Skill`,
          "icon_url": message.author.avatarURL()
        },
        "fields": [
          {
            "name": ":game_die:",
            "value": `Rolled a ${result.final}`
          }
        ]
      }
      message.channel.send({embed: embed})
    }
  }
}
