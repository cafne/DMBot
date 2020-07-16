const Skill = require('./skill.js')

const MultiSkill = {
  create: function(kwargs) {
    let self = Object.create(this)
    self.name = ""
    self.rolls = []
    self.multi = true
  },

  use: function(player) {
    
  }
}
