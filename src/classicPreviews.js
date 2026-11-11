// Existing case artifacts, shown inside the original homepage timeline. A crop
// presents the artifact; its caption preserves the distinction between a saved
// reference and the portfolio's explanatory reconstruction.
export const classicPreviews = {
  andalus:{
    src:'/projects/andalus/wireframes-algeria-v7.webp',width:1536,height:1024,
    alt:'Reconstructed recovery wireframes showing a saved search, changed-fare review and return with trip details preserved.',
    caption:'Recovery wireframes · Case-study reconstruction',
  },
  "nasaq":{
    src:'/assets/previews/nasaq-icon-studio.png',width:1440,height:1000,
    alt:'Current Nasaq Icon Studio interface with a conversation, a six-icon SVG family, refinement actions and an editable reply area.',
    caption:'Icon Studio · Local conversation demo',
  },
  flex:{
    src:'/assets/flex/figma-desktop.webp',width:666,height:5000,
    alt:'Saved Flex Academy landing-page design showing the rental-business headline, supporting panel and webinar action.',
    caption:'Landing-page hierarchy · Saved desktop reference',
  },
};

export function classicPreviewFigure(id) {
  const preview=classicPreviews[id];
  if(!preview)return '';
  return `<figure class="classic-project-visual"><span class="classic-preview-frame classic-preview-${id}"><img src="${preview.src}" alt="${preview.alt}" width="${preview.width}" height="${preview.height}" loading="lazy" decoding="async"></span><figcaption>${preview.caption}</figcaption></figure>`;
}

export function attachClassicPreview(document,link,id) {
  if(!classicPreviews[id] || link.querySelector('.classic-project-visual'))return;
  const header=document.createElement('span');header.className='classic-case-heading';
  for(const node of [...link.children])if(!node.classList.contains('tl-dot'))header.append(node);
  link.append(header);link.insertAdjacentHTML('beforeend',classicPreviewFigure(id));
  link.classList.add('classic-case-preview');
  const title=link.querySelector('.case-title'),description=link.querySelector('.case-desc');
  title.id=`work-${id}-title`;description.id=`work-${id}-description`;
  link.setAttribute('aria-labelledby',`${title.id} ${description.id}`);
  const caption=link.querySelector('figcaption');caption.id=`work-${id}-preview-note`;
  link.setAttribute('aria-describedby',caption.id);
  link.querySelector('.classic-project-visual img').addEventListener('error',()=>{
    const frame=link.querySelector('.classic-preview-frame');
    frame.classList.add('is-unavailable');
    frame.replaceChildren(document.createTextNode('Preview unavailable: open the case study.'));
  });
}
