const LoaModel = mongoose.model('LOA', new mongoose.Schema({ userId: String, reason: String, start: Date, end: Date }));

module.exports = {
  name: 'loa',
  description: 'LOA management',
  subcommands: ['view', 'create'],
  async execute(interaction) {
    // View active LOAs from DB
    await interaction.reply('LOA panel');
  }
};
