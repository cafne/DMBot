Object.prototype.extend = function (extension) {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);

    for (let property in extension)
        if (hasOwnProperty.call(extension, property) ||
            typeof object[property] === "undefined")
                object[property] = extension[property];

    return object;
};

const Item = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.name = ""
    self.amt = ""
    self.buff = null
    return self.update(self, kwargs);
  },
  
  update: function(self, kwargs) {
    for (let prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
    return self
  }
}

const ConsumableItem = Item.extend({
  use: function() {
    return
  }
})
