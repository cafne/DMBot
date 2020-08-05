const {prefix, isAdmin} = require('../../globals.js')

module.exports = {
  name: "help",
  desc: "List commands",
  args: false,
  async execute(message, args) {
    let send = ""
    let cmd_list = message.author.client.commands
    let user_admin = isAdmin(message.member)
    Array.from(message.author.client.commands.keys()).forEach((item) => {
      let cmd = cmd_list.get(item)
      if (cmd && item != undefined && ((cmd.admin && user_admin) || !cmd.admin)) {
        send += `${prefix}${cmd.name}${(cmd.usage) ? `: \`${cmd.usage}\`` : ""}\n${(cmd.desc) ? `*${cmd.desc}*` : ""}\n\n`
      }
    })
    let embed = {
      title: "Data > Commands",
      description: send.trim()
    }
    message.reply(`sent commands to your DMs!`)
    message.author.send({embed:embed})
  }
}
