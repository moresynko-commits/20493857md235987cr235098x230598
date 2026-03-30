module.exports = {
  name: 'playerlookup',
  description: 'ER:LC player lookup',
  options: [{ name: 'id', type: 3, required: true }],
  async execute(interaction) {
    const id = interaction.options.getString('id');
    // API call
    interaction.reply(`Player ${id} data from ER:LC`);
  }
};

