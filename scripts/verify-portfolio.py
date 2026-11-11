"""Bounded source/link checks for the revised portfolio, not a browser audit."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
from collections import Counter
import subprocess,json,re,hashlib

root=Path(__file__).resolve().parents[1];public=root/'public'
projects=['andalus','nasaq','flex-academy','veyra','design-handoff','design-system-doctor','nexus','aevis','prepflow','promptilo','skinny','timer-gym','voicy']
files=[root/'index.html',public/'cv.html',public/'projects/index.html',public/'aeokiller/index.html',public/'research/index.html']
for project in projects:
    files.append(public/'projects'/project/('case-study-en.html' if project=='nasaq' else 'index.html'))
    files.append(public/'projects'/project/'study-protocol.html')
    study=public/'projects'/project/'study.html'
    if study.exists():files.append(study)
files.append(public/'projects/veyra/city.html')
files.append(public/'projects/nasaq/case-study.html')
class Page(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.refs=[];self.tags=[];self.main=False;self.snapshotInsideMain=None;self.missingAlt=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append((tag,a))
        if tag=='main':self.main=True
        if 'id'in a:self.ids.append(a['id'])
        if a.get('id')=='project-snapshot':self.snapshotInsideMain=self.main
        if tag=='img' and 'alt' not in a:self.missingAlt.append(a.get('src'))
        for attr in ('href','src'):
            if a.get(attr):self.refs.append((tag,a[attr]))
    def handle_endtag(self,tag):
        if tag=='main':self.main=False

issues=[];checked=0
for file in files:
    if not file.exists():issues.append({'file':str(file.relative_to(root)),'issue':'missing page'});continue
    page=Page();html=file.read_text();page.feed(html)
    duplicate=[i for i,n in Counter(page.ids).items() if n>1]
    if duplicate:issues.append({'file':str(file.relative_to(root)),'issue':'duplicate IDs','details':duplicate})
    if page.snapshotInsideMain is False:issues.append({'file':str(file.relative_to(root)),'issue':'project summary outside main'})
    if page.missingAlt:issues.append({'file':str(file.relative_to(root)),'issue':'images missing alt attributes','details':page.missingAlt[:5]})
    for tag,attrs in page.tags:
        for attribute in ('aria-labelledby','aria-describedby'):
            missing=[ref for ref in attrs.get(attribute,'').split() if ref not in page.ids]
            if missing:issues.append({'file':str(file.relative_to(root)),'issue':'missing static ARIA reference','attribute':attribute,'details':missing})
    if file.parent.name in projects and file.name=='index.html' and file.parent.name!='nasaq':
        positions=[html.find('id="review-evidence"'),html.find('id="reflection"'),html.find('class="review-next"')]
        if min(positions)<0 or positions!=sorted(positions):issues.append({'file':str(file.relative_to(root)),'issue':'case ending is out of reading order'})
    for tag,ref in page.refs:
        parsed=urlparse(ref)
        if parsed.scheme or ref.startswith('//') or not parsed.path:continue
        path=unquote(parsed.path)
        target=public/path.lstrip('/') if path.startswith('/') else file.parent/path
        if file==root/'index.html' and (path.startswith('/src/') or path in ['/style.css','/case.css','/classic-review-entry.css']):target=root/path.lstrip('/')
        if path=='/':target=root/'index.html'
        elif target.is_dir():target=target/'index.html'
        if not target.exists():issues.append({'file':str(file.relative_to(root)),'issue':'missing local target','target':ref})
        checked+=1
    if 'data:image/' in html and len(html.encode())>250000:issues.append({'file':str(file.relative_to(root)),'issue':'oversized embedded image page'})

home=(root/'index.html').read_text()
home_runtime=home+(root/'src/main.js').read_text()
resume_record=root/'docs/resume-verification.json'
if not resume_record.exists():issues.append({'file':'public/Ismail_Bettoumi_CV.pdf','issue':'missing resume verification record'})
else:
    resume=json.loads(resume_record.read_text())
    for label,path in [('sourceSha256',public/'cv.html'),('pdfSha256',public/'Ismail_Bettoumi_CV.pdf')]:
        if resume.get(label)!=hashlib.sha256(path.read_bytes()).hexdigest():issues.append({'file':str(path.relative_to(root)),'issue':'resume verification is stale; regenerate and review both formats'})
    if resume.get('visualReview')!='passed' or resume.get('textParity') is not True:issues.append({'file':'public/Ismail_Bettoumi_CV.pdf','issue':'resume text or visual verification is incomplete'})
for required in ['id="selected-work"','mailto:bettoumi001@gmail.com','id="contact"']:
    if required not in home_runtime:issues.append({'file':'index.html','issue':'missing homepage requirement','target':required})
if not any(entry in home for entry in ['/src/main.js','/src/portfolio.js']):issues.append({'file':'index.html','issue':'missing selected homepage entry'})
scripts=['public/projects/project-index.js','src/main.js','src/boardingGate.js','src/classicPortfolio.js','src/classicPreviews.js','src/portfolio.js','src/portfolioContent.js','src/caseReviewContent.js','src/reflectionContent.js','src/studyContent.js','src/flexVersionContent.js','src/flexStudyContent.js','src/andalusDeliveryContent.js','public/projects/case-navigation.js','public/projects/flex-events.js','public/projects/experience-lab.js','public/projects/prepflow-model.js','public/projects/prepflow-study.js','public/projects/promptilo-study.js','public/projects/voicy-study.js','public/projects/timer-study.js','public/projects/advanced-studies.js','public/projects/study-models.js','public/projects/veyra/city.js','public/research/notes.js','public/aeokiller/demo-fixtures.js','public/aeokiller/audit-context.js','public/aeokiller/data-origin.js','public/aeokiller/assets/index-HPfAPLMS.js']
for script in scripts:
    result=subprocess.run(['node','--check',str(root/script)],capture_output=True,text=True)
    if result.returncode:issues.append({'file':script,'issue':'JavaScript syntax error','details':result.stderr[:600]})

summary={'date':'2026-10-24','scope':'Static source, local link targets and JavaScript syntax. This does not certify runtime accessibility or user outcomes.','pages':len(files),'localReferencesChecked':checked,'scriptsSyntaxChecked':len(scripts),'issues':issues}
(root/'docs').mkdir(exist_ok=True)
(root/'docs/portfolio-verification.json').write_text(json.dumps(summary,indent=2))
print(json.dumps(summary,indent=2))
raise SystemExit(bool(issues))
