// Every arrow/tick changes the parameter by exactly one of its displayed units.
// Preserve the fractional part of typed values and of the original assignment.
const limits={D:2000,v:20,ig:30,a:3000,P:50,n:6000,Cp:5,d:1500,d2:2000,L:12000,N0:50,Ca:2,CL:5,z:20,shaft1:200,t1:30,shaft2:200,t2:30,p:500,kF:10};
export function sliderBounds(key,value){
 const valid=Number.isFinite(value)&&value>0&&(key!=='z'||Number.isInteger(value));
 if(!valid)return null;
 const fraction=Number((value-Math.floor(value)).toFixed(9));
 const min=fraction>0?fraction:1;
 const max=min+Math.max(Math.ceil(limits[key]-min),Math.ceil(value-min));
 return {min,max,value,step:1};
}
