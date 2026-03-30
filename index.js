require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { AuthorizationCode } = require('discord-oauth2');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const oauth = new AuthorizationCode({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI || process.env.RENDER_EXTERNAL_URL + '/callback' || 'http://localhost:3000/callback'
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve website

// API routes
app.get('/api/user', async (req, res) => {
  const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const user = await oauth.getUser(token);
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/config', async (req, res) => {
  res.json({
    community: process.env.GUILD_NAME || 'Modern Colorado Roleplay',
    departments: process.env.DEPARTMENTS ? process.env.DEPARTMENTS.split(',') : [],
    staff: process.env.STAFF_LIST ? process.env.STAFF_LIST.split(',') : []
  });
});

app.post('/api/config', async (req, res) => {
  // Save to DB or env (placeholder)
  res.json({ success: true, data: req.body });
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenData = await oauth.tokenRequest({
      code,
      scope: 'identify guilds'
    });
    res.redirect(`/?token=${tokenData.access_token}`);
  } catch {
    res.redirect('/');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Dashboard on port ${port}`);
});

// Bot code (unchanged, abbreviate for space)
const GUILD_ID = process.env.GUILD_ID || '1486885646256570469';
// ... (all existing bot code: intents, ready, messageCreate, interactionCreate, functions ...)

client.login(process.env.BOT_TOKEN);

