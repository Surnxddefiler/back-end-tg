const axios = require('axios');
const cheerio = require('cheerio');
const siteUrl = 'http://ppcnuft.in.ua/%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8/'
axios.get(siteUrl)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a[href]').slice(22, 27).each(function () {
      const link = $(this).prop('href');
      const text = $(this).text();
      message += `\n<a href="${link}">${text}</a>\n`
    });
  })