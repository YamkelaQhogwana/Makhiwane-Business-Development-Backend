const postmark = require("postmark");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const myemail = 'yamkela.qhogwana@gmail.com'; 
const mypassword = 'opvtoenlmdliyrip'; 

//Create the transporter
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myemail,
        pass: mypassword,
      },
 });

app.post("/send-email", (req,res)=>{
   const recipientEmail = req.body.recipient_email;
   const userInformation = req.body.userInformation;
   const { country, city, postalCode, address } = userInformation;
   const cartItems = req.body.cartItems;
   const total = req.body.total;
   const date = req.body.date;
   const invoiceNumber = req.body.invoiceNumber; 

   res.send("We got the data from our side")
})