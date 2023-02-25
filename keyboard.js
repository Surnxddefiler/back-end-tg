const fs = require('fs');

const updateKeyboard = () => {
  const content = fs.readFileSync('info.json')
  const date = JSON.parse(content)
  const keyboard = {
    reply_markup: {
      inline_keyboard: []
    }
  };

  const buttonRow = 5;
  let keyboardArr = [];
  for (let groups in date.schedule) {
    keyboardArr.push({ text: groups, callback_data: groups });

    if (keyboardArr.length >= buttonRow) {
      keyboard.reply_markup.inline_keyboard.push([...keyboardArr]);
      keyboardArr = [];
    }
  }

  if (keyboardArr.length > 0) {
    keyboard.reply_markup.inline_keyboard.push([...keyboardArr]);
  }
  return keyboard
}
module.exports = { updateKeyboard }