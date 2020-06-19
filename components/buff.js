module.exports = {
  create: function(kwargs) {
    var self = this

    // Additive modifiers
    self.str_bonus = 0
    self.vit_bonus = 0
    self.int_bonus = 0
    self.dex_bonus = 0
    self.cha_bonus = 0
    self.hp_bonus = 0
    self.wis_bonus = 0

    // Percentage Modifiers
    self.str_multiply = 1.0
    self.vit_multiply = 1.0
    self.int_multiply = 1.0
    self.dex_multiply = 1.0
    self.cha_multiply = 1.0
    self.hp_multiply = 1.0
    self.wis_multiply = 1.0

    this.update(self, kwargs)
    console.log(self)
  },

  update: function(self, kwargs) {
    for (var prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
  }
}
