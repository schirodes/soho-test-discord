const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('amirbot')
		.setDescription('Probando amir bot!')
		.addStringOption(option =>
			option
				.setName("texto")
				.setDescription("Texto a replicar")
				.setRequired(false)
		),
	async execute(interaction) {
		const texto = interaction.options.getString("texto") ?? null;
		await interaction.reply(`Hola soy Amir!${texto ? (" Tu texto es: "+texto) : ""}`);
	},
};