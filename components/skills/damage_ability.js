const Ability = require('./ability.js');
const {player_stats} = require('../../config.json')
const StatModifier = require('../stat_modifier.js')

const DamageAbility = Object.create(Ability)

DamageAbility.create = function(kwargs) {
  let self = Object.create(this)
  self.status_effects = []
  self.modifier_effects = []
  self.conditions = []
  self.target = "self"
  self.type = "attack"

  self.dmg_stat = Object.keys(player_stats).find(item => player_stats[item] == "dmg_stat")
  self.atk_stat = Object.keys(player_stats).find(item => player_stats[item] == "atk_stat")
  self.def_stat = Object.keys(player_stats).find(item => player_stats[item] == "def_stat")
  self.crit_stat = Object.keys(player_stats).find(item => player_stats[item] == "crit_stat")

  return self.update(self, kwargs)
},

DamageAbility.calculate_dmg = function(user, target) {
  if (!this.def_stat) {
    var dmg = user[this.atk_stat].value
  } else {
    var dmg = user[this.atk_stat].value - target[this.def_stat].value
  }
  if (this.crit_stat && user.hasOwnProperty(this.crit_stat)) {
    var crit = Math.floor(Math.random() * 20 + 1) + user[this.crit_stat].value
    console.log("crit", crit);
    if (crit >= 20) {
      crit = true
      dmg *= 2
    } else {
      crit = false
    }
  } else {
    var crit = false
  }
  if (dmg < 0) {
    dmg = 0
  } else if (dmg > 0) {
    dmg = -dmg
  }
  return {dmg: dmg, crit: crit}
}

DamageAbility.activate = function(user, target) {
  let result = this.check(user, target)
  if (result.passed) {
    if (this.target == "self") {
      var dmg = this.apply(user, user)
    } else {
      var dmg = this.apply(user, target)
    }
    result.embed_stack.push(this.make_embed(user, target, dmg))
  }
  return result
},

DamageAbility.apply = function(user, target) {

  let dmg = {dmg: 0, crit: false, skill_dmg: 0}

  // Damage Calculation

  if (this.dmg_stat && this.atk_stat) {
    if (!user.hasOwnProperty(this.atk_stat) && target.hasOwnProperty(this.dmg_stat)){
      console.log("Warning: damage skill used but target and user do not have attack or damageable stats")
    } else {
      dmg = this.calculate_dmg(user, target)
      target[this.dmg_stat].add_modifier(StatModifier.create(dmg.dmg, "damage"))
    }
  } else {
    console.log("Warning: damage skill used but no Attack and Damageable stats were set")
  }

  // Apply Buffs
  this.status_effects.forEach((item) => {
    target.equip(item)
  });

  // Apply Stat Modifiers
  for (let item of Object.keys(this.modifier_effects)) {
    if (target.hasOwnProperty(item)) {
      target[item].add_modifier(this.modifier_effects[item])
    }
  }
  return dmg
}

DamageAbility.make_embed = function(user, target, dmg) {
  let embed = {}
  if (target.hasOwnProperty(this.dmg_stat)) {
    Object.assign(embed, {
      description: `*${(dmg.crit) ? ":exclamation: Critical hit! :exclamation:\n":""}${-(dmg.dmg)} ${
        (Object.keys(this.modifier_effects).length) ? "( + " + -(dmg.skill_dmg) + " )" : ""} Damage dealt.*`,
      author: {
        name: `${target.title} > Take Damage`,
        icon_url: target.player_id || ""
      },
      fields: [
        {
          name: `:heart: ${target.title}`,
          value: `\`\`\`${this.dmg_stat.toUpperCase()}: ${target[this.dmg_stat].current_value} / ${target[this.dmg_stat].value}\`\`\``
        }
      ]
    })
    if (this.status_effects.length) {
      embed.fields.push({
        name: ":exclamation: Status Effect :exclamation:",
        value: target.buffs.filter(buff =>
          this.status_effects.find(item => item.name == buff.name)).map(buff =>
          `${buff.title} ${(buff.stack > 1) ? "x" + buff.stack : ""}`).toString().trim().replace(
            /,/g, "\n")
      })
    }
  }

  return embed
}

module.exports = DamageAbility
