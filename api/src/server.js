'use strict'
const fs = require('fs');
const path = require('path')
const targz = require('targz');
const fetch = require('node-fetch');
const stream = require('stream');
const readline = require('readline');
const envs = require('../../envs');

const TAR_SRC = `${__dirname}\\data\\addresses.tar.gz`;

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
