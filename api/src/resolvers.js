const DATA_SRC = `${__dirname}\\data\\extract\\addresses.txt`;
const fs = require('fs');
const {
   makeDataAvailable,
   extractAddresses,
   getGeoJSON,
} = require('./server')

const getSize = () => {
   return new Promise((resolve, reject) => {
      let bytesPerLine = 140;
      fs.stat(DATA_SRC, (err, stats) => {
         if (err) {
            reject(JSON.stringify({
               code: 502,
               msg: 'error getting stats',
               data: {
                  error: err,
               }
            }));
         }
         resolve(stats.size / bytesPerLine);
      })
   })
}

module.exports = {
   getSize: async () => {
      return await getSize();
   },
   getAddresses: async (root, args, context, info) => {
      let query = {
         offset: '0',
         limit: '10',
         type: 'ROOFTOP',
         format: '',
      };
      if (root.offset) {
         query.offset =
            parseInt(root.offset) >= 0 ? root.offset : '0';
      }
      if (root.limit) {
         let v = parseInt(root.limit);
         query.limit =
            v >= 0 ? v <= 100 ? root.limit : '0' : '0';
      }
      if (root.format) {
         query.format = root.format;
      }
      try {
         let isFile = await makeDataAvailable(DATA_SRC);
         if (isFile !== true) {
            return JSON.stringify({
               code: 500,
               msg: 'failed',
               data: {
                  msg: `cannot access address data`,
                  error: isFile,
               }
            });
         }
         let totalLines = await getSize();
         let data = await extractAddresses(query, DATA_SRC);
         data = data.filter(item => item);//remove nulls
         if (query.format && 'geoJSON' === query.format) {
            data = getGeoJSON(data);
            return [data]

         }
         else {
            data.map(item => item.size = totalLines)
            return data
         }
      }
      catch (e) {
         return JSON.stringify({
            code: 501,
            msg: 'error',
            data: {
               error: e.message,
            }
         });
      }
   },
}