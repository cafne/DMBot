# DiscordJS Bot Example 
###### _A breakdown of approach for Cilya :)_
##Basic Setup 
######If you just want to get this thing going:

Enter your bot's token in `config.json` and run `main.js` to start the bot!

>_The prefix used to invoke the bot's commands can also be changed in `config.json`. By default it is set to `!`_

>
[_Don't have a token? Click to scroll to full setup guide_](#Application-Setup)
##Structure
####Startup
`main.js` is the main entry point of the program.
####Commands
The bot looks for commands by checking <`message.content`> for the command prefix set in `config.json`. When a match is 
found the prefix is removed, and <`message.content`> is split 

>**Quick Tip:** 
>
>The `command` and `emoji` subfolders  hold the handlers for text-based and emoji based commands respectively. You can change a command's name by editing the `name` property in it's respective `.js` file.
 
####Components

 
##Completed Features
- ####Multiple Dice Roller
    
- ####Reaction to the <code>:coffin:</code> emoji
- ####Basic Character Database

##Full Application Setup 

- Head over to [The Discord Developer's Portal](https://discord.com/developers/applications) and login using your Discord account. From there hit the **[New Application]** button in the top- to create a new app. Give it a name when prompted.

- Add a bot to your application by entering the **[Bot]** sub-menu from the panel on the left. From there hit **[Add Bot]** and confirm.

- Congrats! You've created your first bot user. You can reveal/copy your token from this page and enter it into `config.json`. 
    > Be sure to keep your token a secret, or your bot could be accessed for malicious purposes. If your token is leaked, you can **[regenerate]**  it from this page as well.

- #####To invite your bot to a server: 
- Enter the **[OAuth]** submenu from the panel on th left. Scroll down to <_OAuth URL 
Generator_> and check `bot` from the list of <*Scopes*>.
- Check off whichever server permissions you'd like to give your bot under <*Bot Permissions*>
    >This bot uses [Send Messages], [Embed Links], [Read Message History] and [Mention Everyone]: if you're unsure.

- Enter the generated link into your web browser and select the server you want the bot to join from the drop-down menu.
Double-check your permissions and authorize.
- Prove you're not a bot yourself, and you're application is all set to go! 
 