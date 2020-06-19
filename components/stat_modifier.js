module.exports = {

  default_order: [
    "flat",
    "percent_add",
    "percent_mult"
  ],

  create: function(value, type, order=null, source=null) {
    var self = this
    self.value = value
    self.type = type
    self.order = order
    self.source = source
    if (self.order == null) {
      self.order = self.default_order.index(type)
    }
    else if (!self.default_order.has(self.order)) {
      console.log(self.order, self.default_order)
      throw `TypeError: ${self.order} is not a type of <Stat_Modifier Order>`
    }
    else {
      self.order = self.default_order.index(order)
    }
  }
}
