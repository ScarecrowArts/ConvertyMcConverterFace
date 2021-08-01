import https = require('https');
import fs = require('fs');

export function downloadFile(url: string, path: string): void {
    
    const file = fs.createWriteStream(path);
    const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    response.pipe(file);
    });

}