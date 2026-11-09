const $=id=>document.getElementById(id);
const fileInput=$('file'),drop=$('dropzone');let chosen=null,jobTimer=null;
const panels=[$('panelVideo'),$('panelMethod'),$('panelDownload')];
const fmt=n=>{if(!n)return '—';let u=['B','KB','MB','GB'],i=0;while(n>=1024&&i<3){n/=1024;i++}return n.toFixed(i?2:0)+' '+u[i]};
function go(n){panels.forEach((p,i)=>p.classList.toggle('hidden',i!==n-1));for(let i=1;i<=3;i++){const s=$('step'+i);s.classList.toggle('active',i===n);s.classList.toggle('done',i<n)}}
function choose(f){if(!f)return;if(!f.type.startsWith('video/')&&!/\.(mp4|mov|mkv|webm|m4v)$/i.test(f.name)){alert('Please select a video file.');return}chosen=f;$('fileInfo').textContent='▶  '+f.name+'  ·  '+fmt(f.size);$('fileInfo').classList.remove('hidden');$('toMethod').disabled=false}
fileInput.addEventListener('change',e=>choose(e.target.files[0]));
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>choose(e.dataTransfer.files[0]));
$('toMethod').onclick=()=>{if(!chosen)return;$('chosenInfo').textContent='Selected: '+chosen.name+' · '+fmt(chosen.size);go(2)};
$('backVideo').onclick=()=>go(1);
document.querySelectorAll('.method').forEach(label=>label.addEventListener('click',()=>{document.querySelectorAll('.method').forEach(x=>x.classList.remove('selected'));label.classList.add('selected');label.querySelector('input').checked=true}));
function showError(msg){clearTimeout(jobTimer);$('error').textContent=msg;$('error').classList.remove('hidden');$('progressArea').classList.add('hidden');$('compress').disabled=false}
async function poll(id,original){
 const r=await fetch('/api/status/'+id),j=await r.json();if(!r.ok)throw Error(j.detail||'Could not get processing status.');
 $('percent').textContent=(j.progress||0)+'%';$('progressBar').style.width=(j.progress||0)+'%';
 if(j.status==='queued'||j.status==='processing'){$('progressText').textContent=j.status==='queued'?'Waiting for processing…':'Compressing your video…';jobTimer=setTimeout(()=>poll(id,original).catch(e=>showError(e.message)),1400);return}
 if(j.status==='error')throw Error(j.error||'Compression failed.');
 const o=j.original||original,z=j.result,saved=100-(z.size/o.size*100);
 $('progressText').textContent='Compression complete';$('progressHint').textContent='Your MP4 file is ready.';
 $('downloadTitle').textContent='Your video is ready';$('downloadSubtitle').textContent='Compression finished. Download your file below.';
 $('result').innerHTML=`<h3>✓ Finished successfully</h3><div class="stats"><div class="stat"><small>Original size</small><b>${fmt(o.size)}</b></div><div class="stat"><small>New size</small><b>${fmt(z.size)}</b></div><div class="stat"><small>Size change</small><b>${saved>=0?saved.toFixed(1)+'% smaller':Math.abs(saved).toFixed(1)+'% larger'}</b></div><div class="stat"><small>Resolution</small><b>${o.width||'?'} × ${o.height||'?'}</b></div><div class="stat"><small>Source FPS</small><b>${o.fps||'?'}</b></div><div class="stat"><small>Output FPS</small><b>${z.fps||'?'}</b></div></div><a class="download" href="${j.download}">Download finished video ↓</a>`;
 $('result').classList.remove('hidden');
}
$('compress').onclick=async()=>{
 if(!chosen)return;$('compress').disabled=true;$('error').classList.add('hidden');$('result').classList.add('hidden');$('progressArea').classList.remove('hidden');$('progressText').textContent='Uploading video…';$('percent').textContent='0%';$('progressBar').style.width='0%';$('progressHint').textContent='Keep this page open while your video is processing.';go(3);
 const fd=new FormData();fd.append('file',chosen);fd.append('quality',document.querySelector('input[name=quality]:checked').value);fd.append('preset',$('speed').value);
 try{const r=await fetch('/api/compress',{method:'POST',body:fd}),j=await r.json();if(!r.ok)throw Error(j.detail||'Upload failed.');poll(j.job_id,j.original).catch(e=>showError(e.message))}
 catch(e){showError(e.message)}
};
$('startOver').onclick=()=>{clearTimeout(jobTimer);chosen=null;fileInput.value='';$('fileInfo').classList.add('hidden');$('toMethod').disabled=true;$('compress').disabled=false;$('error').classList.add('hidden');$('result').classList.add('hidden');$('progressArea').classList.remove('hidden');go(1)};
