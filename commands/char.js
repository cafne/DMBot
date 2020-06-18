module.exports = {
    name: "char",
    desc: "prints character info",
    args: true,
    execute(message, args) {
      for (character of members) {
        if (character.name == args[0]) {
          message.channel.send(`${character.name}`)
          return
        }
      }
      message.channel.send("Nothing found.")
    }
}
