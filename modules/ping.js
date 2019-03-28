

exports.init = function (bot) {
  
  bot.actions.command.push({
    "key" : "ping",
    "func" : ping,
    "help" : "check to see if the bot is alive"
  });

  //uptime command
  function ping(msg, args)
  {
    let uptime = bot.client.uptime/1000;
    
    msg.channel.send("pong");
  }
};