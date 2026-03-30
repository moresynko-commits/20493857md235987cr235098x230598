module.exports = {
  name: 'erlc',
  description: 'ER:LC server management',
  options: [
    { name: 'subcommand', type: 1, description: 'player|info|logs', required: true },
    { name: 'id', type: 3, description: 'Roblox ID or callsign', required: false }
  ],
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    // API calls...
    await interaction.reply(`ER:LC ${sub} executed`);
  }
};
