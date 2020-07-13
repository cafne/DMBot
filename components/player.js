const Inventory = require('./inventory.js')
const Stat = require('./stats.js')
const Item = require('./item.js')
const Buff = require('./buff.js')

/*
  // Start Player //
  Represents a Server Member's character.

*/

module.exports = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.player_id = kwargs["player_id"]
    self.name = kwargs["name"]
    self.hp = Stat.create("HP", kwargs["hp"])
    self.int = Stat.create("INT", kwargs["int"])
    self.str = Stat.create("STR", kwargs["str"])
    self.dex = Stat.create("DEX", kwargs["dex"])
    self.buffs = []
    self.inventory = Inventory.create()

    return self;
  },

  load: function(kwargs) {

    // For JSON unserialization

    self = this.create({})

    self.player_id = kwargs["player_id"]
    self.name = kwargs["name"]

    self.hp._base_val = kwargs["hp"]._base_val
    self.hp._value = kwargs["hp"]._value
    self.hp.modifiers = kwargs["hp"].modifiers
    self.hp.changed = kwargs["hp"].changed

    self.int._base_val = kwargs["int"]._base_val
    self.int._value = kwargs["int"]._value
    self.int.modifiers = kwargs["int"].modifiers
    self.int.changed = kwargs["int"].changed

    self.str._base_val = kwargs["str"]._base_val
    self.str._value = kwargs["str"]._value
    self.str.modifiers = kwargs["str"].modifiers
    self.str.changed = kwargs["str"].changed

    self.dex._base_val = kwargs["dex"]._base_val
    self.dex._value = kwargs["dex"]._value
    self.dex.modifiers = kwargs["dex"].modifiers
    self.dex.changed = kwargs["dex"].changed

    if (kwargs.buffs.length) {
      self.buffs = kwargs["buffs"].map(item => Buff.create(kwargs["buffs"]))
      self.buffs.forEach(item => item.apply(self))
    }

    self.inventory = Inventory.create()
    if (kwargs.inventory.items.length) {
      self.inventory.items = kwargs.inventory.items.map(item => Item.create(kwargs))
    }

    return self;
  }
}
