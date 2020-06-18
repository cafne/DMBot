const {prefix, token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const Player = require('./components/player.js')
const Inventory = require('./components/inventory.js')
const Stat = require('./components/stats.js')
const Item = require('./components/item.js')
const fs = require('fs')

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
  client.emoji_events.set(emoji.name, emoji);
}

var members = []
var emoji = []

console.log(client.commands)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) {
    return
  }
  else if (msg.content.startsWith(prefix)) {
    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
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
