module.exports = {
  create: function(name, hp) {
    var self = Object.create(this)
    self.name = name
    self.hp = Stat.create("HP", hp)
    self.modifiers = []
    self.inventory = Inventory.create()
    return self;
  }
}
