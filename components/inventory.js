module.exports = {
  create: function(items=[]) {
    var self = Object.create(this)
    self.items = items
    return self;
  },
  add_item: function(item) {
    this.items.push(item)
  }
}
