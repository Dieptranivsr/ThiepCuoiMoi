// Sample Image Gallery List
const galleryImages = [
'images/anh01.jpg',
'images/anh02.jpg',
'images/anh03.jpg',
'images/anh04.jpg',
'images/anh05.jpg',
'images/anh06.jpg',
'images/anh07.jpg',
'images/anh08.jpg',
'images/anh09.jpg',
'images/anh10.jpg',
'images/anh11.jpg',
'images/anh12.jpg'
];

let currentImgIndex = 0;
let isMusicPlaying = false;

// Cuộn phim: dải phim ảnh chạy ngang rồi mờ dần để lộ ảnh đầu trang
const FILM_FRAMES = [10, 1, 4, 7, 2, 9, 12].map(i => `images/anh${String(i).padStart(2, '0')}.jpg`);
const FILM_STEP = 1500;   // mỗi ảnh: trượt vào giữa rồi đứng yên (ms)

// Tải trước ảnh cuộn phim ngay khi khách còn ở màn hình phong bì
FILM_FRAMES.forEach(src => { new Image().src = src; });

function playFilmReel(onDone) {
    const hero = document.getElementById('hero');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { onDone(); return; }
    const holes = '<div class="film-holes"></div>';
    const reel = document.createElement('div');
    reel.className = 'filmreel';
    reel.innerHTML = `<div class="film-track">${FILM_FRAMES.map((src, i) =>
            `<div class="film-cell"><div class="film-bob" style="--i:${i}">${holes}<img src="${src}" alt="">${holes}</div></div>`).join('')}</div>
        <span class="film-skip">Chạm để bỏ qua</span>`;
    hero.appendChild(reel);

    const track = reel.querySelector('.film-track');
    const cells = [...reel.querySelectorAll('.film-cell')];
    let idx = 0, timer = null, finished = false;

    // Đặt các khung dọc theo đường sóng y = A·(1 − cos(w·x)); khung k nằm ở đỉnh sóng, thẳng và to nhất
    function show(k) {
        const step = cells[0].offsetWidth + 2;            // khung nối sát nhau như một dải liền
        const A = step * 0.17, w = Math.PI / (2 * step);  // biên độ sóng; 4 khung = 1 bước sóng
        cells.forEach((c, j) => {
            const x = (j - k) * step;
            const y = A * (1 - Math.cos(w * x));
            const deg = Math.atan(A * w * Math.sin(w * x)) * 180 / Math.PI;
            c.style.transform = `translate(${x}px, ${y}px) rotate(${deg}deg) scale(${j === k ? 1.04 : 1})`;
            c.style.zIndex = j === k ? 2 : 1;
            c.classList.toggle('active', j === k);
        });
    }
    function finish() {
        if (finished) return;
        finished = true;
        clearInterval(timer);
        reel.classList.add('done');
        onDone();
        setTimeout(() => reel.remove(), 1000);
    }

    // Bắt đầu: dải phim nằm ngoài mép phải, rồi trượt ảnh đầu tiên vào giữa
    show(-Math.ceil(reel.clientWidth / 2 / cells[0].offsetWidth) - 1);
    requestAnimationFrame(() => requestAnimationFrame(() => { track.classList.add('moving'); show(0); }));
    timer = setInterval(() => {
        if (++idx < cells.length) show(idx);
        else finish();
    }, FILM_STEP);
    reel.addEventListener('click', finish);
}

// Open Invitation Cover
// ===== Lịch trình theo phía khách mời =====
const PLACES = {
    gai:  { label: 'Tư gia nhà gái', addr: 'Xóm 3, Thôn Lãng Ngoại (cũ), Xã Gia Vân', map: 'https://maps.app.goo.gl/ZE6bt5bZc9py3bit6' },
    trai: { label: 'Tư gia nhà trai', addr: 'Xóm 4, Thôn Lãng Ngoại (cũ), Xã Gia Vân', map: 'https://maps.app.goo.gl/4p4VBxCgJQpbj9YA7' }
};
// Tiệc chung vui: khác nhau theo phía khách mời
const PARTIES = {
    'co-dau': { time: '16:30', weekday: 'Thứ Hai', date: '16/11/2026', lunar: '08 Tháng 10 Năm Bính Ngọ', place: 'gai' },
    'chu-re': { time: '16:30', weekday: 'Thứ Hai', date: '16/11/2026', lunar: '08 Tháng 10 Năm Bính Ngọ', place: 'trai' }
};
// Lễ Vu Quy và Lễ Thành Hôn: chung giờ cho mọi khách mời
const CEREMONIES = [
    { title: 'Lễ Vu Quy', time: '8:30', weekday: 'Thứ Ba', date: '17/11/2026', lunar: '09 Tháng 10 Năm Bính Ngọ', place: 'gai' },
    { title: 'Lễ Thành Hôn', time: '10:00', weekday: 'Thứ Ba', date: '17/11/2026', lunar: '09 Tháng 10 Năm Bính Ngọ', place: 'trai' }
];
let guestSide = 'co-dau';

