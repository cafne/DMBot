
<h1>DiscordJS Bot Example</h1>  
<h6>A breakdown of approach for Cilya :)</h6>
<h2>Table of Contents</h2>

- [Basic Setup](#Basic-Setup)
- [Structure](#Structure)
    * [Startup](#Startup)
    * [Commands](#Commands)
        * [Watching for Commands](#cmd-watch)
        * [Command Structure](#cmd-struc)
        * [Why use a command handler?](#handle)
    * [Components](#components)
- [Completed Features](#feat)
    * [Multiple Dice Roller](#dice)
    * [Reaction to Emojis](#react)
    * [Basic Character Database](#cdata)
- [Full Application Setup](#fsetup)

<a name="Basic-Setup"></a><h2>Basic Setup</h2>
<h6>If you just want to get this thing going:</h6>  

Enter your bot's token in <code>config.json</code> and run <code>node main.js</code> to start the bot!  

>_The prefix used to invoke the bot's commands can also be changed in <code>config.json</code>. By default it is set to <code>!</code>_  

>  
[_Don't have a token? Click to scroll to full setup guide_](#fsetup)  
<a name="Structure"></a><h2>Structure</h2>
<h4>Startup</h4>
<code>main.js</code> is the main entry point of the program.  

<a name="Commands"></a><h4>Commands</h4>
<a name="cmd-watch"></a><h5>Watching for Commands</h5>
The bot looks for commands by checking <code>message.content</code> for the command prefix set in <code>config.json</code>. When a match is  
found the prefix is removed, and <code>message.content</code> is split by spaces into an array of individual options-- <code>args</code>.  

```javascript  
if (msg.content.startsWith(prefix)) {  
 const args = msg.content.toLowerCase().slice(prefix.length).split(/ +/);
 const commandName = args.shift();
 ```  

The first item in this array (or word in command) is assumed to be the name of the command (and is set to
<code>commandName</code>).
It is first removed from the array of <code>args</code>.

Next, the command handler checks if that command exists. If it does, <code>commandName</code> is used to get the appropriate command from the bot's collection of commands.
The original <code>message</code >and <code>args</code> array are then passed to the command's external <code>execute()</code> function.  
```javascript  
const command = client.commands.get(commandName);  
command.execute(message, args);  
```  
> <h6>Read More</h6>
>
>_A full breakdown and explanation of the string manipulation functions used to extract the prefix can be found in
>[<code>breakdowns/string_manipulation_basics.md</code>](https://github.com/cafne/DiscordJSTest/blob/master/breakdowns/string_manipulation_basics.md)_

<a name="cmd-struc"></a><h5>Command Structure</h5>
Commands are stored in the <code>./commands</code> folder.

Each command is its own <code>.js</code> file. They are made with
the following template:

```javascript
module.exports = {
    name: "Name of command",
    desc: "Command description",
    args: true (or) false
    execute(message, args) {
        // logic for command goes here
}
```
The <code>name</code> property speaks for itself. It is the string used to invoke a command. The name of the
<code>.js</code> file does not have to match the <code>name</code> of the command.

The <code>desc</code> property is a description of the command's use. This can be used to provide information in a <code>!help</code>
command.

<code>args</code> tells us whether or not this command takes any extra options. It should be either <code>true</code> or
<code>false</code>.

The <code>execute()</code> function is where the magic happens.
>This is where you tell the bot to roll a die. Yell "pong!"
after a "!ping". The world's your oyster!

<code>message</code> and <code>args</code> are passed to <code>execute()</code> function so you can view and make use of
the original <code>message</code> object along with the options the command it was sent with.

Take, for example, the <code>!newchar</code> command:
```javascript
execute(message, args) {
    members.push(Player.create(args[0]))
    message.channel.send(`Created new character ${args[0]}`)
}
```
>Lets assume the inputted command was <code>!newchar NaNa</code>

The <code>args</code> value would equal <code>args = ["NaNa"]</code>. We take take the first and only value of <code>args</code>
and pass it to the <code>Player.create()</code> function to create a new character by the name of <code>NaNa</code>.
We can then invoke the **original** <code>message</code>'s <code>.send()</code> method to send
<code>"Created new character"</code> (again with the character name, taking the first value of <code>args</code>) to
the original Discord channel the command was sent in.

<a name="handle"></a><h5>Why use a command handler?</h5>
```javascript
client.on("message", message => {
    if (message.content.startsWith("!command1")) {
        // do command1    
    }
    else if (message.content == "!command2") {
        // do command2
    }
    // ect...
});
```
You've likely seen this snippet in quick bot setup examples. The code short and is simple to understand, isn't it?
While <code>if/else</code> statements are a perfectly valid way of checking for commands, you can run into problems when building
bots of a larger scope.

Take this snippet of code from the original NaNaBot for example:

![Oh God.](https://i.imgur.com/a6mYdEy.png)

Thousands of lines of code, and hundreds of nested <code>if/else</code> statements.

Not only did I have to keep typing the same <code>if message.content.startswith("command")</code> statement over and over,
every time I wanted to make changes to one of my existing commands I would have to first find it through thousands of lines
of code. Editing the commands themselves was like preforming brain surgery. A single indentation mismatch would send me
on a rat's race. Eventually it became so much of a hassle that I ended up re-writing NaNa from scratch.

To elaborate, using a command handler can help prevent poorly-structured "spaghetti code" since each command is contained
within it's own function. We can also dynamically add and load our commands from our <code>commands</code> folder instead of having them hard-coded into the main file.



<h4>Components</h4>
The <code>components</code> folder holds the core modules of the Character Database System.

> See [Basic Character Database](#cdata) for more information.

<h4>Global Variables</h4>
Variables used across different components and commands are imported from <code>globals.js</code>
This includes the array that holds all registered characters, <code>members</code>.

Ideally, these persistent variables should be stored in a <code>.json</code> file so that they can be saved and reloaded
each time the bot restarts.

<a name="feat"></a><h2>Completed Features</h2>  
- <a name="dice"></a><h4>Multiple Dice Roller</h4>
    >Usage: <code>[number of dice]d[number of sides]</code>

    This utilizes the <code>Math.Random()</code> module to get a random point value from 0 to 1. We then multiply this value by the number of <code>sides_on_a_die</code> and run this through <code>Math.floor()</code> to round the decimal down; this gets us a random number between <code>0 and sides_on_a_die</code>. A die doesn't have a side with <code>0</code> on it, so we also add <code>1</code> to ensure that the lowest number returned is at least <code>1</code>.
    ```javascript
        Math.floor(Math.random() * sides) + 1  
    ```
    > A basic code snippet for generating random numbers

    While this dice roller is currently bound to it's own command, you could eventually use the base code to implement usage with
    player/character stats.
    > See [<code>./commands/roll.js</code>](https://github.com/cafne/DiscordJSTest/blob/master/commands/roll.js) for full dice roller.
- <a name="react"></a><h4>Reaction to the <code>:coffin:</code> emoji</h4>
    > Usage: <code>:coffin:</code> (that's it)

    This is evoked as an emoji command so it does not require the command prefix.

    The first time the command is sent by a user, a new property called <code>dead</code> is added to the Discord.User and is set to <code>1</code>.
    Every time the emoji is sent by that user the <code>dead</code> value increases and the bot sends the user's <code>dead</code> value.

    >```javascript
    >message.author["dead"] = 1
    >```
    >
    > See [<code>./emoji/dead.js</code>](https://github.com/cafne/DiscordJSTest/blob/master/emoji/dead.js) for the full code.
- <a name="cdata"></a><h4>Basic Character Database</h4>  
    > <code>!status [name] for calling a character</code>
    >
    > <code>!newchar [name] to register a new character</code>

    Each character is a <code>Player()</code> object. They can be named, have an <code>HP</code> stat, and the bases for an
    inventory.

    When a new character is created, the data is saved to <code>globals.json</code> using the <code>save()</code> method located in <code>globals.js</code>.
    This way, data is not lost when the bot shuts down; and can be reloaded on restart with <code>load()</code>
    > See [<code>./components</code>](https://github.com/cafne/DiscordJSTest/tree/master/components) for a preview of the basic frameworks of a character database.

    > Or [<code>./breakdowns/character_system.md</code>](https://github.com/cafne/DiscordJSTest/blob/master/breakdowns/character_system.md) for approaching implementation of a complex character database with
    modifiable stats, trading, ect

<h2><a name="fsetup">Full Application Setup</a></h2>  

- Head over to [The Discord Developer's Portal](https://discord.com/developers/applications) and login using your Discord   
account. From there hit the **[New Application]** button in the top-left to create a new app. Give it a name when prompted.  

- Add a bot to your application by entering the **[Bot]** sub-menu from the panel on the left. From there hit **[Add Bot]** and confirm.  

- Congrats! You've created your first bot user. You can reveal/copy your token from this page and enter it into   
<code>config.json</code>.  
    > Be sure to keep your token a secret, or your bot could be accessed for malicious purposes. If your token is leaked,   
    you can **[regenerate]**  it from this page as well.  

<h4>To invite your bot to a server:</h4>

- Enter the [**OAuth**] submenu from the panel on th left. Scroll down to _OAuth URL Generator_ and check <code>bot</code>
from the list of _Scopes_.
- Check off whichever server permissions you'd like to give your bot under _Bot Permissions_
    >This bot uses [Send Messages], [Embed Links], [Read Message History] and [Mention Everyone]: if you're unsure.  

- Enter the generated link into your web browser and select the server you want the bot to join from the drop-down menu.  
Double-check your permissions and **[authorize]**.  
- Prove you're not a bot yourself, and your application is all set to go!
