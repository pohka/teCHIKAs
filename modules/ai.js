
exports.init = function (bot) {
  
    //view profile
  bot.actions.command.push({
    "key" : "learn",
    "func" : learn,
    "help" : "Teach the AI something new. The AI is user generated information.\n" + bot.prefix+  "learn keyword infomation\n\nExample:\n" + bot.prefix + "learn sniper good hero if you are herald" 
  });
  
  bot.actions.command.push({
    "key" : "ai",
    "func" : query,
    "help" : "Ask the AI what a word means \n\nExample:\n" + bot.prefix + "ai techies"
  });
  
  
  
  function learn(msg, args)
  {
    if(args.length >= 2)
    {
      let key = args[1].toLowerCase();
      args.splice(0,2);
      let val = args.join(" ");
      
      var sql = require("sqlite");
      sql.open('./db.sqlite').then(sql => {
        sql.run("INSERT INTO ai (keyword, val) VALUES (?, ?)", [key, val])
          .then(()=>{
            msg.channel.send("Entry added for '" + key + "'");
          })
          .catch(() => {
          sql.run("CREATE TABLE IF NOT EXISTS ai (keyword TEXT, val TEXT)").then(() => {
            sql.run("INSERT INTO ai (keyword, val) VALUES (?, ?)", [key, val])
              .then(()=>{
                msg.channel.send("Entry added for '" + key + "'");
              })
              .catch(console.error);
          }).catch(console.error);
        });
      });
    }
  }
  
  function query(msg, args)
  {
    //invalid command
    if(args.length < 2) return;
    
    let key = args[1].toLowerCase();
    var sql = require("sqlite");
      sql.open('./db.sqlite').then(sql => {
        sql.get(`SELECT * FROM ai WHERE keyword="${key}"`).then(row => {
        //new entry
          if (!row) 
          {
            msg.channel.send("No information found for '" + key + "'. You can teach me what '" + key + "' means using the 'learn' command");
          }
          else
          {
            let val = row.val;
            msg.channel.send(key + ": " + val);
          }
        })
      });
  }
}