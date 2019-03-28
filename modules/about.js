const RichMsg = require("../modules/richmsg.js");

exports.init = function (bot) {
  
  
    bot.actions.command.push({
    "key" : "about",
    "func" : function(msg, args){
      RichMsg.send(bot, msg.channel, { 
        title : bot.name + " - About",
        description: "I'm a bot made by Pohka",
        fields : [
          {
            name : "Source",
            value : "https://github.com/pohka/teCHIKAs"
          }
        ],
        mood : "default"
      }); 
    }
  });
}