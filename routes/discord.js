var express = require('express');
var router = express.Router();
const { EmbedBuilder, WebhookClient } = require('discord.js');

const webHookClient = new WebhookClient({url: process.env.DISCORD_WEBHOOK});

router.post('/send-to-channel', function(req, res, next) {
  const embed = new EmbedBuilder()
    .setTitle("Probando");
  
  webHookClient.send({
    content: "Test Content",
    embeds: [embed]
  });

  res.send("Enviado exitosamente");
});

router.post('/send-dm', function(req, res, next) {
  var discord = req.app.get('discord');
  discord.users.cache.get("483007798238773258").send(req.body.message ?? "Hola putito");
  res.send("Enviado");
});

module.exports = router;