function setGuestSide(side) {
    if (!PARTIES[side]) return;
    guestSide = side;
    try { localStorage.setItem('guestSide', side); } catch (_) {}
    const sw = document.querySelector('.ev-switch');
    sw.dataset.side = side;
    sw.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.side === side));
    renderEvents();
    // Hộp quà: bạn cô dâu chỉ thấy tài khoản cô dâu, bạn chú rể chỉ thấy tài khoản chú rể
    const who = side === 'co-dau' ? 'bride' : 'groom';
    document.querySelectorAll('.qr-card[data-who]').forEach(c => { c.hidden = c.dataset.who !== who; });
}

// Hoa văn ngăn cách: hai dải lượn sóng, giữa là chữ Hỉ đỏ
const EV_WAVE = (flip) => `<svg viewBox="0 0 110 28"${flip ? ' style="transform:scaleX(-1)"' : ''}><g fill="none" stroke="#B87333" stroke-width="1.3" stroke-linecap="round">
        <path d="M4 12 C28 6 58 18 106 12 M4 16 C28 10 58 22 106 16"/></g></svg>`;
const EV_ORNAMENT = `<div class="ev-ornament" aria-hidden="true">
    ${EV_WAVE(false)}<img class="ev-hy" src="images/song-hy.png" alt="">${EV_WAVE(true)}
</div>`;

// Một khối sự kiện căn giữa: tiêu đề, giờ - thứ, ngày dương, ngày âm, địa điểm
function eventBlock(ev, head, where, delay) {
    const place = PLACES[ev.place];
    return `<div class="ev-block ${ev.place} ev-anim" style="--ev-d:${delay}ms">
        ${head}
        <span class="ev-rule"></span>
        <div class="ev-when">${ev.time} - ${ev.weekday}</div>
        <div class="ev-day">${ev.date}</div>
        <div class="ev-lunar">( Tức Ngày ${ev.lunar} )</div>
        <div class="ev-where">${where} ${place.label.toLowerCase()}</div>
        <a class="ev-map" href="${place.map}" target="_blank" rel="noopener"><i class="fas fa-map-marker-alt mr-1"></i>Chỉ đường</a>
    </div>`;
}

function renderEvents() {
    const p = PARTIES[guestSide];
    const invite = `
        <h3 class="ev-head">Trân Trọng Kính Mời</h3>
        <p class="ev-sub">Tới dự bữa tiệc chung vui cùng<br>với gia đình chúng tôi</p>`;
    const blocks = [eventBlock(p, invite, 'Tại', 0)]
        .concat(CEREMONIES.map((c, i) => eventBlock(c, `<h3 class="ev-head">${c.title}</h3>`, 'Cử hành tại', (i + 1) * 250)));
    document.getElementById('eventTimeline').innerHTML = blocks.join(EV_ORNAMENT);
}


// Nút "Chạm để mở thiệp" giờ chỉ nhắc khách chọn phía của mình
function nudgeGuestChoice() {
    const box = document.getElementById('guestChoice');
    box.classList.remove('nudge');
    void box.offsetWidth;
    box.classList.add('nudge');
}

function openWeddingInvitation(side) {
    setGuestSide(side);
    const envelope = document.getElementById('envelopeCover');
    envelope.classList.add('opacity-0', 'pointer-events-none');

    playFilmReel(() => document.getElementById('hero').classList.add('play'));
    // Auto play music when opened
    toggleMusic(true);

    // Generate petals animation
    createPetals();
}

// Music Control Functions
function toggleMusic(forcePlay = false) {
    const audio = document.getElementById('weddingAudio');
    const musicBtn = document.getElementById('musicToggleBtn');
    const musicIcon = document.getElementById('musicIcon');

    if (forcePlay || audio.paused) {
        if (forcePlay) {
            if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
                if (audio.duration > 4) audio.currentTime = 4;
            } else {
                audio.addEventListener('loadedmetadata', () => {
                    if (audio.duration > 4) audio.currentTime = 4;
                }, { once: true });
            }
        }
        audio.play().then(() => {
            isMusicPlaying = true;
            musicBtn.classList.add('spin-music');
            musicIcon.className = "fas fa-compact-disc text-lg";
        }).catch(() => {
            console.log("Audio play blocked by browser policy");
        });
    } else {
        audio.pause();
        isMusicPlaying = false;
        musicBtn.classList.remove('spin-music');
        musicIcon.className = "fas fa-music text-lg";
    }
}

