const fs=require('fs');const path=require('path');
const p=path.join(process.env.APPDATA, 'Code', 'User', 'History');
const dirs=fs.readdirSync(p);
let t=Date.now();
for(let d of dirs){
  let dp=path.join(p,d);
  if(fs.statSync(dp).isDirectory()) {
     if(t - fs.statSync(dp).mtimeMs < 48*3600*1000) {
        for(let f of fs.readdirSync(dp)){
           let fp=path.join(dp,f);
           if(fs.statSync(fp).isFile() && f.endsWith('.json')) continue;
           let txt = '';
           try { txt=fs.readFileSync(fp,'utf8'); } catch(e){}
           if(txt.includes('scene-data') && txt.includes('final_chamber_test') && txt.includes('updateInventoryDisplay')) {
              console.log('FOUND:', fp, fs.statSync(fp).mtimeMs, txt.length);
           }
        }
     }
  }
}