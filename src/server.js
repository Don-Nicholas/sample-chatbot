const express =  require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoute = require('./routes/web');
const bodyParser = require('body-parser');
const dialogflow = require('dialogflow');
// Import the appropriate class
const { WebhookClient } = require('dialogflow-fulfillment');
require('dotenv').config();
let app = express();

 
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


//this code will get the intent triggered in dialogflow through json
app.post("/webhook", function(request, response) {
    //  Create an instance
    const _agent = new WebhookClient({request, response});

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function languageHandler(agent) {
        const language = agent.parameters.language;
        const programmingLanguage = agent.parameters['language-programming'];
        if (language) {
            agent.add(`From fulfillment: Wow! I didn't know you knew ${language}`);
        } else if (programmingLanguage) {
            agent.add(`From fulfillment: ${programmingLanguage} is cool`);
        } else {
            agent.add(`From fulfillment: What language do you know?`);
        }
    }

    let intents = new Map();

    intents.set('Default Welcome Intent', languageHandler);

    _agent.handleRequest(intents);

});

// app.post('/webhook', (request, response) => {
//     //Create an instance
//     const _agent = new WebhookClient({request, response});

//     function welcome(agent) {
//         agent.add(`Welcome to my agent!`);
//     }

//     function languageHandler(agent) {
//         const language = agent.parameters.language;
//         const programmingLanguage = agent.parameters['language-programming'];
//         if (language) {
//             agent.add(`From fulfillment: Wow! I didn't know you knew ${language}`);
//         } else if (programmingLanguage) {
//             agent.add(`From fulfillment: ${programmingLanguage} is cool`);
//         } else {
//             agent.add(`From fulfillment: What language do you know?`);
//         }
//     }

//     let intents = new Map();

//     intents.set('Default Welcome Intent', languageHandler);

//     _agent.handleRequest(intents);
// });

initWebRoute(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening to port '+port);
});
