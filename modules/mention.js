exports.init = function (bot) {
  bot.actions.message.push({
    "name" : "mention",
    "func" : mention
  });
  
  //react when the bot or techies is mentioned
  function mention(msg, args)
  {
    let str = msg.content.toLowerCase();
    if(str.includes("techika") || str.includes("techies"))
    {
      let emoji = bot.client.emojis.find(emoji => emoji.name === "TechiesReported");
      msg.react(emoji.id).catch(console.error);
    }
    if(str.includes("1v1"))
    {
      let emoji = bot.client.emojis.find(emoji => emoji.name === "InvokerS");
      msg.react(emoji.id).catch(console.error);
    }
    
    if(str.includes("op"))
    {
      let emoji = bot.client.emojis.find(emoji => emoji.name === "FeelsIceFrog");
      msg.react(emoji.id).catch(console.error);
    }
  }
};