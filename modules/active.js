const config = require("../config.json");

exports.init = function (bot) {
  
  const MINS_ACTIVE = 15;
  
  bot.actions.ready.push({
    "name" : "active_setup",
    "func" : setupActive
  });
  
  bot.actions.message.push({
    "name" : "active",
    "func" : newMsg
  });
  
  bot.intervals.push({
    "key" : "active",
    "func" : activeCheck,
    "time" : 60,
    "desc" : "removes active role from users who have not typed a message recently",
    "timeout" : ""
  });
  
  function setupActive()
  {
    //clear all active roles
    var guild = bot.client.guilds.get(config.guildID);
    var role = guild.roles.find(role => role.name === "Active");
    role.members.map(member => {
      member.removeRole(role);
    });
    
    //start interval to check if active users have become inactive
    bot.startInterval("active");
  }
  
  function newMsg(msg)
  {
      //active roles
    let userID = msg.author.id;
    let now = Date.now();
    let found = false;
    for(let i=0; i<bot.activeUserIDs.length && !found; i++)
    {
      //found user, update last message time
      if(bot.activeUserIDs[i].id == userID)
      {
        bot.activeUserIDs[i].time = now;
        found = true;
      }
    }
    
    if(!found)
    {
      console.log("active user:" + userID);
      
      var role = msg.guild.roles.find(role => role.name === "Active");
      if(role !== undefined)
      {
        msg.member.addRole(role);
        
        bot.activeUserIDs.push({
          "id" : userID,
          "time" : now
        });
      }
    }
  }
  
  //interval active role check
  function activeCheck()
  {
    let now = Date.now();
    
    let diff = MINS_ACTIVE * 1000 * 60; //minutes to milliseconds
    
    for(let i=0; i<bot.activeUserIDs.length; i++)
    {
      //inactive user
      if(now - bot.activeUserIDs[i].time > diff)
      {
        console.log("inactive user:" + bot.activeUserIDs[i].id);
        
        //fetch user
        bot.client.fetchUser(bot.activeUserIDs[i].id).then(user => {
          var guild = bot.client.guilds.get(config.guildID);
          guild.fetchMember(user).then(member => {
            var role = guild.roles.find(role => role.name === "Active");
            member.removeRole(role);
          });
        });
        
        bot.activeUserIDs.splice(i, 1);
        i--;
      }
    }
  }
};