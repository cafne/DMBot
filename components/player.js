const {player_stats} = require('../config.json')
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
    self.name = kwargs["name"]

    // Lazy default values.
    self.player_id = (kwargs.hasOwnProperty("player_id")) ? kwargs["player_id"] : ""

    if (player_stats.length) {
      player_stats.forEach((item) => {
        self[item] = (kwargs.hasOwnProperty(item)) ? Stat.create(item.toUpperCase(),
        kwargs[item]) : Stat.create(item.toUpperCase(), 1)
      });
    }

    self.buffs = []
    self.inventory = Inventory.create()

    return self;
  },

  get_stats: function(pretty_print=false) {
    final = {}
    player_stats.forEach((item) => {
      final[item] = this[item]
    });
    if (pretty_print) {
      final = Object.getOwnPropertyNames(final).map(item =>
        `${item.toUpperCase()}: ${final[item].value}\n`).toString().replace(/,/g, "").trim()
    }
    return final
  },

  equip: function(buff, stack=1) {
    if (!this.buffs.includes(buff)){
      try {
        buff.stack = stack
        buff.apply(this)
      } catch (error) {
        console.log("Error with parsing buffs.")
        return false
      }
      this.buffs.push(buff)
    } else {
      buff = this.buffs.indexOf(buff)
      this.buffs[buff].stack += stack
    }
  },

  get title() {
    return this.name.charAt(0).toUpperCase() + this.name.substr(1)
  },

  unequip: function(buff) {
    let find = this.buffs.indexOf(buff)
    if (find == -1) {
      console.log("Buff does not exist.")
      return false
    }
    buff.remove(this)
    this.buffs.splice(buff, 1)
  },

  load: function(kwargs) {

    // For JSON unserialization

    self = this.create({})

    self.player_id = kwargs["player_id"]
    self.name = kwargs["name"]

    player_stats.forEach((item) => {
      if (kwargs.hasOwnProperty(item)) {
        self[item]._base_val = kwargs[item]._base_val
        self[item]._value = kwargs[item]._value
        self[item].modifiers = kwargs[item].modifiers
        self[item].changed = kwargs[item].changed
      } else {
        self[item]._base_val = self[item]._value = self[item].modifiers = self[item].changed = 1
      }
    });

    if (kwargs.buffs.length) {
      self.buffs = kwargs["buffs"].map(item => Buff.create(kwargs["buffs"]))
      self.buffs.forEach(item => self.equip(item))
    }

    self.inventory = Inventory.create()
    if (kwargs.inventory.items.length) {
      self.inventory.items = kwargs.inventory.items.map(item => Item.create(kwargs))
    }

    return self;
  }
}
