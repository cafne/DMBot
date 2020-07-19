var { skills, buffs, alias } = require('../../globals.js')
const { player_stats } = require('../../config.json')
const { save, validate_command_name } = require('../../globals.js')
const Skill = require('../../components/skill.js')
const args_parse = require('../../components/args_parse.js')
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "newskill",
  desc: "Adds a new skill to the skill list.",
  args: true,
  admin: true,
  usage: "!newskill <skill_name> >" +
         "(optional) dice: <no. of dice>d<no. of sides>," +
         "desc: <description of skill> (use 'name' as a placeholder for character name)"+
         "stats: list of stats," +
         "buff: <existing or new>" +
         "bufftime: <before> or <after> (defaults to before)",

  async execute(message, args) {
    commands = message.client.commands.map(command => command.name)

    new_skill = Skill.create(args_parse(args, true, {"stats": "array", "dice": "dice", "buffs": "array"}))

    if (new_skill.hasOwnProperty("buffs")) {
      new_skill.buffs.forEach((item, i) => {
        new_skill.buffs[i] = buffs.find(buff => buff.name = item)
      });
      if (new_skill.buffs.includes(undefined)) return await message.channel.send("```Error: could not find buffs.```")
    }

    if (!new_skill || new_skill.name == "" || !new_skill.stats.every(
      item => player_stats.includes(item))) {
      return await message.channel.send("```Error: arguments are not valid.```")
    }

    if (!validate_command_name(new_skill.name)) {
      return await message.channel.send("```Error: there is a conflict with the command name```")
    }

    console.log(new_skill);

    skills.push(new_skill)

    save(skills, "skills")
    await message.channel.send(`Created new skill ${new_skill.name.charAt(0).toUpperCase()+new_skill.name.substr(1)}`)
  }
}
