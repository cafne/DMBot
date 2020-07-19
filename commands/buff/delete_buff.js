var {buffs, alias} = require('../../globals.js')
const {save, buff_embed} = require('../../globals.js')
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "delbuff",
  desc: "Deletes a registered buff.",
  args: true,
  args_length: 1,
  admin: true,
  async execute(message, args) {
    let buff = buffs.find(buff => buff.name == args[0])
    if (buff) {
      let embed = buff_embed(buff, true)
      await message.channel.send({embed: embed})
      if (!await confirm_message(
        "are you sure you want to delete this buff? (This cannot be undone)",
        message)) return
      buffs.splice(buffs.indexOf(buff), 1)
      save(buffs, "buffs")
      await message.channel.send(`Removed buff ${args[0]}`)
    }
    else return await message.channel.send("buff character doesn't exist!")
  }
}
