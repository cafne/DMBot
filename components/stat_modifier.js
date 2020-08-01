
/*
  // Start StatModifier //

  / Properties /
  - value: A numerical value; can be positive or negative. Is added to a Stat when Stat.get_final_value() is run.
  - source: The item/weapon/user-defined buff that the Modifier is attached to. Can be <null> (none).
    - Can be set to a buff name to indicate coming from a Buff
    - Null indicates an generic Buff.
    - Or "damage" to separate it from Buffs. Useful for decreasing the HP stat when hit.

*/

module.exports = {
  create: function(value, source=null) {
    let self = Object.create(this)
    self.value = value
    self.source = source
    return self
  },

  update: function(self, kwargs) {
    Object.keys(kwargs).forEach(item => {
      if (self.hasOwnProperty(item)) {
        self[item] = kwargs[item]
      }
    })
    return self
  }
}
