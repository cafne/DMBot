// Import Dependencies
const fs = require('fs')
const Discord = require('discord.js');

// Create the Client and unpack Command Prefix and Token
const client = new Discord.Client();
const {prefix, token} = require('./config.json');

// Setup Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Setup Emoji-based commands
client.emoji_events = new Discord.Collection();
const emojiFiles = fs.readdirSync('./emoji').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

for (const file of emojiFiles) {
	const emoji = require(`./emoji/${file}`);
  client.emoji_events.set(emoji.name, emoji);
}

// This holds a list of Players/Characters with stats
var members = require('./globals.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  // Ignore if the bot sends a msg
  if (msg.author.bot) {
    return
  }
  else if (msg.content.startsWith(prefix)) {
    // Separate the command's name from the rest of the message
    // Individual elements of the message are separated by spaces
    // Each element is indexed into a list: <args>
    const args = msg.content.toLowerCase().slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Early exit if the Bot doesn't have a command by <commandName>
    if (!client.commands.has(commandName)) return;

    // Otherwise invoke the command
    const command = client.commands.get(commandName);

    // Used with the [command's <args> property] to check for the appropriate command arguments
    // If the command expects arguments but the <args> list is empty, cancel
    if (command.args && !args.length) {
      return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
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
