const Inventory = require('./inventory.js')
const Stat = require('./stats.js')
const Item = require('./item.js')

/*
  // Start Player //
  Represents a Server Member's character.

*/

module.exports = {
  create: function(kwargs) {
    var self = Object.create(this)
    self.name = kwargs["name"]
    self.hp = Stat.create("HP", kwargs["hp"])
    self.int = Stat.create("INT", kwargs["int"])
    self.str = Stat.create("STR", kwargs["str"])
    self.dex = Stat.create("DEX", kwargs["dex"])
    self.buffs = []
    self.inventory = Inventory.create()
    return self;
  }
}
