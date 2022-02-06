require('dotenv').config();

// Устанавливаем библиотеку Covid19
const apiCovid19 = require('covid19-api');

const { Telegraf } = require('telegraf');

// Добаляем кнопки в боте.
const Markup = require('telegraf-markup4');

const countries = require('./constants.js');

const bot = new Telegraf(process.env.bot_token);
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!
Узнай статистику по Короновирусу.
Введи название страны на английском и получи информацию.
Посмотреть список страны можно набрав /help.
`
   , Markup.keyboard.reply([
      ['Russia', 'Belarus'],
      ['Ukraine', 'Us']
   ])
));

bot.help((ctx) => ctx.reply(countries));

// Пишем обработчик, чтобы при написании текста осущ-ся запрос который бы получал данные
bot.on('text', async (ctx) => {

   try {
      let data = {};
      data = await apiCovid19.getReportsByCountries(ctx.message.text);
      let formData = `
Страна: ${data[0][0].country}
Заболело: ${data[0][0].cases}
Выздоровело: ${[0][0].recovered}
Умерло: ${data[0][0].deaths}
`;
      ctx.reply(formData);
   }
   catch {
      ctx.reply('Ошибка, такой страны не существует, повторите запрос');
   };


});

bot.launch();

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));