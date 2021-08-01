import * as Discord from 'discord.js'
import * as fs from 'fs';
import path = require('path');
import { downloadFile } from './file-download';
import {v4 as uuid} from 'uuid';
import * as ffmpeg from 'ffmpeg';

const client = new Discord.Client();
const token = fs.readFileSync('token.txt', {encoding: 'utf-8'});
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

        message.channel.send("I'm starting to convert your file");

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

            message.channel.send("Here's your converted file: ", new Discord.MessageAttachment(finishedFilePath));

            fs.unlinkSync(tempFilePath);
        } catch (ex) {
            console.log(ex);
        }
    }
});