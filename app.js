// =================================================================
// ============== BOT WHATSAPP GEMINI + STICKER MAKER ==============
// =================================================================

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const fs = require('fs');
const Jimp = require('jimp');


const GREETED_USERS_FILE = './greeted_users.json';
let greetedUsers = new Set();

try {
    const data = fs.readFileSync(GREETED_USERS_FILE, 'utf8');
    if (data) {
        const userArray = JSON.parse(data);
        greetedUsers = new Set(userArray);
        console.log(`Berhasil memuat ${greetedUsers.size} pengguna yang sudah disapa.`);
    } else {
        console.log('File daftar pengguna kosong, memulai dengan daftar baru.');
    }
} catch (err) {
    if (err.code === 'ENOENT') {
        console.log('File greeted_users.json tidak ditemukan. Akan dibuat file baru.');
    } else {
        console.error('Gagal memuat daftar pengguna:', err.message);
    }
}


const client = new Client({
    authStrategy: new LocalAuth()
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("Mempersiapkan bot...");


client.on('qr', (qr) => {
    console.log('QR Code diterima, silakan scan dengan ponsel Anda:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot WhatsApp sudah siap dan terhubung!');
});

client.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        const userMessage = message.body || "";
        const chatId = message.from;


        if (!greetedUsers.has(chatId) && !chat.isGroup) {
            greetedUsers.add(chatId);
            console.log(`Pengguna baru pribadi terdeteksi [${chatId}]. Mengirim pesan selamat datang.`);
            const welcomeMessage = `🎉 *Selamat Datang di Nas AI!* 🎉
Halo! Saya adalah bot OPEN AI yang siap membantu Anda menjawab berbagai pertanyaan.

Cukup ketik perintah dengan format:
*.ai [pertanyaan Anda]*
*.stiker*

Contoh:
*.ai Siapa penemu bola lampu?*
*kirim sebuah gambar/foto lalu di caaption tambahkan .stiker*

Silakan ajukan pertanyaan pertama Anda!`;

            await client.sendMessage(chatId, welcomeMessage);
            fs.writeFileSync(GREETED_USERS_FILE, JSON.stringify([...greetedUsers]));
            console.log(`Pesan selamat datang terkirim dan pengguna [${chatId}] disimpan.`);
        }

        
        const stickerPrefix = '.stiker';
        if (message.hasMedia && userMessage.startsWith(stickerPrefix)) {
            console.log(`Menerima perintah stiker dari [${chatId}]`);
            const media = await message.downloadMedia();

            if (media.mimetype.startsWith('image/')) {
                const text = userMessage.substring(stickerPrefix.length).trim();
                let imageBuffer;

                const image = await Jimp.read(Buffer.from(media.data, 'base64'));

                if (text) {
                    console.log(`Menambahkan teks "${text}" ke stiker.`);
                    
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                    
                    
                    image.print(
                        font,
                        0, 
                        0, 
                        {
                            text: text.toUpperCase(), 
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
                        },
                        image.getWidth(), 
                        image.getHeight() - 15 
                    );

                    imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
                } else {
                    console.log('Membuat stiker biasa tanpa teks.');
                    imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
                }

                const finalMedia = new MessageMedia('image/png', imageBuffer.toString('base64'));
                await message.reply(finalMedia, undefined, {
                    sendMediaAsSticker: true,
                    stickerName: 'Dibuat oleh Nas AI',
                    stickerAuthor: 'github.com/nasanos'
                });
                console.log(`Stiker berhasil dikirim ke [${chatId}]`);
            } else {
                await message.reply('Maaf, hanya bisa membuat stiker dari file gambar.');
            }
            return; 
        }

        const aiPrefix = '.ai';
        if (userMessage.startsWith(aiPrefix)) {
            const question = userMessage.substring(aiPrefix.length).trim();
            if (question) {
                await chat.sendStateTyping();
                const result = await model.generateContent(question);
                message.reply(result.response.text());
                console.log(`Jawaban .ai dikirim ke [${chatId}]`);
            } else {
                message.reply('Silakan tulis pertanyaan Anda setelah `.ai`');
            }
        }

    } catch (e) {
        console.error('!!! TERJADI ERROR FATAL DI DALAM MESSAGE HANDLER:', e);
    }
});

client.initialize();