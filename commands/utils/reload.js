var {save_all, buffs, members, skills, items, sent_emoji,
  save, load, alias, get_alias,prefix, token, admin_roles} = require('../../globals.js')
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "reload",
  desc: "Reload the bot's save data.",
  args: false,
  admin: true,
  async execute(message, args) {
    if (!args.includes("nosave")) {
      if (args.includes("save")) {
        save_all()
        await message.channel.send("```Saving Data.```")
      } else if (await confirm_message("Save data before reloading?", message)) {
        save_all()
        await message.channel.send("```Saving Data.```")
      }
    }
    try {
      load(buffs, "buffs")
      load(alias, "alias")
      load(skills, "skills")
      load(items, "items")
      load(sent_emoji, "sent_emoji")
      load(members, "members")
    } catch (e) {
      await message.channel.send("```Error: data is invalid.```")
      return console.log(e)
    }
    await message.channel.send("```Data Reloaded.```")
  }
}