// Tạm dừng nhạc khi khách rời tab (vd: mở app ngân hàng), phát lại khi quay về
let resumeMusicOnReturn = false;
document.addEventListener('visibilitychange', () => {
    const audio = document.getElementById('weddingAudio');
    if (document.hidden) {
        resumeMusicOnReturn = !audio.paused;
        if (resumeMusicOnReturn) audio.pause();
    } else if (resumeMusicOnReturn) {
        resumeMusicOnReturn = false;
        audio.play().catch(() => {});
    }
});

// Falling Petals Generator
function createPetals() {
    const container = document.getElementById('petalsContainer');
    const petalCount = 15;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal text-softrose/60';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.innerHTML = '<i class="fas fa-heart text-xs"></i>';
        container.appendChild(petal);
    }
}

// Countdown Timer
const weddingDate = new Date('2026-11-16T16:30:00+07:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = "<p class='col-span-4 text-white font-bold text-xl'>Lễ cưới đã diễn ra!</p>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Bố cục mosaic: [cột, hàng] trên máy tính rồi điện thoại; 12 ảnh lấp đầy lưới, không để trống
const GALLERY_SPANS = [
    [3,4,2,4],[3,2,1,3],[3,2,1,3],[2,3,1,3],[2,3,1,3],[2,3,2,3],
    [4,3,1,3],[2,3,1,3],[2,3,2,4],[4,3,2,3],[3,4,1,3],[3,4,1,3]
];
function tileSpan(i) {
    const s = GALLERY_SPANS[i] || [2,3,1,3];
    return `--dc:${s[0]};--dr:${s[1]};--mc:${s[2]};--mr:${s[3]}`;
}

// Render Gallery Images
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = galleryImages.map((src, index) => `
        <div class="letter g-tile group" style="${tileSpan(index)}" onclick="openLightbox(${index})">
            <div class="env"></div>
            <div class="photo">
                <img src="${src}" alt="Ảnh cưới ${index + 1}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <i class="fas fa-search-plus text-2xl"></i>
                </div>
            </div>
            <div class="flap"></div>
            ${index % 2 ? '<div class="seal bow"><svg viewBox="0 0 64 40" class="bow-svg" aria-hidden="true"><path d="M32 20 C22 2 2 2 2 14 C2 28 22 28 32 20Z" fill="#F4AFC0"/><path d="M32 20 C42 2 62 2 62 14 C62 28 42 28 32 20Z" fill="#F4AFC0"/><path d="M32 20 L16 38 L24 38 L32 26 L40 38 L48 38Z" fill="#F28AA6"/><path d="M32 20 C24 8 10 8 10 14 C10 22 24 24 32 20Z" fill="#FAD1DC" opacity=".7"/><rect x="26" y="13" width="12" height="14" rx="5" fill="#C94F76"/></svg></div>' : '<div class="seal"><i class="fas fa-heart"></i></div>'}
        </div>
    `).join('');
    observeTilt('#galleryGrid .letter');
}

function observeTilt(sel) {
    const io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
    }), { threshold: .15 });
    document.querySelectorAll(sel).forEach((el, i) => { el.style.transitionDelay = (i % 3) * 120 + 'ms'; el.style.setProperty('--d', (i % 2) * 150 + 'ms'); io.observe(el); });
}
// Lightbox Gallery Functions
function openLightbox(index) {
    currentImgIndex = index;
    document.getElementById('lightboxImg').src = galleryImages[currentImgIndex];
    document.getElementById('lightboxModal').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.add('hidden');
}

function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    document.getElementById('lightboxImg').src = galleryImages[currentImgIndex];
}

function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById('lightboxImg').src = galleryImages[currentImgIndex];
}

