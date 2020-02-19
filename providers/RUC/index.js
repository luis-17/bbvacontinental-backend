const request = require('request');
const cheerio = require('cheerio');

class RUC {
  constructor(config) {
    this.config = config;
  }

  get(ruc) {
    return new Promise((resolve, reject) => {
      request.post({
        url: 'http://consultaderuc.info/',
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        },
        formData: {
          ruc,
          nombres: '',
        },
      }, function (error, response, html) { // eslint-disable-line
        if (error) {
          return reject(error.message);
        }
        const $ = cheerio.load(html);
        const $trs = $('.container > table > tbody > tr');
        const estado = $trs.eq(0).find('td').text().trim()
          .split(' ')[1];
        if (estado) {
          const ruc = $trs.eq(1).find('td:nth-child(2) > span').text().trim();
          const razonSocial = $trs.eq(2).find('td:nth-child(2) > span').text().trim();
          const direccion = $trs.eq(3).find('td:nth-child(2) > span').text().trim();
          const condicion = $trs.eq(4).find('td:nth-child(2) > span').text().trim();
          resolve({
            estado,
            ruc,
            razonSocial,
            direccion,
            condicion,
          });
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = RUC;
