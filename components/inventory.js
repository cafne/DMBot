const Item = require('./item.js')

module.exports = {
  create: function(items=[]) {
    let self = Object.create(this)
    self.items = items
    return self;
  },

  get_item: function(item) {
    if (typeof item == 'string') {
      return this.items.find(i => i.name == item)
    } else {
      return this.items.find(i => i.name == item.name)
    }
  },

  add_item: function(item, amt=1) {
    let new_item = Item.create(item)
    new_item.amt = amt
    this.items.push(new_item)
  },

  remove_item: function(item, amt=1) {
    let find = this.items.indexOf(this.get_item(item))
    if (!find) return false
    if (find.amt - amt > 1) {
      find.amt -= amt
    } else {
      this.items.splice(find, 1)
    }
    return true
  },

  remove_all_item_amount: function(item) {
    let find = this.get_item(item)
    if (!find) return false
    this.items.splice(find, 1)
  },

  clear_all: function() {
    this.items.splice(0)
  }
}
