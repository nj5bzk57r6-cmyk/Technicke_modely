export const groups = [
['Požadavky pohonu',false,[
['D','Průměr bubnu D','mm',400,'C2','Průměr bubnu dopravníku, nikoli řemenice.'],
['v','Požadovaná rychlost pásu v','m/s',2.5,'C3','Požadavek na pohyb dopravního pásu.'],
['ig','Převod převodovky i₃,₄','–',3.15,'C4','Poměr otáček na vstupu a výstupu převodovky.'],
['a','Předběžná osová vzdálenost a','mm',400,'C5','Vzdálenost os řemenic pro první návrh délky.']]],
['Motor & provoz',false,[
['P','Jmenovitý výkon P','kW',2.2,'C7','Výkon motoru podle zadání nebo katalogu.'],
['n','Otáčky motoru n₁','min⁻¹',700,'C8','Otáčky hnací řemenice jsou shodné s motorem.'],
['Cp','Součinitel dynamičnosti Cₚ','–',1.2,'C6','Volba z tabulky podle rázu a provozu; původní hodnota 1,2.']]],
['Volby řemenového převodu',true,[
['d','Hnací řemenice d₁','mm',180,'C9','Volba konstruktéra; ověř minimální průměr pro průřez.'],
['d2','Hnaná řemenice d₂','mm',560,'C23','Původní volba 560 mm. Změna ovlivní skutečnou rychlost pásu.'],
['L','Zvolená délka řemene Lₙ','mm',2000,'C28','Normalizovaná výpočtová délka; ověř řadu výrobce.'],
['N0','Výkon jednoho řemene N₀','kW',2.88,'C10','Tabulka str. 634 není přiložena. Ověř pro zvolený průřez, průměr a otáčky.'],
['Ca','Součinitel opásání Cα','–',0.89,'C26','Tabulka str. 635 není přiložena. Po změně geometrie znovu ověř.'],
['CL','Součinitel délky Cₗ','–',1,'konstanta C32','V Excelu pevná hodnota 1. Zde ji lze upravit podle katalogu.'],
['z','Zvolený počet řemenů z','ks',2,'C33','Celé kladné číslo; musí být alespoň rovné zaokrouhlenému výpočtu.']]],
['Hřídele & pera',true,[
['shaft1','Průměr hnacího hřídele','mm',30,'C40','Zvolený rozměr. Výpočet zde hřídel pevnostně nenavrhuje.'],
['t1','Účinná výška pera t₁','mm',2.9,'C41','Hodnota převzatá z Excelu; ověř zatíženou výšku pro kontrolu otlačení.'],
['shaft2','Průměr hnaného hřídele','mm',50,'C45','Hřídel hnané řemenice na vstupu do převodovky.'],
['t2','Účinná výška pera t₂','mm',3.8,'C46','Hodnota převzatá z Excelu, stejná interpretace jako u t₁.'],
['p','Dovolený tlak pD','MPa',120,'konstanta C42/C47','V Excelu pevná hodnota 120 MPa. Ověř podle materiálu a provozu.'],
['kF','Odhad zatížení ložisek kF','–',2,'konstanta C37','Školní zjednodušení Fu = kF · F. Nenahrazuje výpočet předpětí.']]]
];
export const fields=groups.flatMap(g=>g[2]);
export const defaults=Object.fromEntries(fields.map(f=>[f[0],f[3]]));
export function validate(s){return fields.filter(f=>!Number.isFinite(s[f[0]])||s[f[0]]<=0||(f[0]==='z'&&!Number.isInteger(s.z))).map(f=>f[0]);}
export function calculate(s){
 const invalid=validate(s),x={...s};for(const k of invalid)x[k]=NaN;
 const r={};
 r.Dm=x.D/1000;r.Pw=x.P*1000;r.ns=x.n/60;r.dm=x.d/1000;
 r.nb=x.v/(Math.PI*r.Dm);r.nbmin=r.nb*60;r.Pj=x.P*x.Cp;r.i=x.n/(r.nbmin*x.ig);r.dp=r.i*x.d;
 r.is=x.d2/x.d;r.n2=x.n/r.is;r.nbs=r.n2/x.ig;r.vs=Math.PI*r.Dm*r.nbs/60;r.error=(r.vs/x.v-1)*100;
 r.alpha0=Math.abs(x.d2-x.d)<2*x.a?180-2*Math.asin(Math.abs(x.d2-x.d)/(2*x.a))*180/Math.PI:NaN;
 r.gamma0=(180-r.alpha0)/2;
 r.Lcalc=2*x.a+Math.PI/2*(x.d2+x.d)+(x.d2-x.d)**2/(4*x.a);
 r.W=Math.PI*(x.d2+x.d)/2;r.y=((x.d2-x.d)/2)**2;r.disc=(x.L-r.W)**2-8*r.y;
 r.as=x.L>r.W&&r.disc>=0?((x.L-r.W)+Math.sqrt(r.disc))/4:NaN;
 if(r.as<=Math.abs(x.d2-x.d)/2)r.as=NaN;
 r.clearance=r.as-(x.d+x.d2)/2;
 r.alpha=Math.abs(x.d2-x.d)<2*r.as?180-2*Math.asin(Math.abs(x.d2-x.d)/(2*r.as))*180/Math.PI:NaN;r.gamma=(180-r.alpha)/2;
 r.capacity=x.N0*x.Ca*x.CL;r.zcalc=r.Pj/r.capacity;r.zmin=Math.ceil(r.zcalc);r.util=r.Pj/(x.z*r.capacity)*100;
 r.vbelt=Math.PI*r.dm*r.ns;r.F=r.Pw/r.vbelt;r.Fu=x.kF*r.F;r.M1=r.Pw/(2*Math.PI*r.ns);r.M2=r.Pw/(2*Math.PI*r.n2/60);r.Mb=r.Pw/(2*Math.PI*r.nb);
 r.l1=2*r.M1*1000/(x.shaft1*x.t1*x.p);r.l2=2*r.M2*1000/(x.shaft2*x.t2*x.p);
 r.oldAlpha=180-57*(x.d2-x.d)/x.d2;r.oldGamma=90-r.oldAlpha/2;r.oldLength=2*x.a+1.57*(x.d2+x.d)+(x.d2-x.d)/(4*x.a);r.oldZ=x.N0*x.Ca*x.CL/x.Cp;r.oldM2=r.Mb;r.oldL2=2*r.oldM2*1000/(x.shaft2*x.t2*x.p);
 for(const k in r)if(!Number.isFinite(r[k]))r[k]=null;
 return {r,invalid};
}
