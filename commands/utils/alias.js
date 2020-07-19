var { members, alias } = require('../../globals.js')
const {save, validate_command_name} = require('../../globals.js')

module.exports = {
    name: "alias",
    desc: "Adds a new alias to a command.",
    args: true,
    args_length: 2,
    admin: true,
    usage: "!alias <command> <new_alias>",
    async execute(message, args) {

      // Get the list of Bot commands
      commands = message.client.commands.map(command => command.name)

      // Seperate the command to be updated and the new alias to be added.
      command = args[0]
      new_alias = args[1]

      /*
      Check if the inputted <command> exists--
      And that the name of the new alias does not already exist as a command or
      command alias
      */

      if (commands.includes(command)) {
        if (validate_command_name(new_alias)) {
          // Get the command-- if an entry doesn't exist in <alias> add a new entry.
          find = alias.find(item => item.hasOwnProperty(command))
          if (!find) {
            alias.push({[command]: [new_alias]})
          }
          else {

            // Otherwise add to the existing entry's list of aliases.
            alias[alias.indexOf(find)][command].push(new_alias)

          }
          save(alias, "alias")
          await message.channel.send(`Added "${new_alias}" to ${command}'s aliases'.`)
        }
        else await message.channel.send(`${new_alias} already exists as an alias or command or skill.`)
      }
      else await message.channel.send("That command doesn't exist.")
    }
}
