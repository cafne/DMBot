var fs = require('fs');

// Save and Load functions to be used with "globals.js"
// Usage: save(variable, key_in_globals.json)

function load(item, key_name) {
  fs.readFile("globals.json", function(err, data) {
    if (err) throw err;
    var data = JSON.parse(data)
    for (var i of Object.keys(data)) {
      console.log(i, key_name)
      if (i == key_name) {
        console.log(key_name)
        Object.assign(item, data[i])
      }
    }
  })
}

function save(item, key_name) {
  fs.readFile("globals.json", function(err, data) {
    if (err) throw err;
    var data = JSON.parse(data)
    data[Object.keys({item})[0]] = item
    data = JSON.stringify(data)
    fs.writeFile("globals.json", data, function(err, file) {
      if (err) throw err;
    })
  })
}


// Declare Variables here
var members = [];

// Export for global usage
module.exports = {members, save, load}
