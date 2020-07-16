module.exports = {
    name: "bugreport",
    desc: "Bug reporting help.",
    args: false,
    execute(message, args) {
      const embed = {
        "description": "> Before reporting a new issue, please check the [following link](https://github.com/cafne/DiscordJSTest/issues) to ensure it isn't already being worked on.",
        "color": 5488632,
        "author": {
          "name": "Found a bug?",
          "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/257/lady-beetle_1f41e.png"
        },

        "footer": {
          "text": "Thank you for helping us improve! - cafne#9074"
        },

        "fields": [
          {
            "name": "To report a bug:",
            "value": "[Open up a new issue on Github](https://github.com/cafne/DiscordJSTest/issues) or fill out a [Bug Report](https://forms.gle/p5pCZ5vxGDH8eks27).\nPlease be sure to include steps to replicate the issue or screenshots."
          }
        ]
      }
      message.channel.send({embed: embed})
    }
}
