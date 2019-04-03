
exports.init = function (bot) {
 

  bot.actions.command.push({
    "key" : "warning",
    "func" : warning,
    "help" : "warn a user of ban/mute.\n" + bot.prefix + "warning @user reason",
    "role" : "Moderator"
  }); 
  
    bot.actions.command.push({
    "key" : "mute",
    "func" : mute,
    "help" : "mute a user for a number of hours\n" + bot.prefix + "mute @user duration",
    "role" : "Moderator"
  }); 
   
   
  function mute(msg, args)
  {
    if(args.length == 3)
    {
      let now = Date.now();
      let hr = 60 * 60 * 1000;
      let duration = args[2] * hr;
      let muteEnd = now + duration;
      
      let endDate = new Date(muteEnd);
      let time = endDate.valueOf();
      console.log("mute ending in: " + endDate.toUTCString());
      
      if(args[1].includes("@"))
      {
        let userID = args[1].split("@")[1].split(">")[0];
        
        //find user
        bot.client.fetchUser(userID).then((user) => {
          //add mute time to database
          var sql = require("sqlite");
          sql.open('./db.sqlite').then(sql => {
            sql.run("INSERT INTO mutes (userID, time) VALUES (?, ?)", [userID, time])
              .then(()=>{
                msg.react("✅").catch(console.error);
                let dmMSG = "You have been muted for " + args[2] + "hrs \nMute expires: " + endDate.toUTCString();
                user.send(dmMSG);
                
               //create table if not exists
              }).catch(() => {
                sql.run("CREATE TABLE IF NOT EXISTS mutes (userID TEXT, time INTEGER)").then(() => {
                sql.run("INSERT INTO mutes (userID, time) VALUES (?, ?)", [userID, time])
                  .then(()=>{
                    msg.react("✅").catch(console.error);
                    let dmMSG = "You have been muted for " + args[2] + "hrs \nMute expires: " + endDate.toUTCString();
                    user.send(dmMSG);
                  }).catch(console.error);
                });
              });
          });
        });
      }
    }
  }
   
  function warning(msg, args)
  {
    
    if(args.length < 3)
    {
      if(args.length == 2)
      {
        msg.reply("Imcomplete command, must have a reason for warning. example: " + bot.prefix + "warning @user disruptive chat");
      }
      else
      {
        msg.reply("Imcomplete command, must have a user and reason for warning. example: " + bot.prefix + "warning @user disruptive chat");
      }
      return;
    }
    
    console.log(msg.content);
    
    let userID;
    if(args[1].includes("!"))
    {
      userID = args[1].split("<!")[1].split(">")[0];
    }
    else if(args[1].includes("@"))
    {
      userID = args[1].split("@")[1].split(">")[0];
    }
    else
    {
      msg.reply("user id not found");
    }
    
    //send warning msg
    if(userID !== undefined)
    {
      args.splice(0,2);
      let reason = args.join(" ");
      let rules = "\nPlease read the rules in <#448672986258472992>";
      let warningMSG = "<@" + userID + "> WARNING BAN/MUTE IMMINENT\nReason: " + reason + rules;
      msg.channel.send(warningMSG);
      msg.delete();
    }
  }
};