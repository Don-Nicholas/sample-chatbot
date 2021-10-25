require('dotenv').config();
const request = require('request');

let postWebhook = (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    
    
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
    
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

};

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
};

// Handles messages events
// function handleMessage(sender_psid, received_message) {
//   let response;
  
//   // Checks if the message contains text
//   if (received_message.text) {    
//     // Create the payload for a basic text message, which
//     // will be added to the body of our request to the Send API
//     response = {
//       "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
//     }
//   } else if (received_message.attachments) {
//     // Get the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
//     response = {
//       "attachment": {
//         "type": "template",
//         "payload": {
//           "template_type": "generic",
//           "elements": [{
//             "title": "Is this the right picture?",
//             "subtitle": "Tap a button to answer.",
//             "image_url": attachment_url,
//             "buttons": [
//               {
//                 "type": "postback",
//                 "title": "Yes!",
//                 "payload": "yes",
//               },
//               {
//                 "type": "postback",
//                 "title": "No!",
//                 "payload": "no",
//               }
//             ],
//           }]
//         }
//       }
//     }
//   } 
  
//   // Send the response message
//   callSendAPI(sender_psid, response);    
// };

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": {"text":response}
    }
  
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": process.env.FB_PAGE_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!');
        console.log("my message sent."+response+" (bot bot)");
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
}

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

function handleMessage(sender_psid, message) {
  let entitiesArr = ['greetings', 'thanks', 'bye'];
  let entityChosen = "";

  entitiesArr.forEach((name) => {
    // let entity = firstTrait(message.nlp, name);
    // if(entity && entity.confidence > 0.8) {
    //   callSendAPI(sender_psid, entity+', '+name);
    //   entityChosen = name;
    // }

    callSendAPI(sender_psid, name);
  });

  if(entityChosen === "") {
    // default
    callSendAPI(sender_psid, 'Bot bot is ongoing for the development! update' + entityChosen);
  }
  else {
    if(entityChosen === "greetings") {
      // send greetins message
      callSendAPI(sender_psid, 'Hi there! This is bot bot.');
    }

    if(entityChosen === "thanks") {
      callSendAPI(sender_psid, 'Thanks for believing bot bot!');
    }

    if(entityChosen === "bye") {
      callSendAPI(sender_psid, 'Bye, bot bot is looking forward chatting you!');
    }
  }
};

// function handleMessage(sender_psid, message) {
//   // check greeting is here and is confident
//   const greeting = firstTrait(message.nlp, 'wit$greetings');
//   if (greeting && greeting.confidence > 0.8) {
//     callSendAPI(sender_psid, 'Hi there!');
//   } else { 
//     callSendAPI(sender_psid, 'Default!');
//   }
// }

module.exports = {
    postWebhook : postWebhook,
    getWebhook : getWebhook
}

// curl -X GET "localhost:8080/webhook?hub.verify_token=itsjustasampleverifytoken1234&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"