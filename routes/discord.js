var express = require('express');
var router = express.Router();
const { EmbedBuilder, WebhookClient } = require('discord.js');

const webHookClient = new WebhookClient({url: process.env.DISCORD_WEBHOOK});

router.post('/send-to-channel', function(req, res, next) {
  try{
    const embed = new EmbedBuilder()
      .setTitle(req.body.title)
      .setColor(req.body.color ?? "DarkGreen")
      .setURL(req.body.url ?? null)
      .setFooter(req.body.footer ? ({text: req.body.footer, iconURL: "https://cdn-icons-png.flaticon.com/512/4583/4583731.png"}) : null)
      .setDescription(req.body.content)
    
    webHookClient.send({
      embeds: [embed]
    });

    res.send("Enviado exitosamente");
  }catch (error){
    console.log(error);
    res.send(error);
  }
});

router.post('/send-dm', function(req, res, next) {
  var discord = req.app.get('discord');
  var user = discord.users.cache.find(u=>{
    return u.tag === req.body.tag;
  });
  
  if(user){
    user.send(req.body.message ?? "Hola putito");
    res.send("Enviado");
  }else{
    res.send("User no encontrado");
  }
});

module.exports = router;