module.exports = {
  name: 'profile',
  description: 'View profile',
  options: [{ name: 'user', type: 6, required: false }],
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    interaction.reply(`Profile for ${user.username}`);
  }
};

