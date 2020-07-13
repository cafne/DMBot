var fs = require('fs');

const Player = require('./components/player.js')
const Buff = require('./components/buff.js')
const Skill = require('./components/skill.js')
const Item = require('./components/item.js')

// Declare Variables here
var members = [];
var skills = [];
var alias = [];
var buffs = [];
var items = [];

// Save and Load functions to be used with "globals.json"
// Usage: save(variable, key_in_globals.json)

function load(item, key_name) {
  fs.readFile("globals.json", function(err, data) {
    if (err) throw err;
    var data = JSON.parse(data)
    if (key_name == "members") {
      for (i of Object.keys(data)) {
        if (i == key_name) {
          Object.assign(item, data[key_name].map(item => Player.load(item)))
          return ;
        }
      }
    } else if (key_name == "skills") {
      for (i of Object.keys(data)) {
        if (i == key_name) {
          Object.assign(item, data[key_name].map(item => Skill.load(item)))
          return ;
        }
      }
    } else {
      for (i of Object.keys(data)) {
        if (i == key_name) {
          Object.assign(item, data[i])
          return ;
        }
      }
    }
  })
}

function save(item, key_name) {
  fs.readFile("globals.json", function(err, data) {
    if (err) throw err;
    var data = JSON.parse(data)
    data[key_name] = item
    data = JSON.stringify(data, null, 2)
    fs.writeFile("globals.json", data, function(err, file) {
      if (err) throw err;
    })
  })
}

// Getting the alias for general commands

function get_alias(input, cmds) {
  if (alias.length) {
    var find = alias.find(item => Object.values(item).flat().includes(input))
    console.log(find);
    //console.log(cmds.find(item => item.name == Object.keys(find).toString()));
    if (!find) return false
    else return cmds.find(item => item.name == Object.keys(find).toString())
  }
  return false
}

async function confirm_message(confirm_message, message) {
  message.channel.send(confirm_message)
  console.log(message.author);
  try {
    var confirm = await message.channel.awaitMessages(msg => {
      return msg.author == message.author && msg.channel == message.channel
    }, {time: 5000, max: 1})
  } catch (error) {
    message.channel.send("Cancelled. Error.")
    return false
  }
  console.log(confirm);
  if (!confirm.first()) {
    message.channel.send("Cancelled.")
    return false
  }
  confirm = confirm.first().toString()
  if (confirm == "y" || confirm == "yes" ) {
    return true
  }
  else {
    message.channel.send("Cancelled.")
    return false
  }
}

// Export for global usage
module.exports = {members, skills, alias, save, load, get_alias, confirm_message}
