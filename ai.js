module.exports = {
  name: 'ai',
  description: 'AI assistant',
  options: [{ name: 'query', type: 3, required: true }],
  async execute(interaction) {
    const query = interaction.options.getString('query');
    interaction.reply(`AI: Response to "${query}"`);
  }
};

