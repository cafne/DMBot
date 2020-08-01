const dice_roller = require('../dice_roller.js');
const AbilityRoll = require('./ability_roll.js');

// Ability Condition: Compare against a target Player's roll

// Prototyping AbilityRoll
const TargetAbilityCondition = Object.create(AbilityRoll)

TargetAbilityCondition.create = function(kwargs) {
	let self = Object.create(this)
	self.type = "target"

	// User Roll
	self.user_stats = []
  self.dice_num = 0
  self.dice_sides = 0

	// Target's Roll
  self.target_stats = []
  self.compare_dice_sides = null
  self.compare_dice_num = null

  return self.update(self, kwargs)
}

TargetAbilityCondition.get_target_roll = function(user, target) {
  let target_roll = {stats: {}}
	if (target.dice_buff) {
		target_roll.roll = dice_roller(target.dice_buff.dice_num + this.dice_num,
			target.dice_buff.dice_sides + this.dice_sides)
	} else {
		target_roll.roll = dice_roller(this.dice_num, this.dice_sides)
	}
  this.target_stats.filter(stat => target.hasOwnProperty(stat)).forEach(stat => {
    target_roll.stats[stat] = target[stat].buffed_value
  });
  target_roll.total = Object.values(target_roll.roll).reduce((first, next) =>
	first + next) + Object.values(target_roll.stats).reduce((first, next) => first + next, 0)
  return Object.assign(target_roll, {character: target})
}

TargetAbilityCondition.make_embed = function(user, target, passed) {
  let embed = this.__proto__.make_embed(user, target, passed)
  embed.fields[0].name = (passed) ? ":white_check_mark:" : ":no_entry_sign:"

	// TODO: uh find out why this works
	// might be some weird recursion and may cause issues down the line
	// should be embed.fields.push(), but that ends up adding an extra target_roll field

  embed.fields[1] = {
    "name": (!passed) ? ":white_check_mark:" : ":no_entry_sign:",
		author: {
			icon_url: user.character.player_id || ""
		},
    "value": `${target.character.title} rolled a ${target.total}\`\`\`php\n${Object.values(
			target.roll).toString().replace(/,/g, " + ")} ${(Object.keys(target.stats).length) ? "+" : ""} ${Object.keys(target.stats).map(key =>
				`${target.stats[key]} (${key.toUpperCase()})`).toString().replace(/,/g, " + ")}\`\`\``
  }
  return embed
}

module.exports = TargetAbilityCondition
