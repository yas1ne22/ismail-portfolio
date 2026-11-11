import path from 'node:path';

// Resolve URL paths only inside the intended static directory.
export function publicPath(directory,urlPath){
 let decoded;
 try{decoded=decodeURIComponent(urlPath)}catch{return null}
 if(decoded.includes('\0'))return null;
 const base=path.resolve(directory),target=path.resolve(base,decoded);
 const relative=path.relative(base,target);
 if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))return null;
 return target;
}
