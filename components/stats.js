const StatModifier = require('./stat_modifier.js')

/*
  // Player <Stat> //
  Represents a single Stat (such as HP or STR) belonging to a Server Member's character.

  / Properties /
  - name: Name of the Stat

  - _base_val: The value of the stat before modifiers. Can be retrieved with .base_val

  - _value: The cumulative value of <_base_val> and the stat's modifiers.
    Retrieve with .value; doing so checks whether or not the <_base_val> or <modifiers> have been
    changed, and updates <_value> with the new total accordingly.

  - modifiers: An array of <StatModifier>s.

  - changed: Whether or not <modifiers> or <_base_val> has been edited.

  / Quick Tips /
  Modifying a stat:
  - Add a modifier to the Stat with <.add_modifier()>
  - add_modifier() takes 1 argument; it can be a numeric value or a <StatModifier> object.
  - If a numeric value is used it will be converted to a <StatModifier> object with a source set to <null> (aka: no source)
  ! StatModifiers that come from item/weapon/user-defined buffs will always have a source.
  ! <add_modifier()> checks for modifiers with <null> source. If a new one is added while another already exists
    in <modifiers>, the existing null-source StatModifier's value will instead be summed with the value of the new one.

  Removing Modifiers:
  - This is can be achieved with <remove_all_from_source()>
  - remove_all_from_source() takes 1 argument; <source>. This is typically a <Buff> object, but can also be <null>.
  - All StatModifiers that come from the specified source are removed from <modifiers>.
  - This can be used in a loop ofver the player's stats to completely remove a specific buff/debuff.

  Getting the Final Value
  - The Stat's <_value> is automatically updated when retrieved with <.value>
  - In the case that you need no manually update the Stat; run <get_final_value()>

*/

module.exports = {
  create: function(name, base_val) {
    let self = Object.create(this)
    self.name = name;

    // The original stat value
    self._base_val = base_val;

    // The total stat value
    self._value = base_val;

    // The current stat value
    self._current_value = base_val

    self.modifiers = []
    self.changed = true
    return self;
  },

  get damage() {
    let dmg = this.modifiers.find(item => item.source == "damage")
    return (!dmg) ? 0 : dmg.value
  },

  get current_value() {
    let val = this._current_value + this.damage
    if (val < 0) {
      return 0
    } else {
      return val
    }
  },

  get value() {
    if (this.changed == true) {
      this._value = this.get_final_value()
      this.changed = false
      return this._value
    }
    else return this._value;
  },

  get base_val() {
    return this._base_val
  },

  set base_val(value) {
    this._base_val = value
    this.changed = true
  },

  add_modifier: function(mod) {
    let new_mod = (typeof mod == 'number') ? StatModifier.create(mod) : Object.assign(StatModifier.create(0), mod)
    var find = this.modifiers.find(item => item.source == new_mod.source)
    if (!find) {
      this.modifiers.push(new_mod)
    } else {
      if (find.source == "damage" && find.value + new_mod.value > this.value) {
        find.value = this.value
      } else {
        find.value += new_mod.value
      }
    }
    this.changed = true
  },

  // vv somewhat redundant right now but maybe we'll use it later haha vv

  remove_modifier: function(mod) {
    if (this.modifiers.includes(mod)) {
      this.modifiers.splice(this.modifiers.indexOf(mod), 1)
      return true
    }
    else {
      return false
    }
  },

  remove_all_from_source: function(source) {
    if (source == "damage") {
      if (this._current_value <= this.value) {
        this._current_value = this.value
      } else {
        this._current_value = this.current_value
      }
    }
    if (this.modifiers.some(item => item.source === source)) {
      this.modifiers = this.modifiers.filter(item => item.source != source)
      this.changed = true
      return true
    }
    else {
      return false
    }
  },

  get total_modifiers() {
    return this.modifiers.filter(item => item.source != "damage").map(item =>
      item.value).reduce((first, next) => first + next, 0)
  },

  get_final_value: function() {
    let final = this.total_modifiers
    return (final + this.base_val < 0) ? 0 : final + this.base_val
  }
}
