import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {calculate,defaults,fields} from './model.js';
import {sliderBounds} from './sliders.js';
import {beltGeometry,beltDiagram} from './diagram.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
// Compile the UI body as well as testing the independent calculation module.
const appSource=fs.readFileSync('app.js','utf8');
new vm.Script(appSource.replace(/^import[^\n]+\n/gm,''),{filename:'app.js'});
for(const f of fields){const b=sliderBounds(f[0],f[3]);assert.equal(b.step,1);assert.ok(b.min>0&&b.min<=f[3]&&b.max>=f[3]);close(f[3]-b.min,Math.round(f[3]-b.min));}
assert.equal(sliderBounds('z',1.5),null);assert.equal(sliderBounds('P',NaN),null);
const extended=sliderBounds('n',10000);assert.ok(extended.max>=10000);
const fractional=sliderBounds('P',2.2);close(fractional.min,0.2);close(fractional.value+fractional.step,3.2);
// Geometry reacts visibly without rescaling ordinary edits.
const scene=beltGeometry(180,560,400),wider=beltGeometry(180,560,600),larger=beltGeometry(240,560,400);
close(scene.scale,wider.scale);close(scene.scale,larger.scale);
close(wider.distance/scene.distance,1.5);close(larger.r1/scene.r1,240/180);
close(scene.r2/scene.r1,560/180);
for(const dims of [[180,560,400],[560,180,400],[180,180,400],[1500,2000,3000]]){
 const g=beltGeometry(...dims);assert.ok(g.path&&!g.path.includes('NaN'));
 const ratio=(g.r2-g.r1)/g.distance,dy=Math.sqrt(1-ratio*ratio);
 // Radius and common tangent must be perpendicular.
 const v1=[-g.r1*ratio,-g.r1*dy],v2=[-g.r2*ratio,-g.r2*dy];
 const t=[g.distance+v2[0]-v1[0],v2[1]-v1[1]];
 close(v1[0]*t[0]+v1[1]*t[1],0);
 assert.ok(g.x1-g.r1>=0&&g.x2+g.r2<=760&&g.cy+Math.max(g.r1,g.r2)<=345);
}
assert.ok(beltGeometry(180,560,200).overlap);assert.equal(beltGeometry(180,560,100).path,null);
assert.equal(beltGeometry(NaN,560,400),null);assert.equal(beltGeometry(180,560,null),null);
assert.ok(beltDiagram(180,560,400,'design').note.includes('zadanou vzdálenost'));
assert.ok(beltDiagram(180,560,370,'final').note.includes('vypočtenou vzdálenost'));
const {r,invalid}=calculate(defaults);assert.deepEqual(invalid,[]);
// Independent cached workbook results for unchanged relations.
for(const [k,v] of Object.entries({Dm:0.4,Pw:2200,ns:11.666666666666666,dm:0.18,nb:1.9894367886486917,nbmin:119.3662073189215,Pj:2.64,i:1.8616845354606182,dp:335.10321638291128,W:1162.3892818282234,y:36100,as:370.0248517352195,vbelt:6.5973445725385655,F:333.46749981159024,Fu:666.93499962318049,M1:30.012074983043121,l1:5.7494396519239688,oldAlpha:141.32142857142856,oldGamma:19.339285714285722,oldLength:1962.0375,oldZ:2.136,oldM2:176,oldL2:15.43859649122807}))close(r[k],v);
close(r.Lcalc,2052.6392818282234);assert.equal(r.zmin,2);close(r.M2,r.M1*560/180);
// Inverse geometry must recover the selected length.
close(2*r.as+Math.PI*(560+180)/2+(560-180)**2/(4*r.as),2000);
const equal=calculate({...defaults,d:180,d2:180,L:1500}).r;close(equal.alpha,180);close(equal.gamma,0);close(equal.as,(1500-Math.PI*180)/2);close(equal.M1,equal.M2);
const exact=calculate({...defaults,d2:r.dp}).r;close(exact.vs,defaults.v);close(exact.error,0);
const power=calculate({...defaults,P:4.4}).r;close(power.zcalc,r.zcalc*2);close(power.M2,r.M2*2);close(power.vs,r.vs);assert.equal(power.zmin,3);
const impossible=calculate({...defaults,L:100}).r;assert.equal(impossible.as,null);assert.equal(impossible.alpha,null);
assert.equal(calculate({...defaults,n:0}).r.M1,null);assert.equal(calculate({...defaults,v:NaN}).r.dp,null);
assert.ok(calculate({...defaults,z:1.5}).invalid.includes('z'));
const smallDriven=calculate({...defaults,d:560,d2:180}).r;close(smallDriven.alpha,r.alpha);
for(const f of fields){const result=calculate({...defaults,[f[0]]:NaN});assert.ok(result.invalid.includes(f[0]));for(const v of Object.values(result.r))assert.ok(v===null||Number.isFinite(v));}
const source=JSON.parse(fs.readFileSync('source.json','utf8'));assert.equal(source.filter(c=>c.formula&&c.value==='#REF!').length,4);
for(const file of ['app.js','model.js','style.css','source.json','prurez.jpeg'])assert.ok(fs.existsSync(''+file));
console.log('PASS: source values, corrected geometry, changed inputs, inverse relations, invalid inputs and assets.');
console.log(JSON.stringify({speed:r.vs,length:r.Lcalc,center:r.as,wrap:r.alpha,belts:r.zmin,drivenTorque:r.M2,keyLength:r.l2}));
