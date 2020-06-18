module.exports = {
  create: function(name, amt=1) {
    var self = Object.create(this)
    self.name = name
    self.amt = amt
    return self;
  }
}
