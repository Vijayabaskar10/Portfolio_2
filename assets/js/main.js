// Theme toggle & sticky header effects
const header = document.getElementById('site-header');
const themeToggle = document.getElementById('theme-toggle');
const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('.nav-link')];
const progress = document.querySelector('.scroll-progress');

// Theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
} else {
  document.body.classList.remove('light');
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Scroll progress
function updateProgress(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / scrollHeight) * 100;
  progress.style.width = pct + '%';
}

document.addEventListener('scroll', updateProgress);
updateProgress();

// Active link detection
const sections = [...document.querySelectorAll('section')];
const sectionMap = new Map(sections.map(s => [s.id, s]));

function onScroll(){
  const pos = window.scrollY + 100;
  for(const link of links){
    const id = link.getAttribute('href').slice(1);
    const sec = sectionMap.get(id);
    if(!sec) continue;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if(pos >= top && pos < bottom){
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  }
}
document.addEventListener('scroll', onScroll);
onScroll();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
      io.unobserve(entry.target);
    }
  });
}, {threshold: 0.2});
revealEls.forEach(el => io.observe(el));

// Typed effect in hero title (after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  if(title){
    // Add a subtle typed loop for the role
    const roleSpan = document.createElement('span');
    roleSpan.className = 'typed-role';
    roleSpan.style.backgroundImage = 'var(--gradient)';
    roleSpan.style.webkitBackgroundClip = 'text';
    roleSpan.style.backgroundClip = 'text';
    roleSpan.style.color = 'transparent';
    // Not using typed.js here for performance; we already include library if needed elsewhere.
  }
});

// Interactive skill cards (expand on click)
document.querySelectorAll('.skill-card.interactive').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

// Fetch latest GitHub repos
async function loadRepos(){
  try{
    const res = await fetch('https://api.github.com/users/Vijayabaskar10/repos?sort=updated&per_page=9');
    const data = await res.json();
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    data.slice(0, 6).forEach(repo => {
      const tags = [];
      if(repo.language) tags.push(repo.language);
      if(repo.topics && repo.topics.length) tags.push(...repo.topics.slice(0,2));
      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noreferrer';
      card.className = 'project-card lift';
      card.innerHTML = `
        <div class="project-meta">
          <strong>${repo.name}</strong>
          <span class="muted"><i class='bx bx-star'></i> ${repo.stargazers_count}</span>
        </div>
        <p class="muted">${repo.description ? repo.description : 'No description provided.'}</p>
        <div class="tags">
          ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      `;
      grid.appendChild(card);
    });
  }catch(e){
    // fallback
    const grid = document.getElementById('project-grid');
    const fallback = document.createElement('div');
    fallback.textContent = 'Unable to load projects right now.';
    grid.appendChild(fallback);
  }
}
loadRepos();

// Tiny parallax float on hero badges
document.querySelectorAll('.floating, .floating-slow').forEach(el => {
  window.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    el.style.transform = `translateY(${Math.sin(Date.now()/1000)*2}px) translate(${dx*6}px, ${dy*6}px)`;
  });
});

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});



