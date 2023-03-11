const iconv = require('iconv-lite');
const TelegramBot = require('node-telegram-bot-api');
const token = '6284973334:AAF8GkXRnkOj1VjZmTP3zsItb-4k2dBxvKk'
const bot = new TelegramBot(token, { polling: true });
const fs = require('fs');
const content = fs.readFileSync('info.json')
const date = JSON.parse(content)
const axios = require('axios');
const cheerio = require('cheerio');
const { slashCheck } = require('./slachCheck');
const { updateKeyboard } = require('./keyboard');
const { isAdmin } = require('./admin');
const siteUrl = 'http://ppcnuft.in.ua/%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8/'
let typeOfWeek = ''
let message = ''
let photo = 'http://www.pcxtnuht.pl.ua/images/general/gerb.png'

// новости


axios.get(siteUrl)
    .then(response => {
      message= ''
      const html = response.data;
      const $ = cheerio.load(html);
      $('a[href]').slice(22, 29).each(function () {
        const link = $(this).prop('href');
        const text = $(this).text();
        message += `\n<a href="${link}">${text}</a>\n`
      });
    })


setInterval(() => {
  axios.get(siteUrl)
    .then(response => {
      message= ''
      const html = response.data;
      const $ = cheerio.load(html);
      $('a[href]').slice(22, 29).each(function () {
        const link = $(this).prop('href');
        const text = $(this).text();
        message += `\n<a href="${link}">${text}</a>\n`
      });
    })
}, 86400)


//
async function getData() {
  const typeUrl = 'http://www.pcxtnuht.pl.ua/?kind=3&id=97&parent=95&lang=ua'; // замените на ваш URL
  const response = await axios.get(typeUrl, { responseType: 'arraybuffer' });
  const decodedHtml = iconv.decode(response.data, 'win1251');
  const $ = cheerio.load(decodedHtml);
  const text = $('em').text();
  let startIndexOfText = text.indexOf(',') + 2;
  let resultText = text.substring(startIndexOfText)
  typeOfWeek = `*Неділя: ${resultText}*`
}
getData()

setInterval(getData, 86400)

//проверка на чисельник/знаменник

