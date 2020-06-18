module.exports = {
  create: function(name, maxval) {
    var self = Object.create(this)
    self.name = name;
    self.maxval = maxval;
    self.value = maxval;
    return self;
  }
}
