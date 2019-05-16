// const fs = require('fs')
// const _path = require('path')
// /**
//  * Fetch well information from the data source
//  * 
//  * @param {string} name id to find well,in this case it is the file name the data is in
//  */
// const getWellInformation = (name) => {
//   let t = _path.resolve(__dirname, 'surveys/data')
//   let path = `${t}\\${name}.json`
//   try {
//     let data = fs.readFileSync(path, 'utf8')
//     return JSON.parse(data)
//   }
//   catch (err) {
//     console.log('err', err)
//     return err
//   }
// }
// /**
//  * Read a file and return the data
//  * 
//  * @param {string} path Path to file
//  * @param {string} file File name
//  */
// const readFile = (path, file) => {
//   return new Promise((resolve, reject) => {
//     let final = []
//     let fullpath = `${path}/${file}`
//     let data = null
//     try{
//       data = fs.readFileSync(fullpath, 'utf8')
//     }
//     catch(err){
//       console.log('err', err)
//       return reject(err)
//     }
//     let lines = data.replace(/\r/g, '').split('\n')
//     lines.forEach(line => {
//       let la = line.split(',').map(item => {
//         if (item)
//           return parseFloat(item)
//       })
//       if (la !== undefined)
//         final.push(la)
//     })
//     //generate a surface elevation for testing
//     let elev = 100 + Math.random() * 500
//     resolve({ data: final, name: file, elevation: elev })
//   })
// }
// /**
//  * Read all files in a folder
//  * 
//  * @param {string} name Folder name
//  * @param {string} ext File extension
//  */
// const getFile = (name, ext) => {
//   return new Promise((resolve, reject) => {
//     let reg = new RegExp(`.${ext}`, 'i')
//     fs.readdir(name, (err, files) => {
//       if (err) {
//         return reject(err)
//       }
//       let promises = []
//       files.forEach(file => {
//         if (file.search(reg) > 0)
//           promises.push(readFile(name, file))
//       });
//       Promise.all(promises).then(pr => {
//         return resolve(pr)
//       }).catch(reason => {
//         console.log(reason)
//         return reject(reason)
//       })
//     })
//   })
// }
// /**
//  * Fetch the surveys from their data source
//  * 
//  * @param {boolean} master Flag for master/frac borehole
//  */
// const getSurveys = async (master) => {
//   let group = []
//   let path = _path.resolve(__dirname, 'surveys/data')
//   if (master) 
//     path = _path.resolve(__dirname, 'surveys/master')
//   try {
//     group = await getFile(path, 'csv').catch(reason =>{
//       console.log('getSurveys', reason)
//       return reason
//     })
//     return group
//   }
//   catch (err) {
//     console.log('err', err)
//     return err
//   }
// }
// /**
//  * Get a survey from the file
//  * 
//  * @param {string} file CSV file name
//  */
// const getSurvey = async (file) =>{
//   let path = _path.resolve(__dirname, 'surveys/data')
//   let survey = await readFile(path, `${file}.csv`).catch(reason =>{
//     console.log('getSurvey', reason)
//     return reason
//   })
//   return survey
// }
// /**
//  * Get the Master/Frac survey
//  */
// const getMasterSurvey = async () =>{
//   return await getSurveys(true).catch(reason =>{
//     console.log('getMasterSurvey', reason)
//     return reason
//   })
// }
// module.exports = {
//   getWellInformation,
//   getSurveys,
//   getSurvey,
//   getMasterSurvey,
// }

'use strict'
const fs = require('fs');
const path = require('path')
const targz = require('targz');
const fetch = require('node-fetch');
const stream = require('stream');
const readline = require('readline');
const envs = require('../../envs');

const DATA_SRC = `${__dirname}\\data\\extract\\addresses.txt`;
const TAR_SRC = `${__dirname}\\data\\addresses.tar.gz`;

/**
 * Main Endpoint.
 * 
 * 
 */
// const getAddresses = async () => {
//    let query = req.query;
//    if (!query.type) 
//    {
//       query = {
//          ...query,
//          type: 'ROOFTOP'
//       };//default
//    }
//    if (!query.limit) 
//    {
//       query = {
//          ...query,
//          limit: '10'
//       };//default
//    }
//    else if(parseInt(query.limit) > 100)
//    {// max records are 100
//       query.limit = '100';
//    }
//    else if (parseInt(query.limit) < 0)
//    {//negative numbers not allowed
//       query.limit = '10';
//    }
//    if (!query.offset) 
//    {
//       query = {
//          ...query,
//          offset: '0'
//       };//default
//    }
//    else if(parseInt(query.offset) < 0)
//    {//negative numbers not allowed
//       query.offset = '0';
//    }
//    try
//    {
//       let isFile = await makeDataAvailable(DATA_SRC);
//       if (isFile !== true) 
//       {
//          return res.json({
//             code: 500,
//             msg: 'failed',
//             data: {
//                msg: `cannot access address data`,
//                error: isFile,
//             }
//          });
//       }
//       let bytesPerLine = 140;
//       let totalLines = 0;
//       fs.stat(DATA_SRC, (err, stats)=>{
//          if (err)
//          {
//             return res.json({
//                code: 502,
//                msg: 'error getting stats',
//                data: {
//                   error: err,
//                }
//             });
//          }
//          totalLines = stats.size / bytesPerLine;
//       })

