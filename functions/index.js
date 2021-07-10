const functions = require("firebase-functions");
const { Telegraf } = require('telegraf');
const express = require("express");
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

let config = require('../env.json');
const axios = require('axios');

if(Object.keys(functions.config()).length){
    config = functions.config();
}

const params = {
    access_key: config.service.apixu_key,
    query: ''
}

const bot = new Telegraf(config.service.telegram_key);

bot.start( (ctx) => { ctx.reply('Bienvenidos :D');});

bot.on('text', (ctx) => {
    let query = ctx.update.message.text;
    params['query'] = query;
    axios.get('http://api.weatherstack.com/current', {params})
    .then(response => {
        const apiResponse = response.data;
        console.log(response.data);
        ctx.reply(`Ciudad: ${apiResponse.location.name}, Estado: ${apiResponse.location.region}, Pais: ${apiResponse.location.country}`);
        ctx.reply(`La temperatura actual en ${apiResponse.location.name} es ${apiResponse.current.temperature}℃`);
    }).catch(error => {
        console.log(error);
    });
});


bot.launch();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
