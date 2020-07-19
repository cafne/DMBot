const Buff = require('./buff.js')
const dice_roller = require('./dice_roller.js')
const Player = require('./player.js')

module.exports = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.name = ""
    self.dice_num = 0
    self.dice_sides = 0
    self.stats = []
    self.buffs = []
    self.bufftime = "before"
    self.buffonce = true
    self.desc = ""
    self.icon = "",
    self.target = false

    return self.update(self, kwargs)
  },

  update: function(self, kwargs) {
    for (let prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
    return self
  },

  get_desc: function(player) {
    return (this.desc.search("name") == -1) ? this.desc : this.desc.replace("name",
    player.name.charAt(0).toUpperCase() + player.name.substr(1))
  },

  get title() {
    return `${this.name.charAt(0).toUpperCase() + this.name.substr(1)} ${this.icon}`
  },

  use: function(player) {

    let result = {roll:{}, stats: {}}

    // Apply the pre-skill stat buff
    if (this.buffs.length && this.bufftime == "before") {
      this.buffs.forEach((item) => {
        item.apply(player)
      })
    }

    // Roll the dice
    if (this.dice_num && this.dice_sides) {
      result.roll = dice_roller(this.dice_num, this.dice_sides)
    }

    // Add the player's stats to the rolls
    if (this.stats.length) {
      this.stats.forEach((item) => {
        result.stats[item] = player[item].value
      })
    }

    // Remove the pre-skill buff if its not persistent
    if (this.buffs.length && this.buffonce && this.bufftime == "before") {
      this.buffs.forEach((item) => {
        item.remove(player)
      })
    }

    // Apply the post-skill buff effect
    if (this.buffs && this.bufftime == "after") {
      this.buffs.forEach((item) => {
        item.apply(player)
      })
    }
    result.final = 0
    console.log(result.roll);
    if (Object.getOwnPropertyNames(result.roll).length) {
      result.final += Object.values(result.roll).reduce((first, next) => first + next)
    }

    if (Object.getOwnPropertyNames(result.stats).length) {
      result.final += Object.values(result.stats).reduce((first, next) => first + next)
    }
    return result
  },

  load : function(kwargs) {
    self = this.create(kwargs)
    self.buff = kwargs["buffs"].map(item => Buff.create(kwargs["buffs"]))
    return self;
  }
}
