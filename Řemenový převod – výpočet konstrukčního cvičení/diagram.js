const W=760,H=400,BASE_SCALE=0.48;
const n=v=>Number(v.toFixed(4));
const display=v=>new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:2}).format(v);

export function beltGeometry(d1,d2,a){
 if(![d1,d2,a].every(v=>Number.isFinite(v)&&v>0))return null;
 // Keep the same scale during normal edits, zooming out only to fit extremes.
 const scale=Math.min(BASE_SCALE,650/(a+(d1+d2)/2),280/Math.max(d1,d2));
 const r1=d1*scale/2,r2=d2*scale/2,distance=a*scale;
 const left=(W-(distance+r1+r2))/2;
 const x1=left+r1,x2=x1+distance,cy=205;
 const ratio=(r2-r1)/distance;
 const tangent=Math.abs(ratio)<1;
 const dy=tangent?Math.sqrt(1-ratio*ratio):null;
 const p1=tangent?[x1-r1*ratio,cy-r1*dy]:null;
 const p2=tangent?[x2-r2*ratio,cy-r2*dy]:null;
 const large2=ratio>=0?1:0,large1=ratio>=0?0:1;
 const path=tangent?`M${n(p1[0])} ${n(p1[1])} L${n(p2[0])} ${n(p2[1])} A${n(r2)} ${n(r2)} 0 ${large2} 1 ${n(p2[0])} ${n(2*cy-p2[1])} L${n(p1[0])} ${n(2*cy-p1[1])} A${n(r1)} ${n(r1)} 0 ${large1} 1 ${n(p1[0])} ${n(p1[1])}`:null;
 return {scale,r1,r2,distance,x1,x2,cy,path,tangent,overlap:a<(d1+d2)/2,zoomed:scale<BASE_SCALE-1e-8};
}

export function beltDiagram(d1,d2,a,mode){
 const g=beltGeometry(d1,d2,a);
 if(!g)return {markup:'<text x="380" y="200" text-anchor="middle" fill="#d2deea" font-size="18">Pro zobrazení schématu zadej platné rozměry.</text>',note:'Pro tuto geometrii není dostupná osová vzdálenost.'};
 const {x1,x2,cy,r1,r2}=g;
 const color=g.overlap?'#ffb0a1':'#56dfc8';
 const wheel=(x,r,id,fill)=>`<g data-wheel="${id}"><circle class="pulley" data-diameter="${id===1?d1:d2}" cx="${n(x)}" cy="${cy}" r="${n(r)}" fill="${fill}" stroke="${color}" stroke-width="2"/><g stroke="#7894ae" stroke-width="2"><path d="M${n(x-r*.7)} ${cy}H${n(x+r*.7)} M${n(x)} ${n(cy-r*.7)}V${n(cy+r*.7)}"/></g><circle cx="${n(x)}" cy="${cy}" r="${n(Math.max(3,Math.min(10,r*.2)))}" fill="#12253d" stroke="${color}" stroke-width="2"/><text x="${n(x)}" y="${n(cy-r-13)}" fill="#d6e5f2" text-anchor="middle" font-size="14">${id===1?'HNACÍ':'HNANÁ'}</text></g>`;
 const markup=`<title>Otevřený řemenový převod: průměry ${display(d1)} a ${display(d2)} mm, osová vzdálenost ${display(a)} mm.</title><g stroke="#486079" stroke-dasharray="5 5"><path d="M40 ${cy}H720 M${n(x1)} 48V350 M${n(x2)} 48V350"/></g><g stroke="#94b7d2" stroke-width="1.5"><path d="M${n(x1)} 44H${n(x2)} M${n(x1)} 36V52 M${n(x2)} 36V52"/></g><text x="380" y="26" text-anchor="middle" fill="#76e8d3" font-size="18">${mode==='design'?'a':'aₛ'} = ${display(a)} mm</text>${wheel(x1,r1,1,'#203d58')}${wheel(x2,r2,2,'#26384e')}${g.path?`<path id="belt-path" d="${g.path}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>`:''}<g fill="#e8f2fa" font-size="17"><text x="185" y="382" text-anchor="middle">d₁ = ${display(d1)} mm</text><text x="575" y="382" text-anchor="middle">d₂ = ${display(d2)} mm</text></g>`;
 const info=mode==='design'?'Schéma používá zadanou vzdálenost a. Pro konečnou vzdálenost ze zvolené délky řemene přepni na Lₙ.':'Schéma používá vypočtenou vzdálenost aₛ ze zvolené délky Lₙ. Předběžné a ji při pevné délce řemene nemění.';
 return {markup,note:`${info}${g.overlap?' Řemenice se překrývají; uprav rozměry.':''}${!g.tangent?' Společné vnější tečny nelze sestavit.':''}${g.zoomed?' Pohled je zmenšený, aby se všechny rozměry vešly.':' Měřítko zůstává při běžných změnách stejné.'}`};
}
