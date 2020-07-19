const Buff = require('./buff.js')

module.exports = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.name = ""
    self.amt = 1
    self.buffs = []
    self.channels = []
    self.consumable = true
    self.desc = ""
    self.icon = ""
    self.tradeable = true
    return self.update(self, kwargs);
  },

  update: function(self, kwargs) {
    for (let prop of Object.keys(kwargs)) {
      if (Object.keys(self).includes(prop)){
        self[prop] = kwargs[prop]
      }
    }
    return self
  },

  get title() {
    return `${this.icon} ${this.name.charAt(0).toUpperCase() + this.name.substr(1)}`
  },

  get_buffs: function(pretty_print=false) {
    if (pretty_print) {
      return this.buffs.map(item =>
        (item.name || item.icon) ? (!item.stats) ? `${item.title}:\`\`\`${item.desc}\`\`\``:
        `${item.title}:\`\`\`${item.get_stats(true)}\`\`\`` : `Flat Value:\`\`\`${item.get_stats(true)}\`\`\``)
    } else return this.buffs
  },

  use: function(target, user=target, server=null) {
    if (!server) return false
    for (let channel in this.channels) {

    }
    return
  }
}
