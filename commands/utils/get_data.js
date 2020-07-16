const {save_all, members, alias, skills} = require('../../globals.js')
const Discord = require('discord.js');

module.exports = {
  name: "data",
  desc: "Grabs the globals.json file",
  args: false,
  admin: true,
  execute(message, args) {
    save_all()
    attachment = new Discord.MessageAttachment('./globals.json')
    message.channel.send("Heres the bot's global data!", attachment)
  }
}
