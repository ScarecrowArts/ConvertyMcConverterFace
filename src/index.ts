import * as Discord from 'discord.js'
import * as fs from 'fs';

const client = new Discord.Client();
const token = fs.readFileSync('token.txt', {encoding: 'utf-8'});
client.login(token);

client.on('message', (message) => {
    if (message.content.startsWith("converty"))

    if (message.attachments.size > 0) {
        console.log(message.attachments);
    }
});