const {prefix} = require('../globals.js');

module.exports = async function confirm_message(confirm_message, message) {
  message.reply(`${confirm_message} (${prefix}yes / ${prefix}no)`)
  try {
    var confirm = await message.channel.awaitMessages(msg => {
      return msg.author == message.author && msg.channel == message.channel &&
      message.content.startsWith(prefix)
    }, {time: 12000, max: 1})
  } catch (error) {
    message.channel.send("Cancelled. Error.")
    return false
  }
  if (!confirm.first()) {
    message.channel.send("Cancelled.")
    return false
  }
  confirm = confirm.first().toString().substr(1)
  if (confirm == "y" || confirm == "yes" ) {
    return true
  }
  else {
    message.channel.send("Cancelled.")
    return false
  }
}
