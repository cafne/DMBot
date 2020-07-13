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
    self.buff = []
    self.bufftime = "before"
    self.buffonce = true
    self.desc = ""

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

  use: function(player) {

    let result = {roll:{}, stats: {}}

    // Apply the pre-skill stat buff
    if (this.buff.length && this.bufftime == "before") {
      this.buff.forEach((item) => {
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
    if (this.buff.length && this.buffonce && this.bufftime == "before") {
      this.buff.forEach((item) => {
        item.remove(player)
      })
    }

    // Apply the post-skill buff effect
    if (this.buff && this.bufftime == "after") {
      this.buff.forEach((item) => {
        item.apply(player)
      })
    }
    return result
  },

  load : function(kwargs) {
    self = this.create(kwargs)
    self.buff = kwargs["buff"].map(item => Buff.create(kwargs["buffs"]))
    return self;
  }
}
