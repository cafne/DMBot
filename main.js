// Import Dependencies
const fs = require('fs')
const Discord = require('discord.js');

// Create the Client and unpack Command Prefix and Token
const client = new Discord.Client();
// Setup Commands
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').map(folder => Object.create({
	"folder": folder,
	"file": fs.readdirSync('./commands/'+folder)
}));

// Setup Emoji-based commands
client.emoji_events = new Discord.Collection();
const emojiFiles = fs.readdirSync('./emoji').filter(file => file.endsWith('.js'));

// Load all Commands

for (const folder of commandFiles) {
	for (const file of folder.file) {
		const command = require(`./commands/${folder.folder}/${file}`);

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module

		client.commands.set(command.name, command);
	}
}

for (const file of emojiFiles) {
	const emoji = require(`./emoji/${file}`);
  client.emoji_events.set(emoji.name, emoji);
}

var {members, skills, items, sent_emoji, save, load, alias, get_alias,
	buffs, prefix, token, admin_roles} = require('./globals.js')

load(alias, "alias")
load(skills, "skills")
load(buffs, "buffs")
load(items, "items")
load(sent_emoji, "sent_emoji")

// This holds a list of Players/Characters with stats

load(members, "members")

// Start Bot //

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  // Ignore if the bot sends a msg
  if (msg.author.bot) {
    return
  }
  else if (msg.content.startsWith(prefix)) {

		if (!msg.guild) return

    // Separate the command's name from the rest of the message
    // Individual elements of the message are separated by commas
    // Each element is indexed into a list: <args>

    const commandName = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();
    const args = msg.content.slice(prefix.length + commandName.length).split(",").map(item => item.trim()).filter(item => item != "");

		// Start Command lookup
		// First we check if the command is a skill
		let command = client.commands.find(item => item.name == "skill").get_alias(commandName);

		// If not check for a proper command or alias
		if (!command ) {
			command = client.commands.get(commandName) || get_alias(commandName, client.commands)
			// Early exit if the Bot doesn't have a command by <commandName>
			if (!command) return;
		} else args.push(commandName)

		// Check if the command is admin only
		if (command.hasOwnProperty("admin")) {
			// Check if the user is an admin; as defined by the guild role flag "ADMINSTRATOR" or config.admin_roles
			if (command.admin == true && !msg.member.roles.cache.find(item => admin_roles.includes(item.name)) &&
			!msg.member.hasPermission("ADMINISTRATOR")) {
				return msg.channel.send(`You don't have the permissions for that command, ${msg.author}!`)
			}
		}

    // Used with the [command's <args> property] to check for the appropriate command arguments
    // If the command expects arguments but the <args> list is empty, cancel
    if (command.args && !args.length) {
      return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
    }

		if (command.hasOwnProperty("args_length")) {
			if (command.args_length < args.length) {
				return msg.channel.send(`You didn't provide enough arguments, ${msg.author}!\nExpected: ${command.args_length}`)
			}
		}

    try {
      command.execute(msg, args);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  }

  else {
    // Lastly check for emojis
    if (client.emoji_events.has(msg.content)){
      const emoji = client.emoji_events.get(msg.content);
      try {
        emoji.execute(msg);
      } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
      }
    }
  }
});

client.login(token);
