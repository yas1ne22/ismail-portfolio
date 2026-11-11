"""Extract large embedded screenshots into cacheable, bounded WebP assets."""
from pathlib import Path
from PIL import Image
from io import BytesIO
import base64, hashlib, re, json

root=Path(__file__).resolve().parents[1]
records=[]
for folder in ['nexus','prepflow','promptilo','timer-gym','skinny','voicy']:
    file=root/'public/projects'/folder/'index.html'
    html=file.read_text()
    before=len(html.encode())
    assets=file.parent/'media'
    def extract(match):
        kind,payload=match.groups()
        if len(payload)<20000:return match.group(0)
        raw=base64.b64decode(payload)
        im=Image.open(BytesIO(raw))
        im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
        if im.mode not in ('RGB','RGBA'):im=im.convert('RGB')
        name='screen-'+hashlib.sha256(raw).hexdigest()[:12]+'.webp'
        assets.mkdir(exist_ok=True)
        im.save(assets/name,format='WEBP',quality=85,method=6)
        records.append({'project':folder,'asset':name,'originalBytes':len(raw),'outputBytes':(assets/name).stat().st_size,'width':im.width,'height':im.height})
        return './media/'+name
    html=re.sub(r'data:image/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)',extract,html)
    file.write_text(html)
    print(folder,before,'->',len(html.encode()),'HTML bytes')
out=root/'docs';out.mkdir(exist_ok=True)
(out/'image-optimization.json').write_text(json.dumps(records,indent=2))
