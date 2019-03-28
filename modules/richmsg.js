const Helper = require("../modules/helper.js");

class RichMsg{
  //random integer between min and max (both inclusive)
  static send(bot, channel, data)
  {
    //custom emotions for the thumbnail of the message
    let moods = {
      "happy" : "https://i.imgur.com/O0T10jl.png",
      "angry" : "https://i.imgur.com/q6HPe61.png",
      "shy" : "https://i.imgur.com/oGfc4B2.png",
      "monka" : "https://i.imgur.com/NiHEcCG.png",
      "crazy" : "https://i.imgur.com/WRGNq2J.png",
      "default" : bot.client.user.avatarURL,
    };
    
    if(data.mood !== undefined)
    {
      //random mood
      if(data.mood == "random")
      {
        var count = 0;
        for (let key in moods) {
          count++;
        }
    
        let i = Helper.randomInt(0, count-2);
        let count2 = 0;
        for (let key in moods) {
          if(count2 == i)
          {
            data.thumbnail = { 
              url: moods[key] 
            };
            break;
          }
          count2++;
        }
      }
      //find mood
      else if (data.mood in moods)
      {
        data.thumbnail = { 
          url: moods[data.mood] 
        };
      }
      //no mood found
      else
      {
        data.thumbnail = {
          url: bot.client.user.avatarURL
        };
      }
    }
    
    data.color = bot.color;
    
    
    channel.send({embed: data});
  }
  
};

module.exports = RichMsg;