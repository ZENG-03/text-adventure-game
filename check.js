const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const jsonStr = html.split('<script type=\"application/json\" id=\"scene-data\">')[1].split('</script>')[0].trim();
try {
    JSON.parse(jsonStr);
    console.log('JSON IS VALID!');
} catch(e) {
    const errorMatch = /position (\d+)/.exec(e.message);
    if(errorMatch) {
         let pos = parseInt(errorMatch[1]);
         console.error('JSON ERROR near position', pos, ' => ', jsonStr.slice(pos - 50, pos + 50));
    } else {
         console.error('JSON ERROR:', e.message);
    }
}