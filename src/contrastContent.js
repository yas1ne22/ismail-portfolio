export function contrastRatio(a,b){
 const luminance=hex=>{
  const channels=hex.slice(1).match(/../g).map(channel=>parseInt(channel,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
 };
 const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);
 return (values[0]+.05)/(values[1]+.05);
}
const rule=(selector,property,expected)=>({selector,property,expected});
const whiteCard=rule('.lab-card','background','#ffffff');
export const contrastChecks=[
 {label:'Documented earlier action token',state:'Archived design-system reference',foreground:'#ffffff',background:'#5070fe',minimum:4.5,source:'Saved Flex Academy design-system document; live Figma usage is unverified.',rules:[]},
 {label:'Current action label',state:'Active / default; hover keeps the same colors',foreground:'#ffffff',background:'#254dd7',minimum:4.5,rules:[rule('.lab-button,.lab-option','color','#ffffff'),rule('.lab-button,.lab-option','background','#254dd7')]},
 {label:'Secondary action label',state:'Active / default',foreground:'#172a23',background:'#ffffff',minimum:4.5,rules:[rule('.lab-button.secondary','color','#172a23'),rule('.lab-button.secondary','background','#ffffff')]},
 {label:'Form error',state:'Invalid field feedback',foreground:'#982d22',background:'#ffffff',minimum:4.5,rules:[rule('.lab-error','color','#982d22'),whiteCard]},
 {label:'Input boundary',state:'Active / default',foreground:'#6f806b',background:'#ffffff',minimum:3,rules:[rule('.lab-field','border','#6f806b'),whiteCard]},
 {label:'Secondary action boundary',state:'Active / default',foreground:'#6f806b',background:'#ffffff',minimum:3,rules:[rule('.lab-button.secondary','border-color','#6f806b'),rule('.lab-button.secondary','background','#ffffff')]},
 {label:'Keyboard focus outline',state:'Focus-visible on the white form surface',foreground:'#254dd7',background:'#ffffff',minimum:3,rules:[rule('button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible','outline','#254dd7'),whiteCard]},
].map(check=>({...check,ratio:contrastRatio(check.foreground,check.background),meetsCriterion:contrastRatio(check.foreground,check.background)>=check.minimum}));

export function flexContrastRecord(){
 const old=contrastChecks[0],current=contrastChecks[1];
 return `<details class="review-quality"><summary>Color correction and source checks</summary><h3>A measurable color correction.</h3><p>The documented earlier white-on-blue action token measures ${old.ratio.toFixed(2)}:1. The current local journey study uses ${current.ratio.toFixed(2)}:1. The saved desktop composition remains an archived reference; this check does not establish that the live Figma file was updated.</p><div class="review-color-comparison"><figure><span style="background:${old.background};color:${old.foreground}" aria-label="Earlier white label on blue">Continue</span><figcaption>Earlier documented token · ${old.ratio.toFixed(2)}:1</figcaption></figure><figure><span style="background:${current.background};color:${current.foreground}">Continue</span><figcaption>Current local study · ${current.ratio.toFixed(2)}:1</figcaption></figure></div><dl class="review-color-checks">${contrastChecks.slice(1).map(check=>`<div><dt>${check.label}</dt><dd><strong>${check.ratio.toFixed(2)}:1</strong> · minimum ${check.minimum}:1<br>${check.state}</dd></div>`).join('')}</dl><p>Method: sRGB relative-luminance calculation against the current shared study stylesheet, checked on 20 October 2026. This covers the listed active text, boundary and focus states. It does not certify the complete portfolio, native controls, disabled states, all rendered backgrounds or assistive-technology behavior.</p><p><a href="/projects/contrast-record.json">Inspect the source-color record </a> · <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">W3C text-contrast guidance </a> · <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">W3C control-contrast guidance </a></p></details>`;
}
