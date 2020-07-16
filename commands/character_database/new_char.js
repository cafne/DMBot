var {members, alias} = require('../../globals.js')
const {save} = require('../../globals.js')
const Player = require('../../components/player.js')
const args_parse = require('../../components/args_parse.js');
const confirm_message = require('../../components/confirm_message.js')

module.exports = {
  name: "newchar",
  desc: "Creates new character.",
  usage: "!newchar <name> > int/str/dex/hp: <value>, player_id: <value>",
  args: true,
  async execute(message, args) {

    // Unpack arguments and try to create the character
    let character = args_parse(args, true)
    character = Player.create(character)

    // If any values could not be set, return an error.
    // *Note: Any stats not specified are defaulted to <1>
    // > You can change the order they are listed in, as well as add and remove stats
    // > by editing <player_stats> in config.json.
    if (Object.values(character).some(item => item == undefined || Object.values(item).includes(undefined))) {
      return message.channel.send("```Error: Arguments are not valid.```")
    }

    // Early exit if there is a character with the same name
    if (members.some(member => member.name == character)){
      return message.channel.send("```That character already exists!```")
    }

    // Lazy embed creation
    // TODO: Make function for embeds
    let embed = {
      "author": {
        "name": character.title,
        "icon_url": message.author.avatarURL()
      },
      "fields": [
        {
          "name": ":crossed_swords: Stats",
          "value": character.get_stats(true)
        },
      ]
    }

    message.channel.send({content: (!character.player_id) ? "```You are creating a character without a player ID.\n" +
    "You will not be able to use shorthand commands with this character until an ID is registered, but you may set it at a later time.)```" : "",
    embed:embed})

    if (!await confirm_message(`do you want to create this character?`, message)) return
    members.push(character)
    save(members, "members")
    message.channel.send(`\`\`\`Created new character: ${character.title}\`\`\``)
  }
}
