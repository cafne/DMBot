const {player_stats} = require('../config.json')
const Inventory = require('./inventory.js')
const Stat = require('./stats.js')
const Item = require('./item.js')
const Buff =  require('./buff.js')
const DiceBuff = require('./dice_buff.js')

/*
  // Start Player //
  Represents a Server Member's character.

*/

module.exports = {
  create: function(kwargs) {

    let self = Object.create(this)
    self.name = kwargs["name"]

    // Lazy default values.
    self.player_id = (kwargs.hasOwnProperty("player_id")) ? kwargs["player_id"].toString() : ""

    if (Object.keys(player_stats).length) {
      Object.keys(player_stats).forEach((item) => {
        self[item] = (kwargs.hasOwnProperty(item)) ? Stat.create(item.toUpperCase(),
        kwargs[item]) : Stat.create(item.toUpperCase(), 1)
      });
    }

    self.buffs = []
    self.dice_buff = DiceBuff.create({
      dice_num: kwargs.dice_num || 0,
      dice_sides: kwargs.dice_sides || 0
    })
    self.inventory = Inventory.create()

    return self;
  },

  update: function(self, kwargs) {
    for (let prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
    return self
  },

  get_stats: function(pretty_print=false) {
    let final = {}
    Object.keys(player_stats).forEach((item) => {
      final[item] = this[item]
    });
    if (pretty_print) {
      final = Object.getOwnPropertyNames(final).map(item =>
        `${item.toUpperCase()}: ${final[item].current_value}${(final[item].current_value != final[item].value) ? " / " + final[item].value: ""} ${
          (final[item].total_modifiers != 0) ? "(**" + ((final[item].total_modifiers < 0) ? "" : "+") +
          final[item].total_modifiers + "**)" : ""}\n`
      ).toString().replace(/,/g, "").trim()
    }
    return final
  },

  print_buffs: function() {
    let final = ""
    this.buffs.forEach((item) => {
      final += `${item.title}\n\`\`\`${item.short_desc}\`\`\`\n`
    });
    return final
  },

  equip: function(buff, stack=1) {
    if (buff.__proto__ == Buff) {
      let find = this.buffs.find(item => item.name == buff.name)
      if (!find){
        try {
          let newbuff = Buff.create(buff)
          newbuff.stack = stack
          newbuff.apply(this)
          this.buffs.push(newbuff)
        } catch (error) {
          console.log("Error with parsing buffs.")
          return false
        }
      } else {
        find.stack += stack
        find.reapply(this)
      }
    } else if (buff.__proto__ == DiceBuff) {
      this.dice_buff = buff
    }
  },

  get title() {
    return this.name.charAt(0).toUpperCase() + this.name.substr(1)
  },

  unequip_all: function() {
    this.buffs.forEach((buff) => {
      buff.remove(this)
    });
    this.buffs.splice(0, this.buffs.length)
    for (let stat of Object.keys(player_stats)) {
      this[stat].remove_all_from_source(null)
    }
    this.dice_buff = null
  },

  unequip: function(buff, stack=1) {
    if (buff.__proto__ == Buff) {
      let find = this.buffs.find(item => buff.name == item.name)
      if (!find) {
        console.log("Buff does not exist.")
        return false
      }
      find.stack -= stack
      if (find.stack < 1) {
        find.remove(this)
        this.buffs.splice(this.buffs.indexOf(find), 1)
      } else {
        find.reapply(this)
      }
    } else if (buff.__proto__ == DiceBuff) {
      this.dice_buff = null
    }
  },

  save: function() {

    let save = this.create(this)

    if (Object.keys(player_stats).length) {
      Object.keys(player_stats).forEach((item) => {
        Object.assign(save[item], this[item])
      });
    }

    this.buffs.forEach((item, i) => {
      save.buffs[i] = {
        name: item.name,
        stack: item.stack
      }
    });
    return save
  },

  load: function(kwargs, buffs) {

    // For JSON unserialization

    self = this.create({})

    self.player_id = kwargs["player_id"]
    self.name = kwargs["name"]

    if (kwargs["dice_buff"]) {
      self.dice_buff = DiceBuff.create(kwargs["dice_buff"])
    } else {
      self.dice_buff = DiceBuff.create({dice_sides: 0, dice_num: 0})
    }

    Object.keys(player_stats).forEach((item) => {
      if (kwargs.hasOwnProperty(item)) {
        if (!Number(kwargs[item]._base_val)) {
          let e =`ERROR PARSING GLOBALS.JSON: ${self.name}: ${item}\nExpected numerical _base_value.\nWARNING: this may cause issues with stat calculation\n`
          console.error(e)
        }
        self[item] = Stat.create(item.toUpperCase(), Number(kwargs[item]._base_val))
        self[item]._current_value = kwargs[item]._current_value
        self[item].modifiers = kwargs[item].modifiers
        self[item].changed = true
      } else {
        self[item] = Stat.create(item.toUpperCase(), 1)
      }
    });

    if (kwargs.buffs.length) {
      kwargs["buffs"].forEach((item, i) => {
        let buff = buffs.find(buff => buff.name == item.name)
        if (buff) {
          let add_buff = Buff.create(buff)
          let has_buff = false
          for (let key of Object.keys(add_buff.get_stats())) {
            if (self[key].modifiers.find(k => k.source == add_buff.name)) {
              has_buff = true
              break;
            }
          }
          if (!has_buff) {
            self.equip(add_buff, kwargs.buffs[i].stack)
          } else {
            add_buff.stack = kwargs.buffs[i].stack
            self.buffs.push(add_buff)
          }
        }
      })
    }

    self.inventory = Inventory.create()
    if (kwargs.inventory.items.length) {
      self.inventory.items = kwargs.inventory.items.map(item => Item.create(kwargs))
    }
    return self;
  }
}
