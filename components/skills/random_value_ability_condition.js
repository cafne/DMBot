const dice_roller = require('../dice_roller.js');
const AbilityRoll = require('./ability_roll.js');

// Ability Condition: Compare against a dice roll

// Prototyping AbilityRoll
const DiceAbilityCondition = Object.create(AbilityRoll)

DiceAbilityCondition.create = function(kwargs) {
	let self = Object.create(this)
	self.type = "random"
	
	// For the user's roll
  self.dice_num = 0
  self.dice_sides = 0
	self.user_stats = []

	// The roll to compare against
  self.compare_dice_num = 0
  self.compare_dice_sides = 0

	return self.update(self, kwargs)
}

DiceAbilityCondition.get_target_roll = function(user, target) {
	let roll = dice_roller(this.compare_dice_num, this.compare_dice_sides)
  return {roll: roll, total: Object.values(roll).reduce((first, next) => first + next, 0)}
}

DiceAbilityCondition.make_embed = function(user, dice_roll, passed) {
  let embed = this.__proto__.make_embed(user, dice_roll, passed)
  embed.footer = {"text": `Target Value: ${dice_roll.total} ${(Object.keys(dice_roll.roll).length>1) ? "(" + Object.values(dice_roll.roll).toString().replace(/,/g, " + ") + ")" : ""}`}
  return embed
}

module.exports = DiceAbilityCondition
