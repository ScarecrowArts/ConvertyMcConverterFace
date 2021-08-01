import https = require('https');
import fs = require('fs');

export function downloadFile(url: string, path: string): void {
    
    const file = fs.createWriteStream(path);
    const request = https.get(url, function(response) {
        response.pipe(file);
    });

}