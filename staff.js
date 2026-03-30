const axios = require('axios');
const Log = require('./Log.js');

module.exports = {
  name: 'staff',
  description: 'Staff management',
  options: [
    {
      name: 'action',
      description: 'list|promote|demote',
      type: 3,
      required: true
    }
  ],
  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: 'Staff+ only!', ephemeral: true });
    }

    const action = interaction.options.getString('action');
    try {
      // API e.g. /staff
      const response = await axios.get(`${process.env.API_BASE}/staff`, {
        headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
      });
      await new Log({ type: 'staff', action, userId: interaction.user.id, guildId: interaction.guild.id }).save();
      await interaction.reply({ content: `Staff ${action} (API data: ${JSON.stringify(response.data.slice(0,3))})`, ephemeral: true });
    } catch {
      await interaction.reply({ content: `Staff ${action} logged. Expand API.`, ephemeral: true });
      await new Log({ type: 'staff', action, userId: interaction.user.id }).save();
    }
  }
};
