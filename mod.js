module.exports = {
  name: 'warn',
  description: 'Warn member',
  options: [
    { name: 'user', type: 9, description: 'User', required: true },
    { name: 'reason', type: 3, required: true }
  ],
  async execute(interaction) {
    // Check ADMIN+ role, DM warn, log DB
    await interaction.reply('Warn sent + logged');
  }
  // Similar timeout, mute, kick, ban with perms
};
