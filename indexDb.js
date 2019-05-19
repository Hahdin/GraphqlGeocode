

const uploadAddresses = async () =>{

   if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      return;
   }
   //window.alert('okay')
}

/**
 * Call the API
 * @param {string} path API endpoint
 */
const fetchFromAPI = async (path) =>{
   try
   {
     let res = await window.fetch(path);
     return await res.json();
   }
   catch(e)
   {
     throw Error(e);
     return null;
   }
 }