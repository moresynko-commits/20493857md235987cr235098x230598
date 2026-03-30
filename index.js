require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DIRECTOR_ROLE_ID = '1486887218072125533';
const GUILD_ID = process.env.GUILD_ID || '1486885646256570469';
const VOICE_CHANNEL_ID = '1486886067834589206';
const VERIFY_CHANNEL_ID = '1486886670543486996';
const LOGISTICS_CHANNEL_ID = '1487848160859525156';
const UNVERIFIED_ROLE_ID = '1486920575187288224';
let lastVoiceName = null;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/user', (req, res) => res.json({ id: '123', username: 'Staff', roles: [] }));
app.get('/api/config', (req, res) => res.json({ community: 'Modern Colorado Roleplay', departments: [], staff: [] }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on ${port}`));

client.commands = new Collection();

client.once('ready', async () => {
    console.log(`${client.user.tag} logged in!`);
    client.user.setActivity('Modern Colorado | dsc.gg/MDCRX', { type: 'PLAYING' });
    
    if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    }
    
    const commandsPath = path.join(__dirname, '.');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && !file.startsWith('index') && !file.endsWith('deploy-commands.js'));
    for (const file of commandFiles) {
        const command = require(`./${file}`);
        if (command.name) client.commands.set(command.name, command);
    }
    console.log(`Loaded ${client.commands.size} commands`);
    
    if (process.env.GUILD_ID) {
        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        const slashCommands = Array.from(client.commands.values()).map(cmd => ({
            name: cmd.name,
            description: cmd.description || 'Command',
            options: cmd.options || []
        }));
        await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), { body: slashCommands });
        console.log('Slash deployed');
    }
    
    setInterval(updateMemberCount, 600000);
    setInterval(sendVerifyReminder, 86400000);
    await sendVerifyReminder();
    await updateMemberCount();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === 'apply') {
        await message.reply('**Applications**: https://forms.gle/yourform | Status in pins. <@&1486887218072125533>');
        return;
    }
    
    if (message.content.startsWith('!say ')) {
        if (!message.member.roles.cache.has(DIRECTOR_ROLE_ID)) return message.reply('Director Team only!');
        const text = message.content.slice(5).trim();
        if (!text) return message.reply('No message');
        await message.channel.send(text).catch(() => message.reply('Send failed'));
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'Error!', ephemeral: true });
    }
});

async function updateMemberCount() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;
    await guild.members.fetch();
    const voice = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!voice) return;
    const count = guild.memberCount - guild.members.cache.filter(m => m.user.bot).size;
    const newName = `Server Members: ${count}`;
    if (voice.name !== newName) {
        await voice.setName(newName);
        const logChan = guild.channels.cache.get(LOGISTICS_CHANNEL_ID);
        if (logChan) logChan.send(`Members updated to ${count}`);
        lastVoiceName = newName;
    }
}

async function sendVerifyReminder() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;
    const chan = guild.channels.cache.get(VERIFY_CHANNEL_ID);
    if (!chan) return;
    const role = guild.roles.cache.get(UNVERIFIED_ROLE_ID);
    if (!role) return;
    chan.send(`${role} Verify with Bloxlink button above!`);
}

client.login(process.env.BOT_TOKEN);