// Số tài khoản mừng cưới: điền vào đây, để trống "number" thì không hiển thị
const GIFT_ACCOUNTS = {
    groom: { bank: 'TPBank', number: '07552653401', owner: 'TRAN TUAN DIEP' },
    bride: { bank: 'Techcombank', number: '1903 3908 5700 10', owner: 'DINH THI THAO' }
};
function renderGiftAccounts() {
    document.querySelectorAll('.stk-slot').forEach(slot => {
        const a = GIFT_ACCOUNTS[slot.dataset.who];
        if (!a || !a.number) return;
        slot.innerHTML = `<div class="stk-row">
            ${a.bank ? `<span>${esc(a.bank)}</span>` : ''}
            <span class="stk-num">${esc(a.number)}</span>
            ${a.owner ? `<span class="uppercase text-xs tracking-wider">${esc(a.owner)}</span><br>` : ''}
            <button type="button" class="stk-copy" data-stk="${esc(a.number)}"><i class="far fa-copy mr-1"></i> Sao chép</button>
        </div>`;
        slot.querySelector('.stk-copy').onclick = e => copyToClipboard(e.currentTarget.dataset.stk);
    });
}

// Copy STK to Clipboard
async function copyToClipboard(text) {
    const plain = text.replace(/\s+/g, '');
    try {
        await navigator.clipboard.writeText(plain);
    } catch (_) {
        const tempInput = document.createElement('input');
        tempInput.value = plain;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
    showToast('Đã sao chép số tài khoản!');
}

// Khóa nút gửi trong lúc chờ để tránh gửi trùng
function setSubmitting(form, busy) {
    const btn = form.querySelector('button[type="submit"]');
    if (busy) {
        btn.dataset.label = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Đang gửi...';
    } else if (btn.dataset.label) {
        btn.innerHTML = btn.dataset.label;
    }
    btn.disabled = busy;
    btn.classList.toggle('opacity-70', busy);
    btn.classList.toggle('cursor-wait', busy);
}

// Toast Notification Helper
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3000);
}

// ===== Sổ lưu bút: lưu vào Google Sheet + bong bóng nổi =====
// Dán link Web App của Google Apps Script vào đây (xem google-apps-script.gs). Để trống = chỉ lưu tạm trên máy.
const WISH_API_URL = "https://script.google.com/macros/s/AKfycbwDhbNgrZpsL5Ug14XiYtWLhv14MQPHlhy9csYrApLQ4ay2bAe3NIZtfwHzXO3XUvPq/exec";
const BUBBLE_GAP = [3000, 5000];    // khoảng cách giữa 2 bong bóng (ms)
const BUBBLE_LIFE = [5000, 7000];   // thời gian mỗi bong bóng hiển thị (ms)
const REFRESH_MS = 10000;           // tải lại lời chúc mới từ Google Sheet

const initialWishes = [
    { name: "Chị Lan & Anh Minh", role: "Đồng Nghiệp", message: "Chúc hai em trăm năm hạnh phúc, sớm đón quý tử nhé!", time: "" },
    { name: "Minh Hoàng", role: "Bạn Chú Rể", message: "Mừng ngày chung đôi của Tuấn Điệp và Đinh Thảo! Chúc hai bạn luôn tràn ngập nụ cười.", time: "" }
];
let wishes = [];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rnd = ([a, b]) => a + Math.random() * (b - a);

async function fetchWishes() {
    if (WISH_API_URL) {
        try {
            const res = await fetch(WISH_API_URL, { cache: 'no-store' });
            const data = await res.json();
            if (Array.isArray(data)) return data;
        } catch (_) {}
    }
    const stored = localStorage.getItem('weddingWishes');
    return stored ? JSON.parse(stored) : initialWishes;
}

async function loadWishes() {
    wishes = await fetchWishes();
    renderWishes();
}

function renderWishes() {
    document.getElementById('wishesContainer').innerHTML = wishes.map(item => `
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-sm text-burgundy">${esc(item.name)}</span>
                    <span class="text-[10px] bg-softrose/30 text-burgundy px-2 py-0.5 rounded-full font-medium">${esc(item.role)}</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">${esc(item.message)}</p>
            </div>
            ${item.time ? `<span class="text-[10px] text-gray-400 self-end mt-2">${esc(item.time)}</span>` : ''}
        </div>
    `).join('');
}

async function handleWishSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.querySelector('button[type="submit"]').disabled) return;
    setSubmitting(form, true);
    const item = {
        name: document.getElementById('wishName').value.trim(),
        role: document.getElementById('wishRole').value,
        message: document.getElementById('wishMessage').value.trim()
    };
    if (WISH_API_URL) {
        try {
            await fetch(WISH_API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(item) });
        } catch (_) {}
    } else {
        const stored = localStorage.getItem('weddingWishes');
        const list = stored ? JSON.parse(stored) : [...initialWishes];
        list.unshift(item);
        localStorage.setItem('weddingWishes', JSON.stringify(list));
    }
    wishes = [item, ...wishes];
    renderWishes();
    spawnBubble(item);
    form.reset();
    setSubmitting(form, false);
    showToast('Cảm ơn bạn đã gửi lời chúc mừng!');
}

