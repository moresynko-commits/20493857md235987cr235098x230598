const mongoose = require('mongoose');
// LOA model moved to models
const LoaModel = require('./models/Loa').LoaModel || null;

module.exports = {
  name: 'loa',
  description: 'LOA management',
  async execute(interaction) {
    interaction.reply('LOA view/create - DB integrated');
  }
};



module.exports = {
  name: 'loa',
  description: 'LOA management',
  subcommands: ['view', 'create'],
  async execute(interaction) {
    // View active LOAs from DB
    await interaction.reply('LOA panel');
  }
};
