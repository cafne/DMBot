module.exports = {
  name: "⚰️",
  desc: "Reacts to the :coffin: emoji",
  async execute(message) {
    if (message.author.hasOwnProperty("dead")) {
        message.author.dead ++
    }
    else {
      message.author["dead"] = 1
    }
    await message.channel.send(`Dead x${message.author.dead}`)
  }
}
