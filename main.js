document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
});

const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .gallery-item, .svg-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
    ring.style.width  = '50px';
    ring.style.height = '50px';
    ring.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
    ring.style.width  = '28px';
    ring.style.height = '28px';
    ring.style.opacity = '0.4';
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
    }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 500);
});

function animateCounter(id, target, suffix='') {
    const el = document.getElementById(id);
    let val = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
    val = Math.min(val + step, target);
    el.textContent = val + suffix;
    if (val >= target) clearInterval(timer);
    }, 40);
}
const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
    animateCounter('count-photos',  8);
    animateCounter('count-vectors', 3);
    animateCounter('count-tracks',  1);
    statsObs.disconnect();
    }
}, { threshold: 0.5 });
statsObs.observe(document.querySelector('.about-stats'));

function openLightbox(el) {
    const img = el.querySelector('img');
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-img').alt = img.alt;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

function setPlaying(id) {
    document.querySelectorAll('.audio-player').forEach(p => p.classList.remove('playing'));
    document.getElementById(id).classList.add('playing');
}
function setNotPlaying(id) {
    document.getElementById(id).classList.remove('playing');
}

function filterTable() {
    const search = document.getElementById('table-search').value.toLowerCase();
    const cat    = document.getElementById('cat-filter').value.toLowerCase();
    const rows   = document.querySelectorAll('#table-body tr');
    let visible  = 0;
    rows.forEach(row => {
    const text  = row.textContent.toLowerCase();
    const catEl = row.querySelector('.badge-soft');
    const rowCat = catEl ? catEl.textContent.toLowerCase() : '';
    const matchSearch = text.includes(search);
    const matchCat    = !cat || rowCat.includes(cat.toLowerCase());
    if (matchSearch && matchCat) { row.style.display = ''; visible++; }
    else                          { row.style.display = 'none'; }
    });
    document.getElementById('row-count').textContent = visible + ' proyecto' + (visible === 1 ? '' : 's');
}

let sortDir = {};
function sortTable(colIdx) {
    const tbody = document.getElementById('table-body');
    const rows  = Array.from(tbody.querySelectorAll('tr'));
    const dir   = sortDir[colIdx] === 'asc' ? 'desc' : 'asc';
    sortDir = {}; sortDir[colIdx] = dir;

    document.querySelectorAll('table.data-table th').forEach((th, i) => {
    th.classList.remove('asc', 'desc');
    if (i === colIdx) th.classList.add(dir);
    });

    rows.sort((a, b) => {
    const aT = a.querySelectorAll('td')[colIdx]?.textContent.trim() || '';
    const bT = b.querySelectorAll('td')[colIdx]?.textContent.trim() || '';
    return dir === 'asc' ? aT.localeCompare(bT, 'es') : bT.localeCompare(aT, 'es');
    });
    rows.forEach(r => tbody.appendChild(r));
}

function handleContact() {
    const name    = document.getElementById('c-name').value.trim();
    const email   = document.getElementById('c-email').value.trim();
    const subject = document.getElementById('c-subject').value.trim();
    const message = document.getElementById('c-message').value.trim();
    const msg     = document.getElementById('form-msg');

    if (!name || !email || !message) {
    msg.style.color = '#ff3cac';
    msg.textContent = 'Por favor completa los campos obligatorios.';
    msg.style.display = 'block';
    return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.style.color = '#ff3cac';
    msg.textContent = 'Ingresa un correo electrónico válido.';
    msg.style.display = 'block';
    return;
    }
    msg.style.color = 'var(--accent)';
    msg.textContent = '✓ Mensaje enviado. (Nota: conecta un servicio como Formspree para envíos reales.)';
    msg.style.display = 'block';
    ['c-name','c-email','c-subject','c-message'].forEach(id => document.getElementById(id).value = '');
}

const barObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w; }, 100);
    });
    barObs.disconnect();
    }
}, { threshold: 0.3 });
const tableSection = document.getElementById('tabla');
if (tableSection) barObs.observe(tableSection);