//кнопка розклада
let keyboard = updateKeyboard()



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text
  if (text === '/start') {
    await bot.sendMessage(chatId, `оберіть групу`, keyboard)
  }
  if (text === 'перезапуск бота') {
    await bot.sendMessage(chatId, `для перезапуска бота напишіть /start`)
  }
  if (text === 'my id') {
    await bot.sendMessage(chatId, `ваш id ${msg.from.id}`)
  }
  if (text === 'Заміни') {
    await bot.sendPhoto(chatId, photo)
  }
  if (text === 'новини') {
    bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
  }
  if (text === 'edit' && isAdmin(msg.from.id)) {
    await bot.sendMessage(chatId, `щоб вийти з меню редагування нажміть \n/start \nid адмінов ${date.admin.map((el) => { return el })}`, {
      reply_markup: {
        keyboard: [
          [{ text: 'змінити розклад', web_app: { url: 'https://gleaming-tulumba-98314d.netlify.app' + '/schedule' } }],
          [{ text: 'додати группу', web_app: { url: 'https://gleaming-tulumba-98314d.netlify.app' + '/newgroup' } }],
          [{ text: 'додати / видалити адміна', web_app: { url: 'https://gleaming-tulumba-98314d.netlify.app' + '/admin' } }],
        ],
        resize_keyboard: true
      }
    })

  }
  for (let key in date.schedule) {
    if (text === `Розклад ${key}`) {
      if (date.schedule[key].Friday) {
        let monday = date.schedule[key].Monday
        let Tuesday = date.schedule[key].Tuesday
        let Wednesday = date.schedule[key].Wednesday
        let Thursday = date.schedule[key].Thursday
        let Friday = date.schedule[key].Friday
        await bot.sendMessage(chatId, `${typeOfWeek}*\nПонеділок* \n1️⃣ ${slashCheck(monday[0].course, monday[0].room, monday[0].teacher)}
2️⃣ ${slashCheck(monday[1].course, monday[1].room, monday[1].teacher)}
3️⃣ ${slashCheck(monday[2].course, monday[2].room, monday[2].teacher)}
4️⃣ ${slashCheck(monday[3].course, monday[3].room, monday[3].teacher)}
*Вівторок* \n1️⃣ ${slashCheck(Tuesday[0].course, Tuesday[0].room, Tuesday[0].teacher)}
2️⃣ ${slashCheck(Tuesday[1].course, Tuesday[1].room, Tuesday[1].teacher)}
3️⃣ ${slashCheck(Tuesday[2].course, Tuesday[2].room, Tuesday[2].teacher)}
4️⃣ ${slashCheck(Tuesday[3].course, Tuesday[3].room, Tuesday[3].teacher)}
*Середа* \n1️⃣ ${slashCheck(Wednesday[0].course, Wednesday[0].room, Wednesday[0].teacher)}
2️⃣ ${slashCheck(Wednesday[1].course, Wednesday[1].room, Wednesday[1].teacher)}
3️⃣ ${slashCheck(Wednesday[2].course, Wednesday[2].room, Wednesday[2].teacher)}
4️⃣ ${slashCheck(Wednesday[3].course, Wednesday[3].room, Wednesday[3].teacher)}
*Четвер* \n1️⃣ ${slashCheck(Thursday[0].course, Thursday[0].room, Thursday[0].teacher)}
2️⃣ ${slashCheck(Thursday[1].course, Thursday[1].room, Thursday[1].teacher)}
3️⃣ ${slashCheck(Thursday[2].course, Thursday[2].room, Thursday[2].teacher)}
4️⃣ ${slashCheck(Thursday[3].course, Thursday[3].room, Thursday[3].teacher)}
*П'ятниця* \n1️⃣ ${slashCheck(Friday[0].course, Friday[0].room, Friday[0].teacher)}
2️⃣ ${slashCheck(Friday[1].course, Friday[1].room, Friday[1].teacher)}
3️⃣ ${slashCheck(Friday[2].course, Friday[2].room, Friday[2].teacher)}
4️⃣ ${slashCheck(Friday[3].course, Friday[3].room, Friday[3].teacher)}`, { parse_mode: 'Markdown' })
      }
    }
  }
  if (msg.web_app_data) {
    try {
      if (msg.web_app_data.data) {
        const data = JSON.parse(msg.web_app_data.data)
        if (data.group) {
          await bot.sendMessage(chatId, `privet ${data.group}`)
          for (let key in date.schedule) {
            if (key === data.group) {
              delete data.group
              date.schedule[key] = data
              const updatedData = JSON.stringify(date);
              fs.writeFileSync('info.json', updatedData);
            }
          }
        }
        if (data.changes) {
          date.changes = data
          const updatedData = JSON.stringify(date);
          fs.writeFileSync('info.json', updatedData);
        }
        if (data.newAdmin) {
          const id = parseInt(data.newAdmin)
          if (date.admin.includes(id)) {
            date.admin = date.admin.filter(number => number !== id);
            const updatedData = JSON.stringify(date);
            fs.writeFileSync('info.json', updatedData);
          } else {
            date.admin.push(id)
            const updatedData = JSON.stringify(date);
            fs.writeFileSync('info.json', updatedData);
          }

        }
        if (data.newGroup) {
          if (data.newGroup in date.schedule) {
            delete date.schedule[data.newGroup]
          }
          else {
            date.schedule[data.newGroup] = {}
          }
          const updatedData = JSON.stringify(date);
          fs.writeFileSync('info.json', updatedData);
          keyboard = updateKeyboard();
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }
});
bot.on('callback_query', async (msg) => {
  const chatId = msg.message.chat.id
  for (let key in date.schedule) {
    if (msg.data === key && isAdmin(msg.from.id)) {
      await bot.sendMessage(chatId, 'Для керування ботом використвуйте кнопку', {
        reply_markup: {
          keyboard: [
            [{ text: `Розклад ${key}` }], 
            [{ text: `новини` }, { text: `Заміни` }, {text: `Перезапуск бота`}], 
            [{ text: `edit` }],
          ],
          resize_keyboard: true
        }
      })
    }
    else if (msg.data === key) {
      await bot.sendMessage(chatId, 'Для керування ботом використвуйте кнопки', {
        reply_markup: {
          keyboard: [
            [{ text: `Розклад ${key}` }],
            [{ text: `новини` }, { text: `Заміни` }, {text: `Перезапуск бота`}],
          ],
          resize_keyboard: true
        }
      })
    }
  }
})
bot.on('photo', async (msg) => {
  if (isAdmin(msg.from.id)) {
    chatId = msg.chat.id
    photo = msg.photo[0].file_id
    await bot.sendMessage(chatId, 'заміни змінені')
  }
})