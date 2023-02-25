const slashCheck = (text, room, teacher) => {
    if (text.indexOf("/") !== -1) {
      let searchChar = "/";
      // предмет
      let startIndexOfText = text.indexOf(searchChar) + 1;
      let endIndexOfText = text.indexOf(searchChar) - 1;
      let firstWordText = text.substring(0, endIndexOfText)
      let resultText = text.substring(startIndexOfText);
      //каобінет
      let startIndexOfRoom = room.indexOf(searchChar) + 1;
      let endIndexOfRoom = room.indexOf(searchChar) - 1;
      let firstWordRoom = room.substring(0, endIndexOfRoom)
      let resultRoom = room.substring(startIndexOfRoom);
      //викаладач
      let startIndexOfTeacher = teacher.indexOf(searchChar) + 1;
      let endIndexOfTeacher = teacher.indexOf(searchChar) - 1;
      let firstWordTeacher = teacher.substring(0, endIndexOfTeacher)
      let resultTeacher = teacher.substring(startIndexOfTeacher);
      return `*Чисельник* ${resultText} ${firstWordRoom} ${firstWordTeacher} \n        *Знаменник* ${firstWordText} ${resultRoom} ${resultTeacher}`
    }
    else {
      return `${text} ${room} ${teacher}`
    }
  }
module.exports = {slashCheck}