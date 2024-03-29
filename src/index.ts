import * as Discord from 'discord.js'
import * as fs from 'fs';
import path = require('path');
import { downloadFile } from './file-download';
import {v4 as uuid} from 'uuid';
import * as ffmpeg from 'ffmpeg';

const client = new Discord.Client();
let token: string|undefined = process.env.TOKEN ?? process.env.token;
if (fs.existsSync('token.txt')) {
    token = fs.readFileSync('token.txt', {encoding: 'utf-8'});
}

client.login(token);

client.on('message', async (message) => {
    if (message.content.startsWith("converty") == false) {
        return;
    }

    if (message.attachments.size == 1) {
        const attachment = message.attachments.first();
        if (attachment == null) {
            return;
        }

        message.channel.send("Converting...");

        try {
            const tempName = uuid();
            const tempDirPath = "./tempInput";
            if (fs.existsSync(tempDirPath) == false) {
                fs.mkdirSync(tempDirPath, {recursive: true});
            }
            const tempFilePath = path.join(tempDirPath, tempName + path.extname(attachment.url));
            await downloadFile(attachment.url, tempFilePath);

            // Convert to webp
            const video = await new ffmpeg(tempFilePath)
            video.addCommand('-vcodec', 'libwebp');
            video.addCommand('-lossless', '1');

            const ext = path.extname(tempFilePath);
            if (ext == '.png' || ext == '.jpg' || ext == '.gif') {
                video.addCommand('-qscale', '100');
            } else {
                video.addCommand('-qscale', '75');
            }

            video.addCommand('-preset', 'default');
            video.addCommand('-loop', '0');
            video.setDisableAudio();
            video.addCommand('-vsync', '0');
            
            const finishedName = uuid();
            const finishedDirPath = "./tempOutput";
            if (fs.existsSync(finishedDirPath) == false) {
                fs.mkdirSync(finishedDirPath, {recursive: true});
            }
            const finishedFilePath = path.join(finishedDirPath, finishedName + '.webp');
            await video.save(finishedFilePath);

            if (fs.statSync(finishedFilePath).size > 8_000_000) {
                message.channel.send("uwu this file too fat and strong for me to send, it's over 8mb");
            } else {
                const message0 = message.channel.send("Here's your converted file(Discord preview doesn't load, open in browser): ", new Discord.MessageAttachment(finishedFilePath));
                const message1 = message.channel.send("DEATH TO GIF AND JPEG");
                await Promise.all([message0, message1]);
            }

            fs.unlinkSync(tempFilePath);
        } catch (ex) {
            console.log(ex);
            message.channel.send("I can't convert that file dummy, please try again <3");
        }
    }
});