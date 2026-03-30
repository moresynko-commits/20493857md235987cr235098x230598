const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const ADMIN_ROLE = '1486919822397804654';
const SHIFT_ROLE = '1486920578005995650';
const SESSION_CAT = '1486885909143224411';
const ANNOUNCE_CHAN = '1487871812879650906';
const LINK_MSG = '1487877913830228039';
const ERCLC_API = process.env.ERLC_API || 'https://api.emergency-response-liberty-county.com';

let sessionActive = false;
let sessionData = { starter: null, startTime: null, lastShutdown: null };

module.exports = {
  name: 'sessions',
  description: 'Session management panel (Admin+)',
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(ADMIN_ROLE)) {
      return interaction.reply({ content: 'Administration+ only!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('Session Management Panel')
      .setDescription(`Welcome ${interaction.member}, you are Administration+`)
      .setThumbnail('https://cdn.discordapp.com/attachments/1486940390081953944/1487874827942498506/MCRP-Session-Info.png')
      .setColor(sessionActive ? 'Green' : 'Red');

    if (!sessionActive) {
      embed.addFields({
        name: 'Session Status', value: 'Inactive 🔴',
        name: '', value: `Shutdown by ${sessionData.lastShutdown || 'N/A'}\nShutdown at <t:${Math.floor(Date.now()/1000)}:F>`
      });
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('session_vote').setLabel('Session Vote').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('session_start').setLabel('Start Session').setStyle(ButtonStyle.Success)
        );
      await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    } else {
      const playersIn = await getERLCPlayers();
      const queue = await getERLCQueue();
      const onShift = interaction.guild.members.cache.filter(m => m.roles.cache.has(SHIFT_ROLE)).size;
      
      embed.addFields({
        name: 'Session Status', value: 'Active 🟢',
        name: '', value: `Started by ${sessionData.starter}\nStarted at <t:${Math.floor(sessionData.startTime / 1000)}:F>\nPlayers: ${playersIn}/40\nQueue: ${queue}\nOn Shift: ${onShift}\nJoin: MDCRX`
      });
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('session_boost').setLabel('Boost Session').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('session_shutdown').setLabel('Shutdown').setStyle(ButtonStyle.Danger)
        );
      await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    }
  }
};

async function getERLCPlayers() {
  try {
    const res = await axios.get(`${ERCLC_API}/players`);
    return res.data.count || 0;
  } catch {
    return 0;
  }
}

async function getERLCQueue() {
  // Similar API call
  return 0;
}

// Button collector in ready event...

