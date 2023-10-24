const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");




const port = process.env.PORT || 5000;

//original node-mailer

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");



app.use("/send-email",(req,res)=>{
  res.send("Hello");
  client.sendEmail({
  "From": "ncby9zfs7@vossie.net",
  "To": "ncby9zfs7@vossie.net",
  "Subject": "Hello from Postmark",
  "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
  "TextBody": "Hello from Postmark!",
  "MessageStream": "notifications-1"
});
})

app.get("/",(req,res)=>{
  res.send("Hello")
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
