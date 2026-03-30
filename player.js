const axios = require('axios');
const Log = require('./Log.js');

module.exports = {
  name: 'player',
  description: 'Get player info from PoliceRP API',
  options: [
    {
      name: 'robloxid',
      description: 'Roblox user ID',
      type: 3,
      required: true
    }
  ],
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({ content: 'Staff only!', ephemeral: true });
    }

    const robloxId = interaction.options.getString('robloxid');
    try {
      const response = await axios.get(`${process.env.API_BASE}/players/${robloxId}`, {
        headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
      });
      const player = response.data;

      await new Log({ type: 'player', action: 'lookup', userId: interaction.user.id, playerData: player, guildId: interaction.guild.id }).save();

      const embed = { title: player.name || 'Player', fields: [{ name: 'ID', value: player.id || 'N/A' }, { name: 'Status', value: player.status || 'Unknown' }] };
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'API error or player not found.', ephemeral: true });
    }
  }
};
