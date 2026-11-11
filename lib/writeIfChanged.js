import fs from 'node:fs/promises';

export async function writeIfChanged(file,text){
 try{if(await fs.readFile(file,'utf8')===text)return false}
 catch(error){if(error.code!=='ENOENT')throw error}
 await fs.writeFile(file,text);
 return true;
}
