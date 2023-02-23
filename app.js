const dotenv = require("dotenv");
dotenv.config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var discordRouter = require('./routes/discord');

var app = express();

//  ---- Discord Bot ----
const { Client, Events, Partials, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({ intents: 
  [GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMembers, 
  GatewayIntentBits.GuildEmojisAndStickers, 
  GatewayIntentBits.GuildIntegrations, 
  GatewayIntentBits.GuildWebhooks, 
  GatewayIntentBits.GuildInvites, 
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.GuildScheduledEvents,
],
partials:
[
  Partials.Channel,
  Partials.Message
] });

//Inspecciona, busca comandos y los agrega
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on(Events.MessageCreate, message => {
  if(message.author.id == "1077626705344208996") return; //Id del BotMir

  if(message.guildId){
    let respuesta = null;
    switch(message.content.toLowerCase()){
      case "que miras": respuesta="Bobo"; break;
      case "david": respuesta="Lider Backend con cara de boludo"; break;
      case "ignacio": respuesta="Lider TI que se ejercita mucho"; break;
      case "eduardo": respuesta="CTO que le gusta dar latigazos (y también recibir)"; break;
      case "matias": respuesta="Lider Arquitectura sociable que baila (sujeto raro en el mundo TI)"; break;
      case "santiago": respuesta="Lider DevOps fanatico de Derco y el fernet"; break;
      case "amir": respuesta="Lider QA, IA avanzada capaz de tener trabajo en el mundo real"; break;
      case "cristian": respuesta="Lider FullStack y equipo, amo y señor de Humantech"; break;
    }

    if(respuesta){
      message.reply(respuesta);
    }
  }
  else{
    message.reply({content: "Estoy de vacaciones"});
  }
});

//483007798238773258

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

app.set("discord", client);

// ---- End Discord Bot ----

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/discord', discordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
