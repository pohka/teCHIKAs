const Helper = require("../modules/helper.js");

exports.init = function (bot) {
  
  bot.actions.command.push({
    "key" : "uptime",
    "func" : c_uptime,
    "help" : "Time since the bot as been alive"
  });

  //uptime command
  function c_uptime(msg, args)
  {
    let uptime = bot.client.uptime/1000;
    
    msg.channel.send({embed:{
      color: bot.color,
      title: "Planting mines for: " + Helper.formatTime(uptime/60),
    }});
  }
};