const AbilityRoll = require('./ability_roll.js')
const TargetAbilityCondition = require('./target_ability_condition.js')
const FlatValueAbilityCondition = require('./flat_value_ability_condition.js')
const RandomValueAbilityCondition = require('./random_value_ability_condition.js')
const {player_stats} = require('../../config.json')
const Buff = require('../buff.js')
const StatModifier = require('../stat_modifier.js')

/*
  // Start Abilities //

  - Abilities are attached to a <Skill>
  - Upon satisfaction of all <conditions>, the ability is applied to the
    ability's <target> (self: [the user] or a <Player> target)
*/

module.exports = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.status_effects = []
    self.modifier_effects = []
    self.conditions = []
    self.target = "self"
    self.type = "status"
    return self.update(self, kwargs)
  },

  update: function(self, kwargs) {
    for (let key of Object.keys(kwargs)) {
      if (self.hasOwnProperty(key)) {
        self[key] = kwargs[key]
      }
    }
    return self
  },

  activate: function(user, target) {
    let result = this.check(user, target)
    if (result.passed) {
      if (this.target == "self") {
        this.apply(user, user)
      } else {
        this.apply(user, target)
      }
      // If we just want to use the ability for a dice roll and not apply any
      // effects, we dont need to add the ability-application embed
      if (this.status_effects.length || Object.keys(this.modifier_effects).length) {
        result.embed_stack.push(this.make_embed(user, target))
      }
    }
    return result
  },

  check: function(user, target) {
    let embed_stack = []
    let passed = true
    let result = {}
    if (this.conditions.length) {
      for (let check of this.conditions) {
        result = check.roll(user, target)
        embed_stack.push(result.embed)
        if (!result.passed) {
          passed = false
          break;
        }
      }
      return {
        passed: passed,
        embed_stack: embed_stack
      }
    } else {
      return {
        passed: true,
        embed_stack: []
      }
    }
  },

  apply: function(user, target) {
    // Apply Buffs
    this.status_effects.forEach((item) => {
      target.equip(item)
    });

    // Apply Stat Modifiers and Damage
    Object.keys(this.modifier_effects).forEach((item) => {
      if (target.hasOwnProperty(item)) {
        target[item].add_modifier(this.modifier_effects[item])
      }
    });
  },

  get total_ability_damage() {
    return this.ability_damage + this.ability_heal
  },

  get ability_damage() {
    return Object.keys(this.modifier_effects).filter(item =>
      this.modifier_effects[item].source == "damage"
      && this.modifier_effects[item].value < 0).map(item =>
      this.modifier_effects[item].value).reduce((first, next) => first + next, 0)
  },

  get ability_heal() {
    return Object.keys(this.modifier_effects).filter(item =>
      this.modifier_effects[item].source == "damage" &&
      this.modifier_effects[item].value > 0).map(item =>
        this.modifier_effects[item].value).reduce((first, next) => first + next, 0)
  },

  make_embed: function(user, target) {
    let ability_target = (this.target == "self") ? user : target
    let dmg = this.total_ability_damage
    let desc = ""
    if (this.total_ability_damage < 0) {
      desc = `Takes ${dmg} damage.`
    } else if (this.total_ability_damage > 0) {
      desc = `Healed for ${dmg} ${Object.keys(player_stats).find(item =>
        player_stats[item] == "dmg_stat")}`
    } else {
      desc = "Buffs activated!"
    }

    embed = {
      description: desc,
      author: {
        name: `${ability_target.title} > Status Change`,
        icon_url: ability_target.player_id || ""
      },
      footer: {
        text: "*lazy placeholder embed: Represents stat buff"
      }
    }
  	return embed
  },

  load: function(kwargs, buffs) {
    let self = this.create(kwargs)
    self.status_effects.forEach((effect, i) => {
      let find = buffs.find(item => item.name == effect.name)
      if (find) {
        self.status_effects[i] = find
        self.status_effects[i].stack = effect.stack
      }
    });
    Object.keys(self.modifier_effects).forEach((effect) => {
      self.modifier_effects[effect] = StatModifier.update(StatModifier.create(0), self.modifier_effects[effect])
    });
    self.conditions.forEach((condition, i) => {
      switch (condition.type) {
        case "random":
          self.conditions[i] = RandomValueAbilityCondition.create(condition)
          break;
        case "flat":
          self.conditions[i] = FlatValueAbilityCondition.create(condition)
          break;
        case "target":
          self.conditions[i] = TargetAbilityCondition.create(condition)
          break;
        default:
          self.conditions[i] = AbilityRoll.create(condition)
      }
    });
    return self
  },

  save: function() {
    let save = this.create(this)

    this.status_effects.forEach((item, i) => {
      save.status_effects[i] = {
        name: item.name,
        stack: item.stack
      }
    });
    return save
  }
}
