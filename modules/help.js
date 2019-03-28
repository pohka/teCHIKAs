
exports.init = function (bot) {
  
  bot.actions.command.push({
    "key" : "help",
    "func" : help,
  });
  
  //help command
  function help(msg, args)
  {
    //display command list
    if(args.length == 1)
    {
      let desc = "To use a command use:```" + bot.prefix + "command```\n**Command List:**";
      for(let i=0; i<bot.actions.command.length; i++)
      {
        if(bot.actions.command[i].key != "help" && bot.actions.command[i].key.length > 0)
        {
          desc += "\n" + bot.actions.command[i].key;
        }
      }
      desc += "\n\n **More**\nFor more help use: ```!help command```";
      
      msg.channel.send({embed: {
        color: bot.color,
        description: desc,
        thumbnail : {
          url : bot.client.user.avatarURL
        }
      }});
      
      
    }
    //display help for a command
    else if(args.length >= 2)
    {
      var option = args[1];
      
      for(let i=0; i<bot.actions.command.length; i++)
      {
        if(bot.actions.command[i].key == option)
        {
          if(bot.actions.command[i].help !== undefined)
          {
            msg.channel.send({embed: {
              title: "Help: " + option,
              color: bot.color,
              description: bot.actions.command[i].help
            }});
          }
          break;
        }
      }
    }
    
  }
};