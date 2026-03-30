// Polling function
async function checkSessions() {
  const players = await getERLCPlayers();
  if (players >= 10 && !sessionActive) {
const admins = guild.roles.cache.get('1486919822397804654').members;
    admins.forEach(async admin => {
      admin.send(`10+ players in-game. Start session? Reply 'yes'`);
    });
  }
  // Update voice channels, delete announce except link
}

// Add to client.on('messageCreate') for DM replies

