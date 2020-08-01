const Ability = require('./ability.js')
const DamageAbility = require('./damage_ability.js')

/*
  // Start Skills //
  - Skills hold a number of "abilities" that activate when a skill is used.
  - These abilities can add buffs or debuffs (Buff Ability) or heal/decrease health (Heal/Damage ability)
  - They can also simply signify that a skill was sucessfully executed.
  < See ./ability.js for more information. >

  - The final skill embed that is sent by the Bot consists of a chain/stack of embeds as such:
    skill use >> first ability conditions (passed or not) >> first ability activation >> second ability conditions >> second ability activation ect...
  - If any of the ability conditions are not met the chain is terminated early
  - (A little messy but it gets the job done for now)

*/
module.exports = {
  create(kwargs) {
    let self = Object.create(this)
    self.name = ""
    self.desc = ""
    self.icon = ""
    self.abilities = []
    self.self_target = false
    return self.update(self, kwargs)
  },

  update(self, kwargs) {
    for (let key of Object.keys(kwargs)) {
      if (self.hasOwnProperty(key)) {
        self[key] = kwargs[key]
      }
    }
    return self
  },
    get_desc: function(player) {
    return (this.desc.search("name") == -1) ? this.desc : this.desc.replace("name",
      player.name.charAt(0).toUpperCase() + player.name.substr(1))
  },

  get title() {
    return `${this.name.charAt(0).toUpperCase() + this.name.substr(1)} ${this.icon}`
  },

  use: function(user, target) {
    // Early exit if the user targets themselves and the skill is not self-targeting
    if (!this.self_target && user == target) return false

    // Foreach ability in abilities
    // ability.activate()
    // if returned failed early exit loop
    // return a list of embeds
    let embeds = [this.make_embed(user, target)]

    for (let ability of this.abilities) {
      let result = ability.activate(user, target)
      embeds = embeds.concat(result.embed_stack)
      if (!result.passed) break;
    }
    return embeds
  },

  make_embed: function(user, target) {
    return {
      author: {
        name:`${user.title} > Use Skill`,
        icon_url: user.player_id || ""
      },
      title: `${this.title}`,
      description: `\`\`\`${this.get_desc(user, target)}\`\`\``
    }
  },

  get_desc: function(player, target) {
    return this.desc.replace("name", player.title).replace("target",
    target.title)
  },

  get title() {
    return `${this.name.charAt(0).toUpperCase() + this.name.substr(1)} ${this.icon}`
  },

  load: function(kwargs, buffs) {
    let self = this.create(kwargs)
    self.abilities.forEach((item, i) => {
      if (item.type == "status" || item.type == undefined) {
        self.abilities[i] = Ability.load(item, buffs)
      } else if (item.type == "attack") {
        self.abilities[i] = DamageAbility.load(item, buffs)
      }
    });
    return self
  }
}
