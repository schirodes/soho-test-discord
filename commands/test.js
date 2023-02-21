const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('amirbot')
		.setDescription('Probando amir bot!'),
	async execute(interaction) {
		await interaction.reply('Hola soy Amir!');
	},
};