var {sent_emoji, save} = require('../globals.js');

module.exports = {
  name: "⚰️",
  desc: "Reacts to the :coffin: emoji",
  async execute(message) {
    let find = Object.keys(sent_emoji).find(item => item == message.author.id)
    if (find) {
        sent_emoji[message.author.id].dead ++
    }
    else {
      sent_emoji[message.author.id] = {}
      sent_emoji[message.author.id].dead = 1
    }
    save(sent_emoji, "sent_emoji")
    await message.channel.send(`Dead x${sent_emoji[message.author.id].dead}`)
  }
}
