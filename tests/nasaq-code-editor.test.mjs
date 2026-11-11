import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const source=fs.readFileSync(new URL('../public/projects/nasaq/assets/code-editor.js',import.meta.url),'utf8');
function setup(){const {document}=parseHTML('<html lang="en"><body></body></html>');const context=vm.createContext({document});vm.runInContext(source,context);return {document,api:context.NasaqCodeEditor};}

test('HTML indentation preserves quoted angle brackets and whitespace-sensitive content',()=>{
 const {api}=setup();
 const html='<section><input value="a > b"><textarea>  my\n draft </textarea><pre> x\n y </pre><script>const html = "<div>";</script><button>Save</button></section>';
 const formatted=api.format(html,'html');
 assert.match(formatted,/\n  <input value="a > b">\n/);
 for(const text of ['<textarea>  my\n draft </textarea>','<pre> x\n y </pre>','<script>const html = "<div>";</script>'])assert.ok(formatted.includes(text));
 assert.match(formatted,/<button>Save<\/button>\n<\/section>$/);
});

test('highlighting displays source as inert text and never creates source HTML nodes',()=>{
 const {api,document}=setup();document.body.innerHTML='<div class="code-block"><button data-copy="">Copy HTML</button><pre><code></code></pre></div>';
 const code=document.querySelector('code'),text='<img src=x onerror="alert(1)"><script>alert(2)</script>';
 api.update(code,text,'html');
 assert.equal(code.querySelector('img,script'),null);assert.equal(code.textContent,api.format(text,'html'));
 assert.ok(code.querySelector('.code-tag'));assert.equal(api.read(code),code.textContent);
 assert.equal(document.querySelector('[data-copy]').dataset.copy,code.textContent);
});

test('mount is idempotent, numbers match source lines, and copy always uses displayed source',()=>{
 const {api,document}=setup();document.body.innerHTML='<div class="code-block"><button data-copy="">Copy</button><pre><code>&lt;section&gt;&lt;button&gt;Save&lt;/button&gt;&lt;/section&gt;</code></pre></div>';
 api.mount(document);api.mount(document);
 assert.equal(document.querySelectorAll('.nq-code-header').length,1);
 assert.equal(document.querySelectorAll('.nq-code-copy').length,1);
 const code=document.querySelector('code');assert.equal(document.querySelectorAll('.nq-code-gutter span').length,code.textContent.split('\n').length);
 api.update(code,'<p>Updated</p>','html');assert.equal(document.querySelector('[data-copy]').dataset.copy,'<p>Updated</p>');
 assert.equal(document.querySelector('.nq-code-filename').textContent,'example.html');
});
