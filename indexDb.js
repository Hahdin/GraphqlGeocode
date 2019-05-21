

const debugtest = async () => {
   let db = promiseDb();
   try {
      let res = await db.open();
      if ('success' !== res) {
         return;
      }
      let sort = document.getElementById('sort');
      let getValue = document.getElementById('getValue');
      
      res = await db.getByIndex(sort.value, getValue.value);
      let el = document.getElementById('res');
      el.innerHTML = '';
      let msg = '<div><table class="table-hover table-striped table-bordered">'
      msg += '<tr class="table-primary"><th>street#</th><th>route</th><th>city</th><th>state</th><th>country</th></tr>'
      res.forEach(addy => {
         msg += `<tr class="table-success"><td>
         ${addy.street_number ? addy.street_number : ''}</td><td> 
         ${addy.route ? addy.route : ''}</td><td> 
         ${addy.locality ? addy.locality : ''}</td><td> 
         ${addy.administrative_area_level_1 ? addy.administrative_area_level_1 : ''}</td><td> 
         ${addy.country ? addy.country : ''}</td></tr> `;
      })
      msg += '</table></div>'
      el.innerHTML += msg;
      
      /**
       * for tests
       */
      //writeRecords(db);
      //writeSingleRecord(db);
   }
   catch (e) {
      console.log(e);
      document.getElementById('res').innerHTML += JSON.stringify(e);
   }
}

//debug helpers
/**
 * 
 * @param {object} rawAddy raw data from Geocode api
 */
const formatAddress = (rawAddy) =>{
   let street_number = rawAddy.address_components.filter(component => component.types.includes('street_number'));
   let route = rawAddy.address_components.filter(component => component.types.includes('route'));
   let locality = rawAddy.address_components.filter(component => component.types.includes('locality'));
   let administrative_area_level_2 = rawAddy.address_components.filter(component => component.types.includes('administrative_area_level_2'));
   let administrative_area_level_1 = rawAddy.address_components.filter(component => component.types.includes('administrative_area_level_1'));
   let country = rawAddy.address_components.filter(component => component.types.includes('country'));
   let postal_code = rawAddy.address_components.filter(component => component.types.includes('postal_code'));
   return {
      place_id: rawAddy.place_id,
      street_number: street_number[0] ? street_number[0].long_name : '',
      route: route[0] ? route[0].long_name : '',
      locality: locality[0] ? locality[0].long_name : '',
      administrative_area_level_2: administrative_area_level_2[0] ? administrative_area_level_2[0].long_name : '',
      administrative_area_level_1: administrative_area_level_1[0] ? administrative_area_level_1[0].long_name : '',
      country: country[0] ? country[0].long_name : '',
      postal_code: postal_code[0] ? postal_code[0].long_name : '',
      lat: rawAddy.geometry.location.lat,
      lng: rawAddy.geometry.location.lng,
   }
}
/**
 * 
 * @param {object} db The Database
 */
const writeSingleRecord = async (db) => {
   // * Write a single test address to the IndexDB storage
   let rawAddy = JSON.parse("{\"address_components\":[{\"long_name\":\"346\",\"short_name\":\"346\",\"types\":[\"street_number\"]},{\"long_name\":\"Summer Lane\",\"short_name\":\"Summer Ln\",\"types\":[\"route\"]},{\"long_name\":\"Maplewood\",\"short_name\":\"Maplewood\",\"types\":[\"locality\",\"political\"]},{\"long_name\":\"Ramsey County\",\"short_name\":\"Ramsey County\",\"types\":[\"administrative_area_level_2\",\"political\"]},{\"long_name\":\"Minnesota\",\"short_name\":\"MN\",\"types\":[\"administrative_area_level_1\",\"political\"]},{\"long_name\":\"United States\",\"short_name\":\"US\",\"types\":[\"country\",\"political\"]},{\"long_name\":\"55117\",\"short_name\":\"55117\",\"types\":[\"postal_code\"]},{\"long_name\":\"2335\",\"short_name\":\"2335\",\"types\":[\"postal_code_suffix\"]}],\"formatted_address\":\"346 Summer Ln, Maplewood, MN 55117, USA\",\"geometry\":{\"location\":{\"lat\":44.9965369,\"lng\":-93.085594},\"location_type\":\"ROOFTOP\",\"viewport\":{\"northeast\":{\"lat\":44.9978858802915,\"lng\":-93.0842450197085},\"southwest\":{\"lat\":44.9951879197085,\"lng\":-93.08694298029151}}},\"place_id\":\"ChIJhS5HFp7VslIRnA0ypyWae5M\",\"plus_code\":{\"compound_code\":\"XWW7+JQ Maplewood, White Bear Township, MN, United States\",\"global_code\":\"86P8XWW7+JQ\"},\"types\":[\"street_address\"]}");
   res = await db.createAddress(formatAddress(rawAddy));
   if (res) {
      console.log(res);
      document.getElementById('res').innerHTML += `<br/>${JSON.stringify(res)}`;
   }
}
/**
 * 
 * @param {object} db The Database
 */
const writeRecords = async (db) => {
   // * Write addresses from the source file to the indexDB storage

   let promises = [];
   const queryGetSize = `{
         getSize
      }`

   res = await postApi(queryGetSize);
   // let lines = res.data.getSize;
   let lines = 100;//limit for debug, copy first 100
   let start = 0
   let queryGetAddress = getAddressQuery(lines, start);

   while (start < lines) {
      start += 100;
      res = await postApi(queryGetAddress);
      res.data.normal.forEach(address => {
         let rawAddy = JSON.parse(address.raw);
         promises.push(db.createAddress(formatAddress(rawAddy)))
      })
      queryGetAddress = getAddressQuery(100, start);
   }
   Promise.all(promises).then(pr => {
      console.log(pr);
   }).catch(reason => console.log(reason));
}
/**
 * 
 * @param {object} store IDBObjectStore 
 */
