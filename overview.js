module.exports = {
  name: 'overview',
  description: 'Server overview',
  async execute(interaction) {
    const embed = { title: 'MCRPX Overview', description: 'Server online, 247 players', color: 0x00ff00 };
    interaction.reply({ embeds: [embed] });
  }
};

