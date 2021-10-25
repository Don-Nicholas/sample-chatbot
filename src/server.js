const express =  require('express');
const viewEngine = require('./config/viewEngine');
const initWebRoute = require('./routes/web');
const bodyParser = require('body-parser');

require('dotenv').config();
let app = express();

viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

initWebRoute(app);



let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Listening to port '+port);
});
