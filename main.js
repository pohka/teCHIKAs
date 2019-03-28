const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");


const bot = {
  name : "teCHIKAs",
  intervals : [], //intervals
  color : parseInt("FF6ECA", 16),
  actions : {
    "ready" : [],
    "message" : [],
    "command" : []
  },
  client : client,
  prefix : "!",
  activeUserIDs : [],
  //starts an interval by key
  startInterval : function(key){
    for(let i=0; i<bot.intervals.length; i++)
    {
      if(bot.intervals[i].key == key)
      {
        bot.intervals[i].timeout = bot.client.setInterval(bot.intervals[i].func, bot.intervals[i].time * 1000);
        return;
      }
    }
  }
}


require("./modules/uptime.js").init(bot);
require("./modules/mention.js").init(bot);
require("./modules/help.js").init(bot);
require("./modules/active.js").init(bot);
require("./modules/ping.js").init(bot);
require("./modules/8ball.js").init(bot);
require("./modules/presence.js").init(bot);
require("./modules/about.js").init(bot);

//on Ready event
client.on('ready', () => {
  
  let actions = bot.actions.ready;
  for(let i=0; i<actions.length; i++)
  {
    actions[i].func();
  }
  
  console.log('teCHIKAs ready');
});

//on Message event
client.on('message', msg => {
  //ignore bot messages
  if (msg.author.bot) return;
  
  //action for command event
  if(msg.content[0] == bot.prefix)
  {
    var args = msg.content.substr(bot.prefix.length).split(/\s+/);
    if(args.length > 0)
    {
      for(let i=0; i<bot.actions.command.length; i++)
      {
        if(bot.actions.command[i].key == args[0])
        {
          bot.actions.command[i].func(msg, args);
          break;
        }
      }
    }
  }
  
  //actions for message event
  for(let i=0; i<bot.actions.message.length; i++)
  {
    bot.actions.message[i].func(msg);
  }
  
});

//on Disconnect event
client.on('disconnect', event => {
  console.log("DISCONNECTED");
});

client.on('error', error => {
  console.log("CLIENT ERROR");
  console.log(error);
});


client.login(config.token);
