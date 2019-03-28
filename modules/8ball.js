const Helper = require("../modules/helper.js");
const RichMsg = require("../modules/richmsg.js");


exports.init = function (bot) {
  
  bot.actions.command.push({
    "key" : "8ball",
    "func" : eigthBall,
    "help" : "8 ball will answer yes/no questions"
  });

  function eigthBall(msg, args)
  {
    let responses = [
      "It is certain",
      "Without a doubt",
      "Yes, definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Yes",
      "Signs point to yes",
      "Better not tell you now",
      "Don't count on it",
      "My sources say no",
      "Very doubtful",
      "No"
    ];
    
    let index = Helper.randomInt(0, responses.length-1);
    RichMsg.send(bot, msg.channel, { 
      description: responses[index], 
      mood : "random"
    }); 
  }
};