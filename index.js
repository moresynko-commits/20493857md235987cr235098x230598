require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const GUILD_ID = '1486885646256570469';
const VOICE_CHANNEL_ID = '1486886067834589206';
const VERIFY_CHANNEL_ID = '1486886670543486996';
const LOGISTICS_CHANNEL_ID = '1487848160859525156';
const UNVERIFIED_ROLE_ID = '1486920575187288224';

let lastVerifyMsgId = null;
let lastVoiceName = null;

client.once('ready', async () => {
    console.log(`${client.user.tag} logged in!`);
    
    // Start tasks
    setInterval(updateMemberCount, 10 * 60 * 1000); // 10 min
    setInterval(sendVerifyReminder, 24 * 60 * 60 * 1000); // 24h
    
    // Initial
    await sendVerifyReminder();
    await updateMemberCount();
});

async function updateMemberCount() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    await guild.members.fetch();

    const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!voiceChannel || !voiceChannel.isVoiceBased()) return;

    const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
    const newName = `Server Members: ${memberCount}`;

    console.log(`Member count: ${memberCount}, Current name: ${voiceChannel.name}`);

    if (voiceChannel.name !== newName) {
        try {
            await voiceChannel.setName(newName);
            
            const logisticsChannel = guild.channels.cache.get(LOGISTICS_CHANNEL_ID);
            if (logisticsChannel) {
                const oldNum = lastVoiceName ? lastVoiceName.split(': ')[1] || 'Unknown' : 'Unknown';
                const nextUpdateUnix = Math.floor((Date.now() + 10 * 60 * 1000) / 1000);
                const logMsg = `<t:${Math.floor(Date.now() / 1000)}:F>: The **Server-Members** voice channel located in the __Community Analytics__ Category has been updated from **${oldNum}** to **${memberCount}**. Another update is scheduled to occur at <t:${nextUpdateUnix}:F>.`;
                await logisticsChannel.send(logMsg);
            }
            lastVoiceName = newName;
        } catch (error) {
            console.error('Voice update error:', error);
        }
    }
}

async function sendVerifyReminder() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    const verifyChannel = guild.channels.cache.get(VERIFY_CHANNEL_ID);
    if (!verifyChannel) return;

    const unverifiedRole = guild.roles.cache.get(UNVERIFIED_ROLE_ID);
    if (!unverifiedRole) return;

    // Delete previous bot msg
    if (lastVerifyMsgId) {
        try {
            await verifyChannel.messages.delete(lastVerifyMsgId);
        } catch (error) {
            console.log('Delete old verify failed:', error.message);
        }
    }

    const msgContent = `${unverifiedRole}: Ensure that you click the **Verify with Bloxlink** green button listed above to access our Server Member Channels and Server Member Role, permitting you to partake in giveaways, and more server-activities!`;
    
    try {
        const msg = await verifyChannel.send(msgContent);
        lastVerifyMsgId = msg.id;

        const logisticsChannel = guild.channels.cache.get(LOGISTICS_CHANNEL_ID);
        if (logisticsChannel) {
            const nextTimeUnix = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000);
            const logMsg = `<t:${Math.floor(Date.now() / 1000)}:F>: A new verification reminder message has been sent in <#${VERIFY_CHANNEL_ID}>. All **Unverified Members** have been notified to **Verify with Bloxlink**. \n> A new message has been scheduled to send at <t:${nextTimeUnix}:F>.`;
            await logisticsChannel.send(logMsg);
        }
    } catch (error) {
        console.error('Verify send error:', error);
    }
}

client.login(process.env.BOT_TOKEN);

