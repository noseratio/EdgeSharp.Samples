/*
* There are 3 IPC options, developers can choose amongst the options.
* 1. Host object
* 2. HtttpClient - Ajax/XHR calls
* 3. Post message - this is not readily available out-of-the box - please see comments below.
*/

/*
 Using host object - 
 https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.addhostobjecttoscript?view=webview2-dotnet-1.0.864.35
*/
async function executeHostObject(url, request, callback, onErrorCallback) {
   try {

       let remObject = await window.chrome.webview.hostObjects.execute;
       let requestJson = null;
       if ( request !== null ){
           requestJson = JSON.stringify(request);
       }

       let result = await remObject.Send(url, requestJson);

       var jsonData = JSON.parse(result);
       handleSuccess(jsonData, callback);

   } catch (err) {
       handleError(err, onErrorCallback);
   }
}

/*
 Using post Message - 
 https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.webmessagereceived?view=webview2-dotnet-1.0.864.35
*/
function executePostMessage(url, request, callback, onErrorCallback) {
   let requestJson = null;
   if ( request !== null ){
       requestJson = JSON.stringify(request);
   }

   window.external.Execute(url, requestJson)
       .then(function (response) {
           var jsonData = JSON.parse(response);
           handleSuccess(jsonData, callback);
       })
       .catch(function (err) {
           handleError(err, onErrorCallback);
       });
}

/*
 Using Ajax/XHR - 
 https://en.wikipedia.org/wiki/XMLHttpRequest
 Axios is used here, but this can be replaced with any http client library.
*/
function executeHttpClient(url, request, callback, onErrorCallback) {
   if ( request !== null ){
       let requestJson = JSON.stringify(request);
       axios.post(url, requestJson)
       .then(response => {
           if (response.status == 200) {
               handleSuccess(response.data, callback);
           }
           else {
               handleError(response, onErrorCallback);
           }
       })
       .catch(error => {
           handleError(error, onErrorCallback);
       });
   } else {
       axios.get(url)
       .then(response => {
           if (response.status == 200) {
               handleSuccess(response.data, callback);
           }
           else {
               handleError(response, onErrorCallback);
           }
       })
       .catch(error => {
           handleError(error, onErrorCallback);
       });
   }
}

function handleSuccess(jsonResponse, callback) {
   if (typeof callback !== 'undefined' && callback !== null ) {
       callback(jsonResponse);
   }
}

function handleError(err, callback) {
   if (typeof callback !== 'undefined' && callback !== null ) {
       callback(err);
   }

   console.error(err);
}