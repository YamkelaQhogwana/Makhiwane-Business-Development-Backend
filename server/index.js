// Require:
var postmark = require("postmark");
const express = require("express");
const app =express();
const port = 5000;


app.listen((5000, (req,res)=>{
  console.log("The server has started")
}))

app.get("/",(req,res)=>{
  "Hello"
})

app.post("/send-email",(req,res)=>{
  var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");

client.sendEmail({
  "From": "ncby9zfs7@vossie.net",
  "To": "ncby9zfs7@vossie.net",
  "Subject": "Hello from Postmark",
  "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
  "TextBody": "Hello from Postmark!",
  "MessageStream": "notifications-1"
});

})
// Send an email:

