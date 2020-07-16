var {members, alias} = require('../../globals.js')
const {save} = require('../../globals.js')
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "delchar",
  desc: "Deletes a character.",
  args: true,
  args_length: 1,
  async execute(message, args) {
    var character = members.find(character => character.name == args[0])
    if (character) {
      if (!await confirm_message(
        "are you sure you want to delete this character? (This cannot be undone)",
        message)) return
      members.splice(members.indexOf(character), 1)
      save(members, "members")
      message.channel.send(`Removed character ${args[0]}`)
    }
    else return message.channel.send("That character doesn't exist!")
  }
}