//       let data = await extractAddresses(query, DATA_SRC);
//       data = data.filter(item => item);//remove nulls
//       if (query.format && 'geoJSON' === query.format )
//       {
//          data = getGeoJSON(data);
//          return res.json({
//             ...data
//          })
//       }
//       else
//       {
//          return res.json({
//             code: 200,
//             msg: 'success',
//             data: data,
//             size: data.length,
//             from: parseInt(query.offset),
//             to: parseInt(query.offset) + parseInt(query.limit),
//             totalLines: totalLines,
//          });
//       }
//    }
//    catch(e)
//    {
//       return res.json({
//          code: 501,
//          msg: 'error',
//          data: {
//             error: e,
//          }
//       });
//    }
// }

/**
 * Convert data to geoJSON format
 * @param {array} data Return from API
 */
const getGeoJSON = (data) =>{
   let geo = {
      type: 'FeatureCollection',
      metadata: {
         generated: Date.now(),
         title: 'Addresses',
         status: 200,
         api: '1.0.0',
         count: data.length,
      },
      features:[]
   }
   data.forEach(line =>{
      geo.features.push({
         type: "Feature",
         properties:{
            place: line.address,
         },
         geometry:{
            type: 'Point',
            coordinates:[parseFloat(line.lng), parseFloat(line.lat)]
         }
      })
   })
   return geo;
}

/**
 * Make sure the data is extracted and available
 * 
 * @param {string} src Path to the extracted text file
 */
const makeDataAvailable = (src) => {
   return new Promise((resolve, reject) => {
      try 
      {
         fs.access(src,
            async (err) => {
               let ret = null;
               if (err) //file not found
               {
                  //extract file
                  ret = await extractFiledata();
               }
               else//already extracted, pass through
               {
                  ret = true;
               }
               resolve(ret);
            })
      }
      catch (e) 
      {
         reject(e);
      }
   })
}

/**
 * Extract the tar.gz datafile to the extract directory
 */
const extractFiledata = () => {
   return new Promise((resolve, reject) => {
      targz.decompress({
         src: path.resolve(TAR_SRC),
         dest: path.resolve(`${__dirname}\\data\\extract`)
      }, (err) => {
         if (err) 
         {
            console.log(err);
            resolve(err);//resolve with the error
         }
         else 
         {
            resolve(true);
         }
      });
   })
}

/**
 * Extract Geocoded addresses that match the query criteria
 * 
 * @param {string} src source file path
 * @param {string} query The passed in query 
 */
const extractAddresses = (query, src) => {
   return new Promise((resolve, reject) => {
      let lineNo = 0;
      let offset =  parseInt(query.offset);
      let end =  parseInt(query.offset) + parseInt(query.limit);
      let data = fs.createReadStream(src, {encoding:'utf8'});
      let outStream = new stream();
      let rl = readline.createInterface(data, outStream);
      let promises = [];
      rl.on('line', (input) =>{
         lineNo++;
         if (lineNo > offset && lineNo <= end ){
            //process this line
            let parts = /(.{30})(.{2})(.{40})(.{4})(.{2})(.{10})(.{6})(.{30})(.{2})/.exec(input);
            if (!parts) 
            {
               return;
            }
            parts = formatAll(parts);
            if (!parts[1] || !parts[8] || !parts[9]) 
            {
               return;//critical parts for ROOFTOP missing
            }
            //critical parts of the address
            let addy = `${parts[1]}`;
            if (parts[2].length > 0) 
            {
               addy += `+${parts[2]}`;
            }
            if (parts[3].length > 0) 
            {
               addy += `+${parts[3]}`;
            }
            if (parts[4].length > 0) 
            {
               addy += `+${parts[4]}`;
            }
            if (parts[5].length > 0) 
            {
               addy += `+${parts[5]}`;
            }
            //add city and state
            addy += `,+${parts[8]},+${parts[9]}`;
            promises.push(fetchFromAPI(addy, query));
         }
      })
      data.on('end', () => {
         Promise.all(promises).then(pr => {
            resolve(pr);
         }).catch(reason => {
            console.log(reason);
            reject(reason);
         })
      })
   })
}
/**
 * Call Google api to get Geocoded address
 * 
 * @param {string} address formatted address extracted from data
 * @param {*} query The passed in query 
 */
const fetchFromAPI = (address, query) => {
   return new Promise((resolve, reject) => {
      let api_key = envs.get('API_KEY');
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${api_key}`;
      fetch(url)
         .then(res => res.json())
         .then(json => {
            if (json.results[0]) 
            {
               //get results, are they good?
               if (!json.results[0].partial_match &&
                  (json.results[0].geometry && json.results[0].geometry.location_type)
                  && query.type === json.results[0].geometry.location_type ) 
               {
                  resolve({
                     address: `${json.results[0].formatted_address}`,
                     lat: `${json.results[0].geometry.location.lat}`,
                     lng: `${json.results[0].geometry.location.lng}`,
                  });
               }
               else 
               {
                  resolve();//return null
               }
            }
         })
         .catch(reason => {
            console.log(reason);
            reject(reason);
         })
   })
}

/**
 * Format the extracted values as required
 * 
 * trims and adds + in place of space
 * @param {array} ar 
 */
const formatAll = (ar) => {
   return ar.map(item => item.trim().replace(/\s/g, '+'));
}

module.exports = {
   extractFiledata,
   extractAddresses,
   formatAll,
   makeDataAvailable,
   getGeoJSON,
}
