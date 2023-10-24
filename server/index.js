// Require:
var postmark = require("postmark");
const express = require("express");
const app =express();
const cors = require("cors");
const port = 5000;
var bodyParser = require('body-parser');
var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");

app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use("/send-email", (req,res)=>{
  client.sendEmail({
  "From": "ncby9zfs7@vossie.net",
  "To": "ncby9zfs7@vossie.net",
  "Subject": "Hello from Postmark",
  "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
  "TextBody": "Hello from Postmark!",
  "MessageStream": "notifications-1"
});

res.send("Hello")
})




