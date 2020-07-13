const Player = require('./player.js')
const StatModifier = require('./stat_modifier.js')

/*
  // Start Buff //
  A de/buff that can be attached to an item's usage as a weapon equip effect--
  It can also exist on it's own as a user-defined Stat De/Buff.

  / Properties /
  - str/int/dex/hp_bonus: A numerical value to add to a Player's stat. Can also be negative.

  / Misc /
  - Arguments are passed to the .create() method as an Object.
    ex: Buff.create({"int_bonus": 5})
  - apply(): Takes one argument-- a Player object. This method creates a new StatModifier from Buff's
    <stat_bonus> Properties and applies to to the corresponding player Stat.

*/

module.exports = {

  create: function(kwargs) {
    let self = Object.create(this)

    self.name = ""
    self.desc = ""

    // Additive modifiers
    self.str_bonus = 0
    self.int_bonus = 0
    self.dex_bonus = 0
    self.hp_bonus = 0

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

    if (this.hp_bonus != 0) player.hp.add_modifier(StatModifier.create(this.hp_bonus, source=this))
    if (this.str_bonus != 0) player.str.add_modifier(StatModifier.create(this.str_bonus, source=this))
    if (this.int_bonus != 0) player.int.add_modifier(StatModifier.create(this.int_bonus, source=this))
    if (this.dex_bonus != 0) player.dex.add_modifier(StatModifier.create(this.dex_bonus, source=this))

  },

  remove: function(player) {
    player.hp.remove_all_from_source(this)
    player.str.remove_all_from_source(this)
    player.int.remove_all_from_source(this)
    player.dex.remove_all_from_source(this)
  }
}
