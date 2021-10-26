const express =  require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoute = require('./routes/web');
const bodyParser = require('body-parser');

require('dotenv').config();
let app = express();

const { WebhookClient } = require('dialogflow-fulfillment');
const dialogflow = require('dialogflow');

 
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


        //this code will get the intent triggered in dialogflow through json
        app.post("/webhook", function(request, response) {
        // let _agent = new WebhookClient({request,response});
        //const fulfillment = request.body.queryResult.fulfillmentText;
        const fulfillment = request.body.queryResult.fulfillmentMessages[0].text.text[0];
        const obj = {fulfillment};
        console.log("json string is" + JSON.stringify(obj));
        response.send(JSON.stringify(obj));

});

initWebRoute(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening to port '+port);
});
