const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");


const activeUserIDs = [];
const minsActive = 5;
const prefix = "!";
const color = parseInt("FF6ECA", 16);


//list of all commands
const commandList = [
    "key" : "uptime",
    "func" : c_uptime,
    "help" : "time since the bot as been alive"
  },
  {
    "key" : "help",
    "func" : c_help,
    "help" : "N/A"
  }
  //example command
  //{ 
  //  "key" : "hero", 
  //  "func" : c_hero,
  //  "help" : "add help here"
  //},
];

//list of all intervals (time is in seconds)
const intervalList = [
  {
    "key" : "active",
    "func" : i_activeCheck,
    "time" : 60,
    "desc" : "removes active role from users who have not typed a message recently",
    "timeout" : ""
  }
];



//=============================================
//---- EVENTS
//=============================================

//on Ready event
client.on('ready', () => {
  
  //clear all active roles
  var guild = client.guilds.get(config.guildID);
  var role = guild.roles.find(role => role.name === "Active");
  role.members.map(member => {
    member.removeRole(role);
  });
  
  
  for(let i=0; i<intervalList.length; i++)
  {
    intervalList[i].timeout = client.setInterval(intervalList[i].func, intervalList[i].time * 1000);
  }
  
  console.log('teCHIKAs ready');
});

//on Message event
client.on('message', msg => {
  if(msg.content[0] == prefix)
  {
    var args = msg.content.substr(prefix.length).split(/\s+/);
    if(args.length > 0)
    {
      for(let i=0; i<commandList.length; i++)
      {
        if(commandList[i].key == args[0])
        {
          commandList[i].func(msg, args);
          break;
        }
      }
    }
  }
  
  let userID = msg.author.id;
  
  let found = false;
  for(let i=0; i<activeUserIDs.length && !found; i++)
  {
    if(activeUserIDs[i].id == userID)
    {
      found = true;
    }
  }
  
  if(!found)
  {
    console.log("active user:" + userID);
    
    var role = msg.guild.roles.find(role => role.name === "Active");
    msg.member.addRole(role);
    
    activeUserIDs.push({
      "id" : userID,
      "time" : Date.now()
    });
  }
});

//on Disconnect event
client.on('disconnect', event => {
  console.log("DISCONNECTED");
});


//=============================================
//---- INTERVALS
//=============================================

//interval active role check
function i_activeCheck()
{
  let now = Date.now();
  
  let diff = minsActive * 1000 * 60; //minutes to milliseconds
  
  for(let i=0; i<activeUserIDs.length; i++)
  {
    //inactive user
    if(now - activeUserIDs[i].time > diff)
    {
      console.log("inactive user:" + activeUserIDs[i].id);
      
      //fetch user
      client.fetchUser(activeUserIDs[i].id).then(user => {
        var guild = client.guilds.get(config.guildID);
        guild.fetchMember(user).then(member => {
          var role = guild.roles.find(role => role.name === "Active");
          member.removeRole(role);
        });
      });
      
      activeUserIDs.splice(i, 1);
      i--;
    }
  }
}

//=============================================
//---- COMMANDS
//=============================================

//uptime command
function c_uptime(msg, args)
{
  let uptime = client.uptime/1000;
  
  msg.channel.send({embed:{
    color: color,
    title: "Planting mines for:" + formatTime(uptime/60),
  }});
}

//help command
function c_help(msg, args)
{
  //display command list
  if(args.length == 1)
  {
    let desc = prefix + "help command \n\n**Command List:**";
    for(let i=0; i<commandList.length; i++)
    {
      if(commandList[i].key != "help")
      {
        desc += "\n" + commandList[i].key;
      }
    }
    
    msg.channel.send({embed: {
      color: color,
      description: desc
    }});
  }
  //display help for a command
  else if(args.length >= 2)
  {
    var option = args[1];
    
    for(let i=0; i<commandList.length; i++)
    {
      if(commandList[i].key == option)
      {
        msg.channel.send({embed: {
          title: "Help: " + option,
          color: color,
          description: commandList[i].help
        }});
        break;
      }
    }
  }
  
}

//=============================================
//---- HELPER FUNCTIONS
//=============================================

//convert time from seconds to d/h/m format
function formatTime(time)
{
  let dayLength = 1440;
  let hrLength = 60;
  let minLength = 1;
  let days = Math.floor(time/dayLength);
  let timeLeft = time - (days*dayLength);
  let hrs = Math.floor(timeLeft/hrLength);
  timeLeft -= hrs * hrLength;
  let mins = Math.floor(timeLeft/minLength);
  let timeStr = "";
  if(days > 0){
    timeStr += days + "d ";
  }
  if(hrs > 0){
    timeStr += hrs + "h ";
  }
  if(!(timeStr !== "" && mins == 0)){
    timeStr += mins + "m";
  }
  return timeStr;
}



client.login(config.token);
