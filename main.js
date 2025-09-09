// Lessons
const LESSONS = [
  {id:'alpha', title:'Alphabet Adventure', age:'3-5', summary:'Learn A–Z with fun sounds and pictures.', topic:'Literacy', content:['A for Apple','B for Ball','C for Cat']},
  {id:'numbers', title:'Numbers & Counting', age:'3-6', summary:'Counting 1–20 with visuals.', topic:'Math', content:['Count to 10','Number shapes','Simple addition']},
  {id:'shapes', title:'Shapes & Colors', age:'3-6', summary:'Identify shapes and colors.', topic:'Math', content:['Circle','Square','Triangle']},
];
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Render lessons
function renderLessons(){
  const container = $('#lessons-list');
  container.innerHTML='';
  LESSONS.forEach(l=>{
    const card=document.createElement('article');
    card.className='card';
    card.innerHTML=`
      <h3>${l.title}</h3>
      <p>${l.topic} • ${l.age}</p>
      <p>${l.summary}</p>
      <button class="btn" data-lesson="${l.id}">Open</button>`;
    container.appendChild(card);
  });
}

// Modal for lesson
function openLessonModal(lesson){
  const modal=document.createElement('div');
  modal.className='modal';
  modal.innerHTML=`
    <div class="card">
      <h3>${lesson.title}</h3>
      <ul>${lesson.content.map(c=>`<li>${c}</li>`).join('')}</ul>
      <button id="close-modal" class="btn">Close</button>
    </div>`;
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});
  document.body.appendChild(modal);
  $('#close-modal').addEventListener('click',()=>modal.remove());
}

// Nav toggle
$('.nav-toggle').addEventListener('click',e=>{
  $('#main-nav').classList.toggle('show');
});

// Lesson click
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-lesson]');
  if(!btn)return;
  const lesson=LESSONS.find(x=>x.id===btn.dataset.lesson);
  openLessonModal(lesson);
});

// Matching game
const MATCH_PAIRS=[
  {id:'apple',word:'Apple',img:'🍎'},
  {id:'ball',word:'Ball',img:'⚽'},
  {id:'cat',word:'Cat',img:'🐱'},
];
function setupMatchGame(){
  const pics=$('#match-pics'),targets=$('#match-targets');
  pics.innerHTML='';targets.innerHTML='';
  MATCH_PAIRS.forEach(p=>{
    const item=document.createElement('div');
    item.className='match-item';item.draggable=true;item.dataset.id=p.id;
    item.textContent=p.img+' '+p.word;
    item.addEventListener('dragstart',e=>dragId=p.id);
    pics.appendChild(item);
  });
  MATCH_PAIRS.forEach(t=>{
    const target=document.createElement('div');
    target.className='match-item';target.dataset.id=t.id;target.textContent=t.word;
    target.addEventListener('dragover',e=>e.preventDefault());
    target.addEventListener('drop',drop);
    targets.appendChild(target);
  });
}
let dragId=null;
function drop(e){
  e.preventDefault();
  if(dragId===e.currentTarget.dataset.id){
    e.currentTarget.textContent='Matched!';
    $('#match-feedback').textContent='Good job!';
  } else {
    $('#match-feedback').textContent='Try again!';
  }
  dragId=null;
}
$('#match-reset').addEventListener('click',setupMatchGame);

// Quiz
const QUIZ=[
  {q:'Which is an animal?',choices:['Apple','Cat','Ball'],a:1},
  {q:'What comes after 1?',choices:['2','5','0'],a:0},
];
let quizIndex=0;
function renderQuiz(){
  const item=QUIZ[quizIndex];
  if(!item){$('#quiz-area').textContent='Quiz done!';$('#quiz-next').style.display='none';return;}
  $('#quiz-area').innerHTML=`
    <p>${item.q}</p>
    ${item.choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join('')}`;
  $$('.choice').forEach(b=>b.addEventListener('click',()=>{
    if(Number(b.dataset.i)===item.a)$('#quiz-feedback').textContent='Correct!';
    else $('#quiz-feedback').textContent='Wrong!';
  }));
}
$('#quiz-next').addEventListener('click',()=>{quizIndex++;renderQuiz();$('#quiz-feedback').textContent='';});

// Worksheet
$('#ws-generate').addEventListener('click',()=>{
  const title=$('#ws-title').value||'Worksheet';
  const count=Number($('#ws-count').value)||6;
  const preview=$('#ws-preview');preview.innerHTML=`<h4>${title}</h4>`;
  for(let i=0;i<count;i++){const a=Math.ceil(Math.random()*9),b=Math.ceil(Math.random()*9);
    preview.innerHTML+=`<p>${a}+${b}=___</p>`;}
});
$('#ws-print').addEventListener('click',()=>window.print());

// Export progress
$('#export-progress').addEventListener('click',()=>{
  const data=localStorage.getItem('dumbo_progress')||'{}';
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='progress.json';a.click();
  URL.revokeObjectURL(url);
});

// Init
function init(){renderLessons();setupMatchGame();renderQuiz();}
init();
