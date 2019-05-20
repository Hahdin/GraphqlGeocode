

const debugtest = async () => {
   let db = promiseDb();
   try{
      let res = await db.open();
      if ('success' !== res) {
         return;
      }
      res = await db.getAddresses(0);
      console.log(res);
      let msg = '<div>'
      let el = document.getElementById('res');
      el.innerHTML = msg;
      res.forEach(addy =>{
         el.innerHTML += `<p>address: ${addy.address}, lat: ${addy.lat}, lng: ${addy.lng}, time: ${addy.time}</p> `
      })
      el.innerHTML += '</div>'

      /**
       * Write addresses from the source file to the indexDB storage

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
         // Use transaction oncomplete to make sure the objectStore creation is 
         // finished before adding data into it.
         res.data.normal.forEach(address => {
            let addy = {...address};
            addy.time = new Date().toISOString();
            promises.push(db.createAddress(addy))
         })
         queryGetAddress = getAddressQuery(100, start);
      }
      Promise.all(promises).then(pr =>{
         console.log(pr);
      }).catch(reason =>console.log(reason));
      */


   
      /**
       * Write a single test address to the IndexDB storage
       
      let addy = {
         address: '7127 Hunterwood rd',
         lat: 50.12,
         lng: -120.45,
         time: new Date().toISOString()
      };
      res = await db.createAddress(addy);
      if (res){
         console.log(res);
         document.getElementById('res').innerHTML += `<br/>${JSON.stringify(res)}`;
      }
      */

   }
   catch(e){
      console.log(e);
      document.getElementById('res').innerHTML += JSON.stringify(e);
   }
}

const promiseDb = () => {
   if (!window.indexedDB) 
   {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      return;
   }
   let addyDB = {};
   let datastore = null;

   addyDB.open = () => {
      return new Promise((resolve, reject) => {
         let request = indexedDB.open('Addresses', 1);

         request.onupgradeneeded = (e) => {
            let db = e.target.result;
            // Delete the old datastore.
            if (db.objectStoreNames.contains('addresses')) {
               db.deleteObjectStore('addresses');
            }
            // Create a new datastore.
            let store = db.createObjectStore('addresses', {
               keyPath: 'address'
            });
            resolve('upgrade');
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

const getAddressQuery = (limit, offset) => {
   return `{
      normal: getAddresses(limit:"${limit}", offset: "${offset}"){
         address
         lat
         lng
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


   // try {
   //    let res = await postApi(queryGetSize);
   //    //console.log(res.data.getSize)
   //    let lines = res.data.getSize;
   //    let start = 0

   //    while (start < lines) {
   //       start += 100;
   //       res = await postApi(queryGetAddress);
   //       // Use transaction oncomplete to make sure the objectStore creation is 
   //       // finished before adding data into it.
   //       res.data.normal.forEach(address => {
   //          var request = objectStore.add(address);
   //          request.onsuccess = (event) =>{
   //             // event.target.result === customer.ssn;
   //             console.log('added...', event.target.result);
   //          };
   //          request.onerror = (event) =>{
   //             window.alert(event.target.errorCode);
   //          }
   //       })
   //       queryGetAddress = getAddressQuery(100, start);
   //    }
