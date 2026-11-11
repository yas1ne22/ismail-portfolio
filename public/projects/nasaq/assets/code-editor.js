/* Readable, inert code previews. Source is always escaped before highlighting. */
(function(root){
 'use strict';
 const sources=new WeakMap(),editors=new WeakMap();
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const voidTags=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
 function chunks(source){
  const parts=[];let i=0;
  while(i<source.length){
   if(source[i]!=='<'){let end=source.indexOf('<',i);if(end<0)end=source.length;parts.push(source.slice(i,end));i=end;continue;}
   if(source.startsWith('<!--',i)){const end=source.indexOf('-->',i+4);parts.push(source.slice(i,end<0?source.length:end+3));i=end<0?source.length:end+3;continue;}
   let end=i+1,quote='';
   for(;end<source.length;end++){const c=source[end];if(quote){if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='>'){end++;break;}}
   const tag=source.slice(i,end),name=tag.match(/^<([\w:-]+)/)?.[1]?.toLowerCase();
   if(['script','style','pre','textarea'].includes(name)){
    const close=new RegExp('</'+name+'\\s*>','ig');close.lastIndex=end;const match=close.exec(source);
    if(match){parts.push(source.slice(i,close.lastIndex));i=close.lastIndex;continue;}
   }
   parts.push(tag);i=end;
  }
  return parts;
 }
 function formatHTML(source){
  const parts=chunks(source.trim()),lines=[];let depth=0;
  for(let i=0;i<parts.length;i++){
   const part=parts[i];if(!part.trim())continue;
   const open=part.match(/^<([\w:-]+)(?:\s|>)/),close=/^<\//.test(part),name=open?.[1]?.toLowerCase();
   if(close)depth=Math.max(0,depth-1);
   // Keep short text elements together; preserve whitespace-sensitive bodies exactly.
   if(open&&!voidTags.has(name)&&!part.endsWith('/>')&&!new RegExp('</'+name+'\\s*>$','i').test(part)){
    if(parts[i+1]&&!parts[i+1].includes('<')&&new RegExp('^</'+name+'\\s*>$','i').test(parts[i+2]||'')){
     lines.push('  '.repeat(depth)+part+parts[i+1]+parts[i+2]);i+=2;continue;
    }
    lines.push('  '.repeat(depth)+part);depth++;continue;
   }
   lines.push('  '.repeat(depth)+part);
  }
  return lines.join('\n');
 }
 function language(source){
  const text=source.trim();
  if(/^</.test(text))return 'html';
  if(/^(?:npm |npx |pnpm |yarn |python |node |pip |curl )/m.test(text))return 'shell';
  if(/^[\[{]/.test(text)){try{JSON.parse(text);return 'json'}catch{}}
  if(/(?:^|\n)\s*(?:import |export |const |let |function |document\.|window\.)/.test(text))return 'javascript';
  if(/[{}]/.test(text)&&/:[^\n]+;/.test(text))return 'css';
  return 'text';
 }
 function format(source,lang=language(source)){
  if(lang==='html')return formatHTML(String(source));
  if(lang==='json'){try{return JSON.stringify(JSON.parse(source),null,2)}catch{}}
  return String(source).trim();
 }
 function highlight(source,lang){
  const pattern=lang==='html'?/<!--[\s\S]*?-->|<\/?[\w:-]+|\/?>|[\w:@.-]+(?=\s*=)|"[^"]*"|'[^']*'|=/g:/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|import|from|export|new|if|else|true|false|null|async|await)\b|--[\w-]+|#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|ms|s|%)?\b/g;
  let result='',end=0;
  for(const match of source.matchAll(pattern)){
   const token=match[0];let kind='punctuation';
   if(/^(?:<!--|\/\*|\/\/)/.test(token))kind='comment';
   else if(/^['"`]/.test(token))kind='string';
   else if(lang==='html')kind=/^<\/?[\w:-]/.test(token)?'tag':/^[\w:@.-]/.test(token)?'attribute':'punctuation';
   else kind=/^(?:\d|#)/.test(token)?'number':token.startsWith('--')?'attribute':'keyword';
   result+=esc(source.slice(end,match.index))+`<span class="code-${kind}">${esc(token)}</span>`;end=match.index+token.length;
  }
  return result+esc(source.slice(end));
 }
 const filenames={html:'example.html',css:'styles.css',javascript:'example.js',json:'tokens.json',shell:'Terminal',text:'Code'};
 function prepare(host,code){
  if(editors.has(code))return editors.get(code);
  const doc=host.ownerDocument,pre=code.parentElement;
  host.classList.add('nq-code-editor');host.setAttribute('data-code-editor','');host.dir='ltr';
  let button=host.querySelector('[data-copy-example],[data-copy],.nq-code-copy');
  if(!button){button=doc.createElement('button');button.type='button';button.setAttribute('data-copy','');button.textContent=doc.documentElement.lang==='ar'?'نسخ':'Copy';}
  button.classList.add('nq-code-copy');button.type='button';
  const header=doc.createElement('div');header.className='nq-code-header';
  const file=doc.createElement('span');file.className='nq-code-filename';header.append(file,button);
  const viewport=doc.createElement('div');viewport.className='nq-code-scroll';viewport.tabIndex=0;viewport.setAttribute('role','region');
  const gutter=doc.createElement('div');gutter.className='nq-code-gutter';gutter.setAttribute('aria-hidden','true');
  pre.tabIndex=-1;viewport.append(gutter,pre);host.replaceChildren(header,viewport);
  const info={host,file,button,viewport,gutter};editors.set(code,info);return info;
 }
 function update(code,source,lang){
  lang=lang||language(source);const formatted=format(source,lang),host=code.closest('[data-code-editor],.explore-code,.code-block');
  if(!host){code.textContent=formatted;return formatted;}
  const info=prepare(host,code);sources.set(code,formatted);info.host.dataset.codeLanguage=lang;
  info.file.textContent=info.host.dataset.filename||filenames[lang];info.viewport.setAttribute('aria-label',lang.toUpperCase()+' code');
  info.gutter.innerHTML=formatted.split('\n').map((_,i)=>`<span>${i+1}</span>`).join('');
  code.innerHTML=highlight(formatted,lang);if(info.button.hasAttribute('data-copy'))info.button.dataset.copy=formatted;
  return formatted;
 }
 function mount(scope=root.document){
  scope.querySelectorAll('.code-block,.explore-code').forEach(host=>{
   let code=host.querySelector('pre code');const pre=host.querySelector('pre');if(!pre)return;
   if(!code){code=host.ownerDocument.createElement('code');code.textContent=pre.textContent;pre.replaceChildren(code);}
   if(!editors.has(code))update(code,code.textContent,host.dataset.codeLanguage);
  });
 }
 root.NasaqCodeEditor={format,highlight,language,update,mount,read:code=>sources.get(code)||code.textContent};
})(globalThis);
