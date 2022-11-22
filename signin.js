      /* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

      // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '1006167168710-oa4lmc9qmg27830sh1lh54conig3kacb.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyBGoOutLCJ-ptWUas05xoYgSOV9IRhVsrk';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById('authorize_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
       function gapiLoaded() {
        gapi.load('client', intializeGapiClient);
      }
      
      async function intializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('signout_button').style.visibility = 'visible';
        }
      }


      /**
       *  Sign in the user upon button click.
       */
       function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await openPage();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }


      /**
       * Print the names and majors of students in a sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
       
      async function test() {
        
        const userAction = async () => {
        const response = await fetch('https://people.googleapis.com/v1/people/me', {
        method: 'POST',
        body: myBody, // string or object
        headers: {
        'Content-Type': 'application/json'
    }
  });
  const myJson = await response.json(); //extract JSON from the http response
  // do something with myJson
}
      }
      **/
      async function openPage() {
        window.location = 'main.html';

};
