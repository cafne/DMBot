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
  },

  add: function(dice) {
    if (typeof dice == 'string') {
      var dice_sides = Number(dice.toLowerCase().split("d"))
      var dice_num = Number(dice_sides.shift())
    } else {
      var dice_num = dice.dice_num
      var dice_sides = dice.dice_sides
    }
    dice_num += this.dice_num
    dice_sides += this.dice_sides
    return {
      dice_num: (dice_num > 1) ? dice_num : 1,
      dice_sides: (dice_sides > 1) ? dice_sides : 1
    }
  },

  print: function(add="") {
    if (add) {
      let dice = this.add(add)
      return `Extra dice: ${dice.dice_num}\nExtra dice sides: ${dice.dice_sides}`
    } else {
      return `Extra dice: ${this.dice_num}\nExtra dice sides: ${this.dice_sides}`
    }
  }
}
