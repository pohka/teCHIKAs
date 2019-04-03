
exports.init = function (bot) {
  bot.actions.message.push({
    "name" : "levels",
    "func" : evalMsg
  });
  
  //view profile
  bot.actions.command.push({
    "key" : "profile",
    "func" : viewProfile,
    "help" : "View your profile"
  });
  
  
  //xp required per level up
  const xpRequired = [
    100,
    500,
    800,
    1300,
    1700,
    2000
  ];
  
  //view profile
  function viewProfile(msg)
  {
    let userID = msg.author.id;
    var sql = require("sqlite");
    sql.open('./db.sqlite').then(sql => {
      sql.get(`SELECT * FROM profile WHERE userID ="${userID}"`).then(row => {
        if(!row)
        {
          msg.channel.send("Whoops! profile not found");
        }
        else
        {
          let level = calcLevel(row.xp);
          msg.channel.send({embed : {
            color : bot.color,
            title: msg.author.username + " - Profile",
            description :  
              "Level: " + level + 
              "\nLevel Progression: " + nextLevelXP(row.xp) + "%" +
              "\nTotal XP: " + row.xp,
            thumbnail : {
              url: msg.author.avatarURL
            }
          }});
        }
      })
    }).catch(console.error);
  }
  
  function nextLevelXP(xp)
  {
    let result = "";
    let level = 0;
    let i=0;
    let xpNextLevel = 0;
    let maxXPToLevelUp = xpRequired[xpRequired.length-1]
    while(true)
    {
      if(i >= xpRequired.length)
      {
        xpNextLevel = maxXPToLevelUp;
      }
      else
      {
        xpNextLevel = xpRequired[i];
      }
      xp -= xpNextLevel;
      if(xp >= 0)
      {
        level++;
      }
      else
      {
        xp = xpNextLevel+xp;
        if(i >= xpRequired.length)
        {
          xpNextLevel = maxXPToLevelUp;
        }
        else
        {
          xpNextLevel = xpRequired[i];
        }
        
        return result =  parseInt((xp/xpNextLevel) * 100);
        break;
      }
      
      i++;
    }
    return 0;
  }
  
  //calculates level from xp
  function calcLevel(xp)
  {
    let level = 0;
    let i=0;
    let xpNextLevel = 0;
    let maxXPToLevelUp = xpRequired[xpRequired.length-1]
    while(true)
    {
      if(i >= xpRequired.length)
      {
        xpNextLevel = maxXPToLevelUp;
      }
      else
      {
        xpNextLevel = xpRequired[i];
      }
      xp -= xpNextLevel;
      if(xp >= 0)
      {
        level++;
      }
      else
      {
        break;
      }
      
      i++;
    }
    return level;
  }
  
  
  function checkLevelUp(msg, xpBefore, xp)
  {
    let levelBefore = calcLevel(xpBefore);
    let levelNext = calcLevel(xp);
    
    if(levelBefore < levelNext)
    {
      msg.channel.send({embed : {
        color : bot.color,
        title: "LEVEL UP! - " + levelNext,
        description :  msg.author.username + " is now level " + levelNext,
        thumbnail : {
          url: msg.author.avatarURL
        }
      }});
    }
  }
  
  //returns true if attachment is an image
  function isImage(msgAttach)
  {
    var url = msgAttach.url;
    let isPNG = url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
    let isJPG = url.indexOf("jpg", url.length - "jpg".length /*or 3*/) > -1 || url.indexOf(".jpeg", url.length - ".jpeg".length /*or 3*/) > -1;
    return isPNG || isJPG;
  }
  
  function evalMsg(msg)
  {
    //testing
    //if(msg.channel.id != "446860424185643011") return;
    let userID = msg.author.id;
    let len = msg.content.length;
    let earnedXP = 0;
    let memeChannelID = "452653076206321699";
    
    let hasImage = false;
    if (msg.attachments.size > 0) {
      if (msg.attachments.every(isImage)){
        hasImage = true;
        //5 xp for meme in #memes channel
        if(memeChannelID == msg.channel.id)
        {
          earnedXP = 7;
        }
        //2xp elsewhere
        else
        {
          earnedXP = 2;
        }
      }
    }
    
    //if no image attachment, ignore short msgs and links
    if(!hasImage && (len < 5 || msg.content.includes("/") || msg.content.includes("http")))
    {
      return;
    }
    else
    {
      earnedXP += parseInt(len/5);
    }
    
    var sql = require("sqlite");
    sql.open('./db.sqlite').then(sql => {
      
      //calc xp for this message
      sql.get(`SELECT * FROM profile WHERE userID ="${userID}"`).then(row => {
        //new entry
        if (!row) 
        {
          sql.run("INSERT INTO profile (userID, xp) VALUES (?, ?)", [userID, earnedXP])
          .catch(console.error);
        }
        //existing entry
        else 
        {
          //check if leveled up
          let xpBefore = row.xp;
          row.xp += earnedXP;
          checkLevelUp(msg, xpBefore, row.xp);
          
          sql.run(`UPDATE profile SET xp = ${row.xp} WHERE userID = ${userID}`)
            .catch((err) => {
              console.log(err);
            });
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS profile (userID TEXT, xp INTEGER)").then(() => {
          sql.run("INSERT INTO profile (userID, xp) VALUES (?, ?)", [userID, earnedXP])
            .then((sql) => { sql.close(); })
            .catch((err) => {
              console.log(err);
            });
        }).catch(console.error);
      });
    });
    
  }
};