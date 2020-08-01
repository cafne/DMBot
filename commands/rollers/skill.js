var {members, skills, save} = require('../../globals.js')
const DiceBuff = require('../../components/dice_buff.js');
module.exports = {
  name: "skill",
  desc: "preforms dice roll",
  args: false,

  get_alias(cmd) {
    if (skills.length) {
      if (skills.map(item => item.name).includes(cmd)) {
        return this
      }
    }
    return false
  },

  async execute(message, args) {
    
    // Unpack different forms of arguments

    if (args[0].includes(">")) {

      // This format is used for specifying both the user and the target(s).
      // expected input: !attack <user> > <target>

      var character = args[0].substr(0, args[0].indexOf(">")).trim()
      character = members.find(char => char.name == character)
      args[0] = args[0].substr(args[0].indexOf(">")+1).trim()
      var skill = args.pop()
      skill = skills.find(item => item.name == skill)
      var target = args
      target.forEach((item, i) => {
        target[i] = members.find(char => char.name == item)
      });
    } else if (args.length > 1) {

      // This format is used when only a user or target(s) are specified
      // expected input: !attack <target1>, <target2>, <ect...>

      // First we get the skill
      var skill = args.pop()
      skill = skills.find(s => s.name == skill)

      // Then we check if the Player using the skill has a registered character.
      // If we do, we assume that character is the one using the skill.
      var character = members.find(character => character.player_id == message.author.id)

      if (!character) {
        // Early exit if we cannot find a character to use the skill.
        return
      } else {
        // All characters mentioned in the command are targets.
        var target = []
        for (let item of args) {
          let find = members.find(member => item == member.name)
          if (!find) return
          target.push(find)
        }
      }
    } else if (args.length == 1) {

      // This format is for when no characters are specified
      // expected input: !attack

      // We assume both the user and target of the skill are the Player's registered character
      var character = members.find(character => character.player_id == message.author.id)
      var target = [character]
      var skill = skills.find(skill => skill.name == args[0])
    } else return await message.channel.send("Please specify a skill and character.")

    // If any data could not be parsed exit
    if (!character || !skill) return console.log(character, skill, target, "not found");

    // Use the skill on each target
    //character.equip(DiceBuff.create({dice_num:0, dice_sides: 100}))
    for (let t of target) {
      let use = skill.use(character, t)
      if (!use) return
      message.channel.startTyping()
      for (let i of use) {
        if (i.author.icon_url) {
          i.author.icon_url = message.guild.members.cache.get(i.author.icon_url).user.avatarURL()
        }
        await message.channel.send({embed: i})
      }
    }
    await message.channel.stopTyping()
  }
}
