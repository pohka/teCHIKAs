
exports.init = function (bot) {
  
  bot.actions.ready.push({
    "name" : "presence",
    "func" : function()
    {
      bot.client.user.setPresence({ game: {
        name: bot.prefix + "help",
        type : "LISTENING"
        },
        status: "online",
        afk: false
      });
    }
  });
  
};