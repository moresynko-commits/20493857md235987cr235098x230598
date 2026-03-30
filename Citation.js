const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema({
  citationId: String,
  playerId: String,
  officerId: String,
  reason: String,
  status: String,
  timestamp: { type: Date, default: Date.now },
  guildId: String
});

module.exports = mongoose.model('Citation', citationSchema);