// Bong bóng lời chúc nổi lên ngẫu nhiên
let bubbleQueue = [];
function spawnBubble(item) {
    const box = document.getElementById('bubbleLayer');
    const b = document.createElement('div');
    const life = rnd(BUBBLE_LIFE);
    b.className = 'wish-bubble';
    b.style.left = (2 + Math.random() * 40) + 'vw';
    b.style.animationDuration = life + 'ms';
    b.innerHTML = `<b>${esc(item.name)}</b><span>${esc(item.message)}</span>`;
    box.appendChild(b);
    setTimeout(() => b.remove(), life + 100);
}
// Chỉ bắt đầu hiện lời chúc khi khách cuộn tới Album ảnh
let reachedGallery = false;
new IntersectionObserver((entries, obs) => {
    if (entries.some(e => e.isIntersecting)) { reachedGallery = true; obs.disconnect(); }
}, { threshold: 0.15 }).observe(document.getElementById('gallery'));

// Tạm dừng lời chúc khi khách đang xem popup mã QR
function bubblesPaused() {
    return document.getElementById('giftModal').classList.contains('open');
}
function updateBubblePause() {
    document.getElementById('bubbleLayer').classList.toggle('paused', bubblesPaused());
}

function nextBubble() {
    if (!document.getElementById('envelopeCover').classList.contains('pointer-events-none') || !reachedGallery || bubblesPaused()) {
        // chờ khách mở thiệp, cuộn tới Album ảnh, hoặc đang xem mã QR
    } else if (wishes.length) {
        if (!bubbleQueue.length) bubbleQueue = [...wishes].sort(() => Math.random() - .5);
        spawnBubble(bubbleQueue.pop());
    }
    setTimeout(nextBubble, rnd(BUBBLE_GAP));
}
setTimeout(nextBubble, 2000);
setInterval(() => { if (WISH_API_URL) loadWishes(); }, REFRESH_MS);
// RSVP Modal Functions
// Hộp quà: nắp bật lên rồi mở popup mã QR giữa màn hình
function openGift() {
    const btn = document.getElementById('giftBtn');
    const modal = document.getElementById('giftModal');
    btn.classList.add('opened');
    btn.setAttribute('aria-expanded', true);
    setTimeout(() => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', false);
        document.body.style.overflow = 'hidden';
        updateBubblePause();
        modal.querySelector('.gift-close').focus({ preventScroll: true });
    }, 350);
}
function closeGift() {
    const btn = document.getElementById('giftBtn');
    const modal = document.getElementById('giftModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', true);
    document.body.style.overflow = '';
    btn.classList.remove('opened');
    btn.setAttribute('aria-expanded', false);
    updateBubblePause();
}
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('giftModal').classList.contains('open')) closeGift();
});

function openRsvpModal() {
    document.getElementById('rsvpModal').classList.remove('hidden');
}

function closeRsvpModal() {
    document.getElementById('rsvpModal').classList.add('hidden');
}

async function handleRsvpSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.querySelector('button[type="submit"]').disabled) return;
    setSubmitting(form, true);
    const data = {
        type: 'rsvp',
        name: document.getElementById('rsvpName').value.trim(),
        phone: document.getElementById('rsvpPhone').value.trim(),
        status: document.getElementById('rsvpStatus').value,
        count: document.getElementById('rsvpCount').value
    };
    if (WISH_API_URL) {
        try {
            await fetch(WISH_API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(data) });
        } catch (_) {}
    }
    setSubmitting(form, false);
    closeRsvpModal();
    showToast('Cảm ơn bạn đã xác nhận tham dự!');
    form.reset();
}

// Initialize Page Data on Load
window.onload = function() {
    renderGallery();
    observeTilt('.portrait-card');
    renderGiftAccounts();
    let savedSide = null;
    try { savedSide = localStorage.getItem('guestSide'); } catch (_) {}
    setGuestSide(savedSide || 'co-dau');
    new IntersectionObserver((es, obs) => {
        if (es[0].isIntersecting) { es[0].target.classList.add('seen'); obs.disconnect(); }
    }, { threshold: .15 }).observe(document.getElementById('eventTimeline'));
    loadWishes();
};
