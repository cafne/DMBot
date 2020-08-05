const {prefix} = require('../../globals.js')

module.exports = {
  name: "help",
  desc: "List commands",
  args: false,
  async execute(message, args) {
    let send = ""
    let cmd_list = message.author.client.commands
    Array.from(message.author.client.commands.keys()).forEach((item) => {
      let cmd = cmd_list.get(item)
      if (cmd && item != undefined) {
        send += `${prefix}${cmd.name}${(cmd.usage) ? `: \`${cmd.usage}\`` : ""}\n${(cmd.desc) ? `*${cmd.desc}*` : ""}\n\n`
      }
    })
    let embed = {
      title: "Data > Commands",
      description: send.trim()
    }
    message.channel.send({embed:embed})
  }
}
