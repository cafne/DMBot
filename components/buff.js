const Player = require('./player.js')
const StatModifier = require('./stat_modifier.js')
const {player_stats} = require('../config.json')

/*
  // Start Buff //
  A de/buff that can be attached to an item's usage as a weapon equip effect--
  It can also exist on it's own as a user-defined Stat De/Buff.

  / Properties /
  - str/int/dex/hp: A numerical value to add to a Player's stat. Can also be negative.

  / Misc /
  - Arguments are passed to the .create() method as an Object.
    ex: Buff.create({"int": 5})
  - apply(): Takes one argument-- a Player object. This method creates a new StatModifier from Buff's
    <stat_bonus> Properties and applies to to the corresponding player Stat.

*/

module.exports = {

  create: function(kwargs) {
    let self = Object.create(this)

    self.name = ""
    self.icon = ""
    self.desc = ""

    // Additive modifiers
    player_stats.forEach((item) => {
      self[item] = 0
    });
    self.stack = 1
    return this.update(self, kwargs)

  },

  update: function(self, kwargs) {
    for (let prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
    return self
  },

  apply: function(player) {
    Object.getOwnPropertyNames(this).forEach((key) => {
      if (!["name", "desc", "icon"].includes(this[key])) {
        player[key].add_modifier(StatModifier.create(this[key] * this.stack, source=this))
      }
    });
  },

  get title() {
    return `${this.name.charAt(0).toUpperCase() + this.name.substr(1)} ${this.icon}`
  },

  get_stats: function(pretty_print=false) {
    let final = {}
    Object.getOwnPropertyNames(this).forEach((key) => {
      if (!["name", "desc", "icon", "stack"].includes(key)) {
        final[key] = this[key]
      }
    });

    console.log(final);

    if (pretty_print) {
      final = Object.getOwnPropertyNames(final).filter(item => this[item] !=0).map(item =>
        `${item.toUpperCase()}: ${final[item]}${(this.stack > 1) ? " (x"+this.stack+")" : ""}\n`).toString().replace(/,/g, "").trim()
        console.log(final);
    }
    return final
  },

  remove: function(player) {
    Object.getOwnPropertyNames(this).forEach((key) => {
      if (!["name", "desc", "icon"].includes(this[key])) {
        player[key].remove_all_from_source(this)
      }
    });
  }
}
