"""Generate the downloadable resume from the canonical HTML CV text."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Table,TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader
import json,re,shutil,hashlib

root=Path(__file__).resolve().parents[1]
out=root/'public/Ismail_Bettoumi_CV.pdf'
backup=Path('/tmp/portfolio-fixes/baseline/Ismail_Bettoumi_CV.pdf')
backup.parent.mkdir(parents=True,exist_ok=True)
if out.exists() and not backup.exists():shutil.copy2(out,backup)
class CV(HTMLParser):
    def __init__(self):super().__init__();self.active=False;self.skip=0;self.capture=None;self.blocks=[];self.depth=0;self.current=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='main':self.active=True
        if not self.active:return
        if tag in ('aside','svg','script','style'):self.skip+=1
        if self.skip:return
        classes=a.get('class','').split()
        wanted=tag in ('h1','h2','h3','p','li') or (tag=='div' and any(c in classes for c in ['exp-header','cv-contact-line','edu-item','cert-item']))
        if self.capture:self.depth+=1
        elif wanted:self.capture=(tag,classes);self.depth=1;self.current=[]
    def handle_endtag(self,tag):
        if self.skip:
            if tag in ('aside','svg','script','style'):self.skip-=1
            return
        if self.capture:
            self.depth-=1
            if self.depth==0:
                text=' '.join(' '.join(self.current).split())
                if text:self.blocks.append((self.capture[0],self.capture[1],text))
                self.capture=None
        if tag=='main':self.active=False
    def handle_data(self,value):
        if self.active and not self.skip and self.capture:self.current.append(value)

cv_source=(root/'public/cv.html').read_text()
parser=CV();parser.feed(cv_source)
updated=re.search(r'<time datetime="(\d{4}-\d{2}-\d{2})">([^<]+)</time>',cv_source)
if not updated:raise RuntimeError('The canonical HTML resume needs a visible update date.')
def clean(text):return text.translate(str.maketrans({'’':"'",'‘':"'",'“':'"','”':'"','—':'-','–':'-','‑':'-','→':'','↗':'','•':'|'}))
ink=colors.HexColor('#172a23');muted=colors.HexColor('#42564a');accent=colors.HexColor('#254dd7')
styles={
 'h1':ParagraphStyle('Name',fontName='Helvetica-Bold',fontSize=22,leading=25,textColor=ink,spaceAfter=3),
 'role':ParagraphStyle('Role',fontName='Helvetica',fontSize=11,leading=14,textColor=muted,spaceAfter=5),
 'contact':ParagraphStyle('Contact',fontName='Helvetica',fontSize=9,leading=11,textColor=muted,spaceAfter=8),
 'h2':ParagraphStyle('Section',fontName='Helvetica-Bold',fontSize=10.2,leading=12,textColor=accent,spaceBefore=7,spaceAfter=4,keepWithNext=True),
 'h3':ParagraphStyle('Item',fontName='Helvetica-Bold',fontSize=9.7,leading=11.5,textColor=ink,spaceBefore=2,spaceAfter=2,keepWithNext=True),
 'body':ParagraphStyle('Body',fontName='Helvetica',fontSize=9.4,leading=11.5,textColor=ink,spaceAfter=3),
 'li':ParagraphStyle('Bullet',fontName='Helvetica',fontSize=9.3,leading=11.5,textColor=ink,leftIndent=10,firstLineIndent=-8,spaceAfter=2),
}
story=[]
education=[];certifications=[];column=None
for tag,classes,text in parser.blocks:
    if tag=='h2' and text=='Education':column=education
    if tag=='h2' and text=='Certifications':column=certifications
    text=clean(text)
    kind='role' if 'cv-role' in classes else 'contact' if 'cv-contact-line' in classes else 'h3' if 'exp-header' in classes else tag if tag in ('h1','h2','h3','li') else 'body'
    content=escape(text)
    for label,url in [('bettoumi001@gmail.com','mailto:bettoumi001@gmail.com'),('ismail-bettoumi.com','https://ismail-bettoumi.com'),('+974 7077 3838','tel:+97470773838')]:
        content=content.replace(label,f'<link href="{url}" color="#254dd7">{label}</link>')
    if kind=='li':content='- '+content
    if 'skill-item' in classes and ':' in content:
        label,rest=content.split(':',1);content=f'<b>{label}:</b>{rest}'
    (story if column is None else column).append(Paragraph(content,styles[kind]))
if education or certifications:
    qualifications=Table([[education,certifications]],colWidths=[(A4[0]-68)/2]*2)
    qualifications.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),15),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
    story.append(qualifications)
def footer(canvas,doc):
    canvas.saveState();canvas.setFont('Helvetica',8);canvas.setFillColor(muted)
    canvas.drawString(34,22,'Ismail Bettoumi  |  ismail-bettoumi.com  |  '+updated.group(2))
    canvas.drawRightString(A4[0]-34,22,str(doc.page));canvas.restoreState()
document=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=30,leftMargin=30,topMargin=20,bottomMargin=28,title='Ismail Bettoumi - Product Designer',author='Ismail Bettoumi')
document.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(out)
actual=re.sub(r'\s+',' ',' '.join(p.extract_text() for p in reader.pages)).strip()
missing=[clean(text) for _,_,text in parser.blocks if re.sub(r'\s+',' ',clean(text)).strip() not in actual]
if missing:raise RuntimeError('PDF text did not preserve CV blocks: '+repr(missing[:2]))
if updated.group(2) not in actual:raise RuntimeError('PDF footer did not preserve the HTML update date.')
(root/'docs').mkdir(exist_ok=True)
(root/'docs/resume-verification.json').write_text(json.dumps({'source':'public/cv.html','output':'public/Ismail_Bettoumi_CV.pdf','updated':updated.group(1),'pages':len(reader.pages),'preservedTextBlocks':len(parser.blocks),'textParity':True,'sourceSha256':hashlib.sha256(cv_source.encode()).hexdigest(),'pdfSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'visualReview':'pending'},indent=2))
print(f'Rendered resume: {len(reader.pages)} pages, {len(parser.blocks)} canonical text blocks preserved.')
