var fs = require('fs');

const Player = require('./components/player.js')
const Buff = require('./components/buff.js')
const Skill = require('./components/skill.js')
const MultiSkill = require('./components/multi_skill.js')
const Item = require('./components/item.js')
const {prefix, token, player_stats} = require('./config.json');

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
    if (Object.keys(data).includes(key_name)) {
      switch (key_name) {
        case "members":
          Object.assign(item, data[key_name].map(item => Player.load(item)))
          return
        case "skills":
          let new_data = []
          data[key_name].forEach((skill) => {
            if (skill.hasOwnProperty("multi")) {
              new_data.push(MultiSkill.load(skill))
            } else {
              new_data.push(Skill.load(skill))
            }
          })
          Object.assign(item, new_data)
          return
        default:
          Object.assign(item, data[key_name])
          return
      }
    }

  })
}

function save(item, key_name, location="globals.json") {
  try {
    let data = JSON.parse(fs.readFileSync(location))
    data[key_name] = item
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync(location, data)
  } catch (error) {
    throw error
  }
}

function save_all() {
  try {
    let data = JSON.parse(fs.readFileSync("globals.json"))
    data["members"] = members
    data["alias"] = alias
    data["items"] = items
    data["buffs"] = buffs
    data["skills"] = skills
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync("globals.json", data)

    data = JSON.parse(fs.readFileSync("config.json"))
    data = JSON.stringify(data, null, 2)
    data["player_stats"] = player_stats
    fs.writeFileSync("config.json", data)
  } catch (error) {
    throw error
  }
}

// Getting the alias for general commands

function get_alias(input, cmds) {
  if (alias.length) {
    var find = alias.find(item => Object.values(item).flat().includes(input))
    if (!find) return false
    else return cmds.find(item => item.name == Object.keys(find).toString())
  }
  return false
}

function validate_command_name(input) {
  if (skills.some(item => item.name == input) || commands.includes(input) ||
  alias.some(item => Object.values(item).flat().includes(input))) {
    return false
  } else return true
}

// Export for global usage
module.exports = {
  members, skills, alias, buffs, items, save, save_all, load, get_alias,
  prefix, token, validate_command_name
}
