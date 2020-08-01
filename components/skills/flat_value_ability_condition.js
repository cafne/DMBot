const dice_roller = require('../dice_roller.js');
const AbilityRoll = require('./ability_roll.js');

// Ability Condition: Compare against a static value

// Prototyping AbilityRoll
const FlatValueAbilityCondition = Object.create(AbilityRoll)

FlatValueAbilityCondition.create = function(kwargs) {
	let self = Object.create(this)
	self.type = "flat"
  // User's roll
  self.dice_num = 0,
  self.dice_sides = 0
  self.user_stats = []

	// Roll to beat
	self.compare_value = null

  return self.update(self, kwargs)
}

FlatValueAbilityCondition.get_target_roll = function(user, target) {
  return {total: this.compare_value}
}

FlatValueAbilityCondition.make_embed = function(user, target_value, passed) {
	// We can use the original embed and add a footer to indicate the value
	// The player needed to beat
  let embed = this.__proto__.make_embed(user, target_value, passed)
	embed.author.icon_url = user.character.player_id || "",
  embed.footer = {"text": `Target Value: ${target_value.total}`}
  return embed
}

module.exports = FlatValueAbilityCondition
