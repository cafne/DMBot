var fs = require('fs');

const Player = require('./components/player.js')
const Buff = require('./components/buff.js')
const Skill = require('./components/skills/skill.js')
const Item = require('./components/item.js')
const {prefix, token, player_stats, admin_roles} = require('./config.json');
const {MessageEmbed} = require('discord.js');

// Declare Variables here
var members = [];
var skills = [];
var alias = [];
var buffs = [];
var items = [];
var sent_emoji = {};

// Save and Load functions to be used with "globals.json"
// Usage: save(variable, key_in_globals.json)

function load(item, key_name) {
  fs.readFile("globals.json", function(err, data) {
    if (err) throw err;
    var data = JSON.parse(data)
    if (Object.keys(data).includes(key_name)) {
      switch (key_name) {
        case "members":
          Object.assign(item, data[key_name].map(item => Player.load(item, buffs)))
          return
        case "skills":
          /*
          let new_data = []
          data[key_name].forEach((skill) => {
            if (skill.hasOwnProperty("random")) {
              new_data.push(ConditionSkill.load(skill))
            } else {
              new_data.push(Skill.load(skill))
            }
          })
          Object.assign(item, new_data)
          */
          Object.assign(item, data[key_name].map(item => Skill.load(item, buffs)))
          return
        case "buffs":
          Object.assign(item, data[key_name].map(item => Buff.load(item)))
          return
        case "items":
          Object.assign(item, data[key_name].map(item => Item.load(item)))
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
    let saving = item.map(i =>
      (i.hasOwnProperty('save')) ? i.save() : i
    );
    data[key_name] = saving
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync(location, data)
  } catch (error) {
    throw error
  }
}

function save_all() {
  try {
    let data = JSON.parse(fs.readFileSync("globals.json"))
    console.log("members", members[0].buffs);
    data["members"] = members.map(item => item.save())

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

// Check if a name exists as a command or alias
function validate_command_name(input) {
  if (skills.some(item => item.name == input) || commands.includes(input) ||
  alias.some(item => Object.values(item).flat().includes(input))) {
    return false
  } else return true
}

// Start Embeds //
function member_embed(character, guild, info=false) {
  let embed = new MessageEmbed()
  let owner = guild.members.cache.get(character.player_id)

  embed.setAuthor(character.title, (owner) ? owner.user.avatarURL() : "")
  embed.addField(":crossed_swords: Stats", character.get_stats(true))
  if (character.buffs.length) embed.addField(":exclamation: Status Ailments", character.print_buffs())
  return embed
}

function item_embed(item, info=false) {
  let embed = new MessageEmbed()
  embed.setTitle(item.title)
  embed.setDescription(item.desc)
  if (item.buffs.length) embed.addField(":exclamation:Buffs", item.get_buffs(true))
  return embed
}

function buff_embed(buff, info=false) {
  let embed = new MessageEmbed()
  embed.setTitle(buff.title)
  embed.setDescription(buff.desc)
  let stats = buff.get_stats()
  if (Object.keys(stats).some(item => stats[item] != 0)) embed.addField(":exclamation:Stat Changes", buff.get_stats(true))
  return embed
}

function skill_embed(skill, info=false) {
  let embed = new MessageEmbed()
  embed.setTitle(skill.title)
  embed.setDescription(skill.desc)
  return embed
}

// End Embeds //

// Find data is database
function lookup(search, filter=[]) {

  // Set the default search filters
  let search_in = {"members": members, "buffs": buffs, "skills": skills, "items": items}
  let found = undefined

  // Update search filters with <filter>
  if (filter.length){
    let filtered = {}
    Object.keys(search_in).forEach((key) => {
      if (filter.includes(key)) {
        filtered[key] = search_in[key]
      }
    });
    search_in = filtered
  }

  // Look for item
  for (let key of Object.keys(search_in)) {
    found = search_in[key].find(item => item.name == search)
    var found_in_key = key
    if (found) break;
  }
  if (found) {
    return {item: found, found_in_key, found_in_key}
  } else {
    return false;
  }
}


// Export for global usage
module.exports = {
  members, skills, alias, buffs, items, sent_emoji, save, save_all, load, get_alias,
  prefix, admin_roles, token, validate_command_name, member_embed, item_embed, buff_embed, skill_embed, lookup
}
