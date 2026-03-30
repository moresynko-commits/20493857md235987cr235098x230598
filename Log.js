const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: String,
  action: String,
  userId: String,
  playerData: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  guildId: String
});

const mongoose = require('mongoose');
module.exports = mongoose.model('Log', logSchema);
