
/*
  // Start StatModifier //

  / Properties /
  - value: A numerical value; can be positive or negative. Is added to a Stat when Stat.get_final_value() is run.
  - source: The item/weapon/user-defined buff that the Modifier is attached to. Can be <null> (none).

*/

module.exports = {
  create: function(value, source=null) {
    var self = Object.create(this)
    self.value = value
    self.source = source
    return self
  }
}
