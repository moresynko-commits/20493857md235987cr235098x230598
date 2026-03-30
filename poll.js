module.exports = {
  name: 'poll',
  description: 'Create community poll',
  options: [{ name: 'question', type: 3, required: true }],
  async execute(interaction) {
    const question = interaction.options.getString('question');
    interaction.reply(`Poll: ${question} Yes/No`);
  }
};

