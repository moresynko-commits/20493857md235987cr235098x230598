require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const GUILD_ID = '1486885646256570469';
const DIRECTOR_ROLE_ID = '1486887218072125533';
const VOICE_CHANNEL_ID = '1486886067834589206';
const VERIFY_CHANNEL_ID = '1486886670543486996';
const LOGISTICS_CHANNEL_ID = '1487848160859525156';
const UNVERIFIED_ROLE_ID = '1486920575187288224';

let lastVoiceName = null;

const sayCommand = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message as the bot.')
    .addChannelOption(option => 
        option.setName('channel')
            .setDescription('Target channel')
            .setRequired(false)
    )
    .addIntegerOption(option => 
        option.setName('delay')
            .setDescription('Delay seconds')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(3600)
    )
    .addStringOption(option => 
        option.setName('text')
            .setDescription('Message')
            .setRequired(true)
            .setMaxLength(2000)
    );

client.once('clientReady', async () => {
    console.log(`${client.user.tag} logged in!`);
    
    const guild = client.guilds.cache.get(GUILD_ID);
    if (guild) {
        try {
            await guild.commands.create(sayCommand);
            console.log('/say registered');
        } catch (err) {
            console.log('Slash register error:', err.message);
        }
    }
    
    setInterval(updateMemberCount, 10 * 60 * 1000);
    setInterval(sendVerifyReminder, 24 * 60 * 60 * 1000);
    
    await sendVerifyReminder();
    await updateMemberCount();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'say') return;

    if (!interaction.member.roles.cache.has(DIRECTOR_ROLE_ID)) {
        return interaction.reply({ content: 'You must be in the **Director Team** in order to use the command (/say).', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const delay = interaction.options.getInteger('delay') || 0;
    const text = interaction.options.getString('text');

    await interaction.reply({ content: `✅ ${delay ? `Sends in ${delay}s.` : 'Sent.'}`, ephemeral: true });

    if (delay === 0) {
        return channel.send(text);
    }
    setTimeout(() => channel.send(text).catch(console.error), delay * 1000);
});

client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith('!say ')) return;
    if (!message.member.roles.cache.has(DIRECTOR_ROLE_ID)) {
        return message.reply('You must be in the **Director Team** in order to use the command (!say).');
    }

    const text = message.content.slice(5).trim();
    if (!text) return message.reply('❌ Provide a message.');

    message.channel.send(text).catch(console.error);
});

async function updateMemberCount() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    await guild.members.fetch();

    const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!voiceChannel || !voiceChannel.isVoiceBased()) return;

    const memberCount = guild.members.cache.filter(m => !m.user.bot).size;
    const newName = `Server Members: ${memberCount}`;

    console.log(`Member count: ${memberCount}, Current: ${voiceChannel.name}`);

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

    try {
        const messages = await verifyChannel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(msg => msg.author.id === client.user.id);
        if (botMessages.size > 0) {
            for (const msg of botMessages.values()) {
                await msg.delete().catch(() => {});
            }
            console.log(`Deleted ${botMessages.size} prior bot msgs`);
        }
    } catch (error) {
        console.log('Delete prior verify failed:', error.message);
    }

    const msgContent = `${unverifiedRole}: Ensure that you click the **Verify with Bloxlink** green button listed above to access our Server Member Channels and Server Member Role, permitting you to partake in giveaways, and more server-activities!`;
    
    try {
        const msg = await verifyChannel.send(msgContent);

        const logisticsChannel = guild.channels.cache.get(LOGISTICS_CHANNEL_ID);
        if (logisticsChannel) {
            const nextTimeUnix = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000);
            const logMsg = `<t:${Math.floor(Date.now() / 1000)}:F>: A new verification reminder message has been sent in <#${VERIFY_CHANNEL_ID}>. All **Unverified Members** have been notified to **Verify with Bloxlink**. \n> A new message has been scheduled to send at <t:${nextTimeUnix}:F>.`;
            await logisticsChannel.send(logMsg);
        }
        console.log('New verify msg sent');
    } catch (error) {
        console.error('Verify send error:', error);
    }
}

client.login(process.env.BOT_TOKEN);

