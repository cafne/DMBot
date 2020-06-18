module.exports = {
  name: "⚰️",
  desc: "he dead",
  execute(message) {
    if (message.author.hasOwnProperty("dead")) {
        message.author.dead ++
    }
    else {
      message.author["dead"] = 1
    }
    message.channel.send(`Dead x${message.author.dead}`)
  }
}
