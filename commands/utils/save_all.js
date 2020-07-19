const {save_all} = require('../../globals.js')
const Discord = require('discord.js');

module.exports = {
  name: "save",
  desc: "Saves the bot's data.",
  args: false,
  admin: true,
  async execute(message, args) {
    save_all()
    await message.channel.send("```All data has been saved.```")
  }
}
