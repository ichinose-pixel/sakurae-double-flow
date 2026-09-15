const fs=require('fs'),vm=require('vm'),assert=require('assert');const elements={};function el(id){return elements[id]??=( {hidden:false,disabled:false,textContent:'',style:{},classList:{s:new Set,add(x){this.s.add(x)},remove(...xs){xs.forEach(x=>this.s.delete(x))},contains(x){return this.s.has(x)}},addEventListener(){},getBoundingClientRect(){return{width:400,height:460}},focus(){},getContext(){return new Proxy({createLinearGradient(){return{addColorStop(){}}},createRadialGradient(){return{addColorStop(){}}}},{get:(o,k)=>o[k]??(()=>{})})}})}const tools={};const context={console,Math,document:{getElementById:el,hidden:false,addEventListener(){},modelContext:{registerTool(t){tools[t.name]=t}}},window:{matchMedia(){return{matches:false}}},performance:{now(){return 0}},ResizeObserver:class{observe(){}},devicePixelRatio:1,requestAnimationFrame(){return 1}};vm.createContext(context);vm.runInContext(fs.readFileSync('docs/game.js','utf8'),context);const run=s=>vm.runInContext(s,context);
for(const order of [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]){
 run('reset()');for(const pin of order){assert(run(`pull(${pin})`));run('for(let i=0;i<60;i++)update(1/60)');}
 run('for(let i=0;i<1200;i++)update(1/60)');assert(run('state.complete'),'order '+order);assert(run('state.exited')>20);
}
for(const missing of [1,2,3]){
 run('reset()');for(const pin of [1,2,3].filter(p=>p!==missing))run(`pull(${pin})`);
 run('for(let i=0;i<720;i++)update(1/60)');assert(!run('state.complete'));assert(run('pileCount()')>18,'missing pin '+missing+' must physically retain beads');
 assert(run(`pull(${missing})`));run('for(let i=0;i<900;i++)update(1/60)');assert(run('state.complete'),'recovery '+missing);
}
run('reset()');const before=run('particles.length');assert(run('pull(3)'));assert.equal(run('particles.length'),before);assert(!run('pull(3)'));assert(!run('pull(4)'));assert(!run('pull(1.5)'));
run('reset();showBridge();for(let i=0;i<500;i++)update(1/60)');assert(run('state.bridge'));run('showResult()');assert(run('state.result'));run('reset();render()');assert.equal(run('particles.length'),64);assert(!run('state.gateOpen'));
console.log('PASS: all six orders, three physical barriers, recovery, no reserve particles, repeated/invalid input, veil, replay, rendering');
