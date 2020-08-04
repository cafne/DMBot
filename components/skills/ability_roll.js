const dice_roller = require('../dice_roller.js');

// This performs the actual roll and check for abilities
module.exports = {
	create: function(kwargs) {
  	let self = Object.create(this)

    // Dice to roll
    self.dice_num = 0
    self.dice_sides = 0

    // Stats to add to roll
    self.user_stats = []

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

  roll: function(user, target) {
  	let user_roll = {}
 		user_roll.dice = user.dice_buff.add({
			dice_num: this.dice_num,
			dice_sides: this.dice_sides
		})
    user_roll.character = user
		user_roll.roll = dice_roller(user_roll.dice.dice_num, user_roll.dice.dice_sides)
    user_roll.stats = {}
    this.user_stats.filter(stat => user.hasOwnProperty(stat)).forEach(stat => {
      user_roll.stats[stat] = user[stat].value
    });
    user_roll.total = Object.values(user_roll.roll).reduce((first, next) =>
		first + next, 0) + Object.values(user_roll.stats).reduce((first, next) => first + next, 0)
    let target_roll = this.get_target_roll(user, target)
    let final = {}

    if (user_roll.total == null)
      final.passed = true
    else if (user_roll.total > target_roll.total) {
      final.passed = true
    } else {
      final.passed = false
    }
    final.embed = this.make_embed(user_roll, target_roll, final.passed)
    return final
  },

  get_target_roll: function(user, target) {
    return {total: null}
  },

  make_embed: function(user, target, passed) {
		let embed = {
      "author": {
        "name": `Check > ${(passed) ? "Passed": "Failed"}`,
				"icon_url": user.character.player_id || ""
      },
      "fields": [
        {
          "name": `:game_die: ${user.dice.dice_num}D${user.dice.dice_sides}`,
          "value": `${user.character.title} rolled a ${user.total}\`\`\`php\n${Object.values(
						user.roll).toString().trim().replace(/,/g, " + ")} ${(Object.keys(user.stats).length) ? "+" : ""} ${Object.keys(
							user.stats).map(item => `${user.stats[item]} (${item.toUpperCase()})`).toString().trim().replace(/,/g, " + ")}\`\`\``
        }
      ]
    }
    return embed
  }
}
