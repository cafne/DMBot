var {save_all, buffs, members, skills, items, sent_emoji,
  save, load, alias, get_alias,prefix, token, admin_roles} = require('../../globals.js')
const confirm_message = require('../../components/confirm_message.js')
const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
  name: "reload",
  desc: "Reload the bot's save data.",
  usage: "!reload (optional:) <save>, <nosave>, <nobackup>",
  args: false,
  admin: true,
  async execute(message, args) {
    if (!args.includes("nosave") && !args.includes("ns")) {
      if (args.includes("save")) {
        save_all()
        await message.channel.send("```Saving Data.```")
      } else if (await confirm_message("Save data before reloading?", message)) {
        save_all()
        await message.channel.send("```Saving Data.```")
      }
    }
    try {
      if (!args.includes("nobackup") && !args.includes("nb")) {
        save_all(true)
        let attachment = new Discord.MessageAttachment('./globals_temp.json')
        await message.author.send(`${message.client.user.tag} data backup!`, attachment)
        fs.unlinkSync("./globals_temp.json")
      }
      load(buffs, "buffs")
      load(alias, "alias")
      load(skills, "skills")
      load(items, "items")
      load(sent_emoji, "sent_emoji")
      load(members, "members")
      await message.channel.send("```Data Reloaded.```")
    } catch (e) {
      await message.channel.send("```Error: data is invalid.```")
      return console.log(e)
    }
  }
}
