import https = require('https');
import fs = require('fs');

export function downloadFile(url: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path);
        const request = https.get(url, function(response) {
            response.pipe(file);
            response.on('end', () => {
                resolve();
            })
        });
    });
}