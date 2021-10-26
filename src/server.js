const express =  require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoute = require('./routes/web');
const bodyParser = require('body-parser');

require('dotenv').config();
let app = express();

 
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));


//         //this code will get the intent triggered in dialogflow through json
//         app.post("/webhook", function(request, response) {
//         // let _agent = new WebhookClient({request,response});
//         //const fulfillment = request.body.queryResult.fulfillmentText;
//         const fulfillment = request.body.queryResult.fulfillmentMessages[0].text.text[0];
//         const obj = {fulfillment};
//         console.log("json string is" + JSON.stringify(obj));
//         response.send(JSON.stringify(obj));

// });

// Import the appropriate class
const { WebhookClient } = require('dialogflow-fulfillment');

app.post('/webhook', (request, response) => {
    //Create an instance
    const _agent = new WebhookClient({request: request, response: response});

    function welcome(agent) {
        return agent.add(`Welcome to my agent!`);
      }

    let intents = new Map();

    intents.set('Default Welcome Intent', welcome);

    _agent.handleRequest(intents);
})

initWebRoute(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening to port '+port);
});
