import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import fsa from 'fs/promises';
import axios from 'axios';
import querystring from 'querystring';
import { MongoClient } from 'mongodb';
//import Librespot from './index.mjs'

const app = express();
const port = 3000;
var r = makeid(6);
const userTokens = {};

app.use(bodyParser.json());
app.use(cors());
let state;

app.get('/whatsapp/:ts', async (req, res) => {
  try {
    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Sender</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    #whatsappForm {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 300px;
      text-align: center;
    }

    h1 {
      color: #007bff;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
    }

    input, textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 16px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div id="whatsappForm">
    <h1>WhatsApp Sender</h1>
    <form id="whatsappForm" action="/send-whatsapp" method="post">
      <label for="phoneNumber">Phone Number:</label>
      <input type="text" id="phoneNumber" name="phoneNumber" required>
      
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="4" required></textarea>
      
      <button type="button" onclick="submitForm()">Send Message</button>
    </form>
  </div>

  <script>
    function submitForm() {
      window.location.href = "https://site--idk--bv94drdfyzjr.code.run/wpp/get/" + ${String(req.params.ts)} + "?l=https://api.whatsapp.com/send/?phone=" + encodeURIComponent(document.getElementById('phoneNumber').value) + "&text=" + encodeURIComponent(document.getElementById('message').value) + "&type=phone_number&app_absent=0";
    }
  </script>
</body>
</html>
    `;

    res.send(htmlContent);
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/wpp/get/:ts', async (req, res) => {
  try {
    if(req.query.l)
    {
      
      urlStore[req.params.ts] = `${req.query.l}&text=${req.query.text}&type=phone_number&app_absent=0`;
      //urlStore[req.params.ts] = `${req.query.l}`;
      //res.send(ts);
      res.redirect(`https://site--idk--bv94drdfyzjr.code.run/whatsapp/${req.params.ts}`);
    }
    else{
      while (!urlStore[req.params.ts]) {
          await new Promise(resolve => setTimeout(resolve, 100)); // add a small delay to avoid busy-waiting
      }
      res.send(urlStore[req.params.ts]);
      delete urlStore[req.params.ts];
    }
 // res.send( );
  }
 catch (error) {
    console.error('Erro ao processar a solicitação:', error);
    res.status(500).send('Erro interno do servidor');
  }
});
