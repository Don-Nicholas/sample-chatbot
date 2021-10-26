const express =  require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoute = require('./routes/web');
const bodyParser = require('body-parser');

require('dotenv').config();
let app = express();

const { WebhookClient } = require('dialogflow-fulfillment');


 
viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

initWebRoute(app);


app.post('/webhook', (req, res) => {
     //Create an instance
    const agent = new WebhookClient({request: request, response: response});

    const Welcome = () => {
        agent.add("Welcome to my agent!");
    };

    let intents = new Map();
    agent.handleRequest(intents);

    intents.set("Default welcome intent ", Welcome);    
});


let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening to port '+port);
});
