module.exports = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.dice_num = 0
    self.dice_sides = 0
    return self.update(self, kwargs)
  },

  update: function(self, kwargs) {
    Object.keys(kwargs).forEach((item) => {
      if (self.hasOwnProperty(item)) {
        self[item] = kwargs[item]
      }
    });
    return self
  }
}
