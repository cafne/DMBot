module.exports = {
  create: function(items=[]) {
    let self = Object.create(this)
    self.items = items
    return self;
  },

  get_item: function(item) {

  },

  add_item: function(item) {
    this.items.push(item)
  },

  remove_item: function(item) {

  }
}
