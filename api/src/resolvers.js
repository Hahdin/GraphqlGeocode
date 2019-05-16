// const {  
//   getWellInformation,
//   getSurveys,
//   getSurvey,
//   getMasterSurvey,
// } = require('./server')

// module.exports = {
//   Query: {
//     well: (root, args) => {
//       let file  = 'N/A'
//       if (!args.wellName || args.wellName.length < 1) {
//         wellName = 'ERROR: No name given'
//       } else {
//         //find the right data
//         file = args.wellName
//         let data = getWellInformation(args.wellName)
//         data.file = file
//         return data
//       }
//     },
//     surveys: async (root, args, context, info) => {
//       let data = await getSurveys(args.master).catch(reason =>{
//         console.log('surveys', reason)
//         return reason
//       })
//       return data;
//     },
//     survey: async (root, args,) =>{
//       let survey = await getSurvey(args.name).catch(reason =>{
//         console.log('survey err', reason)
//         return reason
//       })
//       return {
//         data: survey.data,
//         name: survey.name,
//         elevation: survey.elevation
//       }
//     },
//     master: async (root, args,) =>{
//       let survey = await getMasterSurvey().catch(reason =>{
//         console.log('master', reason)
//         return reason
//       })
//       return survey
//     }
//   },
//   Well:{//Handle at field level, say if you had to apply formatting, etc (ei: toUpperCase)
//     uwi: (root, args, context, info) =>{
//       return  root.uwi.toUpperCase()
//     }
//   },
//   Survey :{
//     surveyWell: async (root, args,) =>{
//       let file = root.name.split('.')
//       let data = getWellInformation(file[0])
//       return data
//     }
//   },
// };
//var root = { hello: () => 'Hello world!' };
const DATA_SRC = `${__dirname}\\data\\extract\\addresses.txt`;
const TAR_SRC = `${__dirname}\\data\\addresses.tar.gz`;
const fs = require('fs');
const {
  makeDataAvailable,
  extractAddresses,
  getGeoJSON,
} = require('./server')

module.exports = {
  hello: (root, args, context, info) => {
    return `${root.msg}`;
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
        v >= 0 ? v < 100 ? root.limit : '0' : '0';
    }
    if (root.format){
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
      let bytesPerLine = 140;
      let totalLines = 0;
      fs.stat(DATA_SRC, (err, stats) => {
        if (err) {
          return JSON.stringify({
            code: 502,
            msg: 'error getting stats',
            data: {
              error: err,
            }
          });
        }
        totalLines = stats.size / bytesPerLine;
      })

      let data = await extractAddresses(query, DATA_SRC);
      data = data.filter(item => item);//remove nulls
      if (query.format && 'geoJSON' === query.format )
      {
         data = getGeoJSON(data);
         return [data]
         
      }
      else
      {
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


  }
}