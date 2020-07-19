module.exports = function args_parse(args, firstIsSingle=true, options={}, singlesKey="") {

  final = {[singlesKey]: []}

  // For setting a name.
  // Typical command usage is !<commandName> <name> > <options>
  if (firstIsSingle == true) {
    final.name = args[0].substr(0, args[0].indexOf(">")).trim()
    args[0] = args[0].substr(args[0].indexOf(">")+1).trim()
  }

  // Check if the option is a special type (array, dice or modifier)
  for (item of args) {

    // Names of options and values are typically seperated by colons
    // "modifier"-type options are seperated by either "+" or "-"
    // "array"-types are seperated by spaces
    // "dice"-types are seperated into two values: dice_num and dice_sides by "d"
    let val = (item.includes(":")) ? item.split(":") : item.split(/[-+]/)

    if (val.length > 1) {
      let key = val.shift().trim().toLowerCase()
      val = val.toString().trim()


      if (Object.keys(options).includes(key)) {
        try {
          switch (options[key]) {
            case "array":
              final[key] = val.split(/ +/g)
              break;
            case "dice":
              if (!val.toLowerCase().includes("d")) {
                return false
              }
              val = val.split("d").map(item => item.trim())
              if (!val.some(item => parseInt(item) === null)) {
                final["dice_num"] = parseInt(val[0])
                final["dice_sides"] = parseInt(val[1])
              }
              break;
            case "modifier":
              val = item.replace(/ +/g)
              let find = val.match(/[+-]/)[0]
              val = Number(val.substr(val.indexOf(find)))
              if (!val) {
                return false
              }
              final[key] = val
              break;
            default:
              return false
            }
          } catch (error) {
            console.log(error);
            return false
          }
      } else {
        switch (val) {
          case !val:
            return false
          case Number(val):
            final[key] = Number(val)
            break;
          case val.toLowerCase() == "true":
            final[key] = true
            break;
          case val.toLowerCase() == "false":
            final[key] = false
            break;
          default:
            final[key] = val
            break;
        }
      }
    } else if (singlesKey) {
      final[singlesKey].push(val.toString().trim())
    } else {
      return false
    }
  }
  // If there was a problem parsing any options return "false"
  // Else return the parsed arguments
  return (Object.values(final).some(item => item === undefined)) ? false : final
}