const createIndexes = (store) => {
   store.createIndex('street_number', "street_number", { unique: false });
   store.createIndex('route', "route", { unique: false });
   store.createIndex('locality', "locality", { unique: false });
   store.createIndex('administrative_area_level_2', "administrative_area_level_2", { unique: false });
   store.createIndex('administrative_area_level_1', "administrative_area_level_1", { unique: false });
   store.createIndex('country', "country", { unique: false });
   store.createIndex('postal_code', "postal_code", { unique: false });
   store.createIndex('lat', "lat", { unique: false });
   store.createIndex('lng', "lng", { unique: false });
}

/**
 * Promisified interface for IndexDB storage
 */
const promiseDb = () => {
   if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB.");
      return;
   }
   let addyDB = {};
   let datastore = null;
   datastore.onclose = (event) => {
      window.alert('The database "' + datastore.name + '" has unexpectedly closed.');
      return;
   };
   /**
    * Open the addresses database
    */
   addyDB.open = () => {
      return new Promise((resolve, reject) => {
         let request = indexedDB.open('addresses', 2);

         request.onupgradeneeded = (e) => {
            let db = e.target.result;
            // Delete the old datastore.
            if (db.objectStoreNames.contains('addresses')) {
               db.deleteObjectStore('addresses');
            }
            // Create a new datastore.
            let store = db.createObjectStore('addresses', { keyPath: 'place_id' });
            createIndexes(store);
            resolve('success');
         }
         request.onsuccess = (e) => {
            datastore = e.target.result;
            resolve('success');
         }
         request.onerror = (e) => {
            // Don't forget to handle errors!
            window.alert(e.target.errorCode);
            reject(error);
         };
      })
   }

   /**
    * @param {number} keyRangeLowerBound Cursor start
    */
   addyDB.getAddresses = (keyRangeLowerBound) => {
      let range = keyRangeLowerBound;
      return new Promise((resolve, reject) => {
         let db = datastore;
         let transaction = db.transaction(['addresses'], 'readwrite');
         let objStore = transaction.objectStore('addresses');
         let keyRange = IDBKeyRange.lowerBound(range);
         let cursorRequest = objStore.openCursor(keyRange);
         let addresses = [];

         transaction.oncomplete = (e) => {
            resolve(addresses);
         };
         cursorRequest.onsuccess = (e) => {
            let result = e.target.result;
            if (!!result == false) {
               return;
            }
            addresses.push(result.value);
            result.continue();
         };
         cursorRequest.onerror = (e) => {
            window.alert(e.target.errorCode);
            reject(error);
         }
      })
   }

   /**
    * @param {string} index The index to use
    */
   addyDB.getByIndex = (index, value) => {
      let _index = index;
      let _value = value;
      return new Promise((resolve, reject) => {
         let db = datastore;
         // Initiate a new transaction.
         let transaction = db.transaction(['addresses'], 'readonly');
         let objStore = transaction.objectStore('addresses');
         let storeIndex = objStore.index(_index);
         let addresses = [];

         if (value)
         {
            let singleKeyRange = IDBKeyRange.only(_value);
            storeIndex.openCursor(singleKeyRange).onsuccess = (event) => {
               let cursor = event.target.result;
               if (cursor) {
                  addresses.push(cursor.value);
                  cursor.continue();
               }
               else {
                  resolve(addresses);
               }
            };
         }
         else
         {
            storeIndex.openCursor().onsuccess = (event) => {
               let cursor = event.target.result;
               if (cursor) {
                  addresses.push(cursor.value);
                  cursor.continue();
               } else {
                  resolve(addresses);
               }
            }
         }
      })
   }

   /**
    * @param {object} address Address data
    */
   addyDB.createAddress = (address) => {
      let addy = { ...address };
      return new Promise((resolve, reject) => {
         let db = datastore;
         // Initiate a new transaction.
         let transaction = db.transaction(['addresses'], 'readwrite');
         let objStore = transaction.objectStore('addresses');
         let request = objStore.put(addy);
         // Handle a successful datastore put.
         request.onsuccess = (e) => {
            resolve(e.target.result);
         };
         // Handle error
         request.onerror = (e) => {
            window.alert(e.target.errorCode);
            reject(e.target.errorCode);
         };
      })
   }
   return addyDB;
}
/**
 * 
 * @param {number} limit Amount of records to fetch (max 100)
 * @param {number} offset Lines from start to offset
 */
const getAddressQuery = (limit, offset) => {
   return `{
      normal: getAddresses(limit:"${limit}", offset: "${offset}", format: "raw"){
         address
         lat
         lng
         raw
      }
    }`
}

/**
 * Using GraphQL 
 * 
 * @param {string} query the query
 */
const postApi = async (query, filename = null) => {
   let result = await window.fetch(`http://localhost:8080/graphql`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
      },
      body: JSON.stringify({ query: query })
   }).catch(reason => {
      console.log(reason)
      return reason
   })
   let jsResult = await result.json().catch(reason => {
      console.log('json', reason)
      return reason
   })
   if (jsResult.errors) {
      console.log('errors getting', jsResult.errors)
      return jsResult.errors
   }
   if (filename)
      jsResult.org_name = filename.toLowerCase()
   return jsResult
}
