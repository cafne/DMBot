<h1>Getting the Command with String Manipulation Basics</h1>

```javascript
if (message.content.startsWith(prefix)) {  
 const args = message.content.toLowerCase().slice(prefix.length).split(/ +/); const commandName = args.shift();
```
> **Code Breakdown**: Let's say a user used the <code>!roll</code> command to roll 1D6.  
>  
>The <code>message.content</code> would be <code>"!roll 1D6"</code>  
>  
><code>prefix</code> represents our command prefix: <code>!</code>  
>  
><code>.toLower()</code> is used on <code>message.content</code> to change all letters to lowercase. This allows less strict usage of commands. If you want your bot commands to be case-sensitive, you can leave this out.  
>  

><code>.slice(prefix.length)</code> is used to extract a portion of our lowercase-ified <code>message.content</code>. <code>prefix.length</code> gets the length of our prefix (<code>1</code> character long in this case). This is passed into <code>.slice()</code> to tell us where to start cutting the message.  
> Our <code>message.content</code> is broken up by the computer into indexes like this:  
>  
>>```  
>>[0] [1] [2] [3] [4] [5] [6] [7] [8] [9]  
>> !   r   o   l   l   l       1   d   6 
>>```  
>...So <code>.slice(1)</code> would begin extracting from index number <code>1</code>-- "r" to the **last** and <code>9</code>th index "6":  leaving us with <code>roll 1d6</code> .

> <code>/ +/</code> Is a [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). In simplest terms, it looks for all spaces. We pass this into the <code>.split()</code> function to split <code>roll 1d6</code> into an array by it's spaces.
>The resulting array is <code>args = ["roll", "1d6"]</code>  

>Lastly, we use <code>.shift()</code> on <code>args</code> to remove the **first** element, "roll" from the array and set it to the <code>commandName</code>  

>This leaves us with our two variables:  
>>```  
>>args = ["1d6"]  
>>commandName = "roll"  
>>```  
  
