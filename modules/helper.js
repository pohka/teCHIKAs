//miscellaneous functions
class Helper{
  //random integer between min and max (both inclusive)
  static randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  //returns a formated time string e.g. 2d 4h 31m
  //time in mins
  static formatTime(time){
    let dayLength = 1440;
    let hrLength = 60;
    let minLength = 1;
    let days = Math.floor(time/dayLength);
    let timeLeft = time - (days*dayLength);
    let hrs = Math.floor(timeLeft/hrLength);
    timeLeft -= hrs * hrLength;
    let mins = Math.floor(timeLeft/minLength);
    let timeStr = "";
    if(days > 0){
      timeStr += days + "d ";
    }
    if(hrs > 0){
      timeStr += hrs + "h ";
    }
    if(!(timeStr !== "" && mins == 0)){
      timeStr += mins + "m";
    }
    return timeStr;
  }

  //capitalzed first letter in the string
  static capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static toSQLDate(date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

}

module.exports = Helper;
