import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Scene ──────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060612);
scene.fog = new THREE.FogExp2(0x060612, 0.018);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxDistance = 28;
controls.minDistance = 4;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// ── Lights ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const blueLight = new THREE.PointLight(0x4477ff, 6, 35);
blueLight.position.set(-10, 10, 5);
scene.add(blueLight);
const orangeLight = new THREE.PointLight(0xff5500, 4, 30);
orangeLight.position.set(10, 5, 5);
scene.add(orangeLight);
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(0, 15, 5);
scene.add(topLight);

// ── Stars ──────────────────────────────────────────────────────────────────
function makeStars(count, size, color, spread) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.7 }));
}
const stars1 = makeStars(500, 0.06, 0x88aaff, 80);
const stars2 = makeStars(200, 0.12, 0xffffff, 60);
scene.add(stars1, stars2);

// ── Central Orb ────────────────────────────────────────────────────────────
const orbGroup = new THREE.Group();
scene.add(orbGroup);

const innerOrb = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 64, 64),
  new THREE.MeshStandardMaterial({ color: 0x1133aa, roughness: 0.1, metalness: 1.0, emissive: 0x112266, emissiveIntensity: 0.5 })
);
orbGroup.add(innerOrb);

const wireOrb = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.15, 2),
  new THREE.MeshBasicMaterial({ color: 0x4488ff, wireframe: true, transparent: true, opacity: 0.4 })
);
orbGroup.add(wireOrb);

const outerOrb = new THREE.Mesh(
  new THREE.SphereGeometry(1.35, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06, roughness: 0, metalness: 1 })
);
orbGroup.add(outerOrb);

// Rings around orb
function makeRing(r, color, rx, ry, rz) {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(r, 0.018, 8, 100),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, transparent: true, opacity: 0.7 })
  );
  m.rotation.set(rx, ry, rz);
  orbGroup.add(m);
  return m;
}
const ring1 = makeRing(2.0, 0x4488ff, Math.PI / 3, 0, 0);
const ring2 = makeRing(2.5, 0xff5500, -Math.PI / 4, Math.PI / 6, 0);
const ring3 = makeRing(1.7, 0x22cc88, Math.PI / 2, Math.PI / 4, 0);

// ── Card Texture ───────────────────────────────────────────────────────────
const icons = { PROFILE: '👤', EXPERIENCE: '💼', SKILLS: '⚡', EDUCATION: '🎓', AWARDS: '🏆' };

function makeCardTexture(label, hex) {
  const W = 600, H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, 'rgba(8,12,30,0.97)');
  bg.addColorStop(1, 'rgba(14,20,50,0.97)');
  ctx.fillStyle = bg;
  ctx.roundRect(4, 4, W - 8, H - 8, 18);
  ctx.fill();

  // Glow border
  ctx.shadowColor = hex;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = hex;
  ctx.lineWidth = 3;
  ctx.roundRect(4, 4, W - 8, H - 8, 18);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Top accent line
  const accent = ctx.createLinearGradient(40, 0, W - 40, 0);
  accent.addColorStop(0, 'transparent');
  accent.addColorStop(0.5, hex);
  accent.addColorStop(1, 'transparent');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(W - 40, 30); ctx.stroke();

  // Icon
  ctx.font = '56px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(icons[label] || '★', W / 2, 110);

  // Label
  ctx.shadowColor = hex;
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px Arial';
  ctx.letterSpacing = '3px';
  ctx.fillText(label, W / 2, 185);
  ctx.shadowBlur = 0;

  // Divider
  ctx.strokeStyle = hex;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.moveTo(80, 205); ctx.lineTo(W - 80, 205); ctx.stroke();
  ctx.globalAlpha = 1;

  // Subtitle
  ctx.fillStyle = hex;
  ctx.font = '500 24px Arial';
  ctx.fillText('CLICK TO EXPLORE', W / 2, 268);

  // Corner dots
  [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]].forEach(([x, y]) => {
    ctx.fillStyle = hex;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

// ── Sections ───────────────────────────────────────────────────────────────
const sections = [
  { label: 'PROFILE',    color: 0x4488ff, hex: '#4488ff' },
  { label: 'EXPERIENCE', color: 0xff5500, hex: '#ff5500' },
  { label: 'SKILLS',     color: 0x22cc88, hex: '#22cc88' },
  { label: 'EDUCATION',  color: 0xaa44ff, hex: '#aa44ff' },
  { label: 'AWARDS',     color: 0xffcc00, hex: '#ffcc00' },
];

const cards = [];
const cardGroup = new THREE.Group();
scene.add(cardGroup);

sections.forEach((sec, i) => {
  const angle = (i / sections.length) * Math.PI * 2;
  const radius = 6.5;
  const group = new THREE.Group();
  group.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
  group.lookAt(Math.sin(angle) * 20, 0, Math.cos(angle) * 20);

  const tex = makeCardTexture(sec.label, sec.hex);
  const cardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.4),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
  group.add(cardMesh);

  // Glow plane behind card
  const glowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.8),
    new THREE.MeshBasicMaterial({ color: sec.color, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
  );
  glowMesh.position.z = -0.05;
  group.add(glowMesh);

  cards.push({ group, mesh: cardMesh, glowMesh, label: sec.label, angle, baseY: 0 });
  cardGroup.add(group);
});

// ── Info Panel Data ────────────────────────────────────────────────────────
const infoData = {
  PROFILE: `
    <div class="panel-header">
      <div class="panel-icon">👤</div>
      <div>
        <h2>Chetan Holiyappa</h2>
        <p class="subtitle">Strategic Talent Partner · 10+ Years</p>
      </div>
    </div>
    <div class="contact-row">
      <a href="tel:+917338025205">📞 +91-7338025205</a>
      <a href="mailto:Chaytonah@gmail.com">✉️ Chaytonah@gmail.com</a>
      <a href="https://www.linkedin.com/in/caholiyappa/" target="_blank">🔗 LinkedIn</a>
      <a href="https://maddychetan.github.io/chetan-ai-talent-portfolio/#" target="_blank">🌐 Portfolio</a>
    </div>
    <p>Product, SaaS & Technology hiring specialist with deep expertise in scalable recruitment, ATS automation, and AI-assisted hiring workflows. Known for combining market intelligence, stakeholder collaboration, and process optimization.</p>
    <div class="tag-row"><span class="tag">SaaS Hiring</span><span class="tag">AI Recruitment</span><span class="tag">ATS Automation</span><span class="tag">D&I</span><span class="tag">APAC/EMEA</span></div>`,

  EXPERIENCE: `
    <div class="panel-header">
      <div class="panel-icon">💼</div>
      <div><h2>Experience</h2><p class="subtitle">10+ Years · Global Recruitment</p></div>
    </div>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-dot" style="background:#ff5500"></div>
        <div class="tl-content">
          <div class="tl-title">Global TA Partner <span class="tl-co">Resilinc</span></div>
          <div class="tl-date">Feb 2024 – Present</div>
          <p>AI-assisted hiring, Lever ATS automation (-40% manual effort), SeekOut & Talent Neuron sourcing. Built workflow-based AI assistants (POC). SEO-driven JDs improving organic applications.</p>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#aa44ff"></div>
        <div class="tl-content">
          <div class="tl-title">Senior Recruiter <span class="tl-co">Mitratech</span></div>
          <div class="tl-date">Feb 2023 – Jul 2023</div>
          <p>Java fullstack, .Net, Automation Testers, Product Owners. Greenhouse ATS super-user.</p>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#4488ff"></div>
        <div class="tl-content">
          <div class="tl-title">TA Specialist EMEA & APAC <span class="tl-co">TomTom</span></div>
          <div class="tl-date">May 2021 – Dec 2022</div>
          <p>D&I hiring +20% · Offer acceptance 95% · Drop ratio 40% → 10% · Agile/Scrum methodology.</p>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#22cc88"></div>
        <div class="tl-content">
          <div class="tl-title">Senior IT Recruitment Consultant <span class="tl-co">KellyOCG</span></div>
          <div class="tl-date">Jan 2019 – Apr 2021</div>
          <p>Multi-client APAC hiring: Citi, Ford & more. RPO model delivery.</p>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#ffcc00"></div>
        <div class="tl-content">
          <div class="tl-title">Lead Technical Recruiter <span class="tl-co">Sunrise Systems</span></div>
          <div class="tl-date">Feb 2016 – Dec 2018</div>
          <p>Mentored fresh graduates. Strong team player recognized with Recruiter Honor Award.</p>
        </div>
      </div>
    </div>`,

  SKILLS: `
    <div class="panel-header">
      <div class="panel-icon">⚡</div>
      <div><h2>Skills</h2><p class="subtitle">Tools · Platforms · Competencies</p></div>
    </div>
    <p class="skill-cat">AI & Automation</p>
    <div class="bar-group">
      <div class="bar-item"><span>AI-Assisted Hiring</span><div class="bar"><div class="bar-fill" style="width:90%;background:#4488ff"></div></div></div>
      <div class="bar-item"><span>Juicebox / ChatGPT</span><div class="bar"><div class="bar-fill" style="width:85%;background:#4488ff"></div></div></div>
      <div class="bar-item"><span>Workflow Automation</span><div class="bar"><div class="bar-fill" style="width:80%;background:#4488ff"></div></div></div>
    </div>
    <p class="skill-cat">ATS & Tools</p>
    <div class="bar-group">
      <div class="bar-item"><span>Lever ATS</span><div class="bar"><div class="bar-fill" style="width:92%;background:#ff5500"></div></div></div>
      <div class="bar-item"><span>Greenhouse ATS</span><div class="bar"><div class="bar-fill" style="width:85%;background:#ff5500"></div></div></div>
      <div class="bar-item"><span>SeekOut / Talent Neuron</span><div class="bar"><div class="bar-fill" style="width:88%;background:#ff5500"></div></div></div>
      <div class="bar-item"><span>Power BI</span><div class="bar"><div class="bar-fill" style="width:75%;background:#ff5500"></div></div></div>
    </div>
    <p class="skill-cat">Recruitment</p>
    <div class="tag-row">
      <span class="tag">LinkedIn Recruiter</span><span class="tag">D&I Hiring</span><span class="tag">Stakeholder Mgmt</span>
      <span class="tag">Agile/Scrum</span><span class="tag">Employer Branding</span><span class="tag">Market Intelligence</span>
      <span class="tag">Direct Sourcing</span><span class="tag">Compensation Benchmarking</span>
    </div>`,

  EDUCATION: `
    <div class="panel-header">
      <div class="panel-icon">🎓</div>
      <div><h2>Education & Certs</h2><p class="subtitle">Academic · Professional</p></div>
    </div>
    <div class="edu-card">
      <div class="edu-icon">🏛️</div>
      <div>
        <strong>MSc Computer Science</strong>
        <p>University of Hertfordshire, UK · 2012</p>
      </div>
    </div>
    <div class="edu-card">
      <div class="edu-icon">🏛️</div>
      <div>
        <strong>BE Information Science</strong>
        <p>GM Institute of Technology · 2009</p>
      </div>
    </div>
    <p class="skill-cat" style="margin-top:16px">Certifications</p>
    <div class="cert-grid">
      <div class="cert">Tech Recruiter Cert<br/><small>hirist.com</small></div>
      <div class="cert">Sourcing Level 1 & 2<br/><small>Recruiting Monk</small></div>
      <div class="cert">D&I & Belonging<br/><small>LinkedIn</small></div>
      <div class="cert">LinkedIn Recruiter<br/><small>LinkedIn</small></div>
      <div class="cert">Cyber Security<br/><small>Axpino Technologies</small></div>
      <div class="cert">Java Beginners<br/><small>Udemy</small></div>
    </div>`,

  AWARDS: `
    <div class="panel-header">
      <div class="panel-icon">🏆</div>
      <div><h2>Awards & Recognition</h2><p class="subtitle">4 Major Milestones</p></div>
    </div>
    <div class="award-card" style="border-color:#ffcc00">
      <div class="award-year">2021</div>
      <div>
        <strong>🏆 Most Promising New Talent (MPNT)</strong>
        <p>TomTom · Recognized for outstanding contribution and rapid impact in EMEA & APAC recruitment.</p>
      </div>
    </div>
    <div class="award-card" style="border-color:#4488ff">
      <div class="award-year">2020</div>
      <div>
        <strong>⭐ Going the Extra Mile Award</strong>
        <p>KellyOCG · For high determination, execution discipline and exceptional business support.</p>
      </div>
    </div>
    <div class="award-card" style="border-color:#22cc88">
      <div class="award-year">2018</div>
      <div>
        <strong>🎖️ Recruiter Honor Award</strong>
        <p>Sunrise Systems · Recognition for mentoring fresh graduates and strong team leadership.</p>
      </div>
    </div>
    <div class="award-card" style="border-color:#ff5500">
      <div class="award-year">2009</div>
      <div>
        <strong>🧠 IBM Great Mind Challenge Winner</strong>
        <p>IBM · National-level technology challenge winner.</p>
      </div>
    </div>`,
};

// ── Raycaster & Hover ──────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false, mouseDownPos = { x: 0, y: 0 };
let panelOpen = false, hoveredCard = null;

window.addEventListener('mousedown', (e) => { mouseDownPos = { x: e.clientX, y: e.clientY }; isDragging = false; });
window.addEventListener('mousemove', (e) => {
  if (Math.abs(e.clientX - mouseDownPos.x) > 5 || Math.abs(e.clientY - mouseDownPos.y) > 5) isDragging = true;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mouseup', (e) => {
  if (isDragging) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const meshes = cards.map(c => c.mesh);
  const hits = raycaster.intersectObjects(meshes);
  if (hits.length > 0) {
    const idx = meshes.indexOf(hits[0].object);
    showPanel(cards[idx].label);
  }
});

function showPanel(label) {
  panelOpen = true;
  controls.autoRotate = false;
  document.getElementById('panel-content').innerHTML = infoData[label] || '';
  document.getElementById('panel').classList.add('active');
  // Animate skill bars
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(b => { b.style.transition = 'width 1s ease'; });
  }, 100);
}

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('panel').classList.remove('active');
  setTimeout(() => { panelOpen = false; controls.autoRotate = true; }, 400);
});

// ── Animate ────────────────────────────────────────────────────────────────
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.005;

  orbGroup.rotation.y += 0.006;
  wireOrb.rotation.x += 0.003;
  ring1.rotation.z += 0.005;
  ring2.rotation.z -= 0.004;
  ring3.rotation.y += 0.007;

  stars1.rotation.y += 0.0003;
  stars2.rotation.y -= 0.0002;

  blueLight.position.x = Math.sin(time) * 10;
  blueLight.position.z = Math.cos(time) * 10;
  orangeLight.position.x = Math.sin(time + Math.PI) * 10;
  orangeLight.position.z = Math.cos(time + Math.PI) * 6;

  // Hover detection
  raycaster.setFromCamera(mouse, camera);
  const meshes = cards.map(c => c.mesh);
  const hits = raycaster.intersectObjects(meshes);
  const newHovered = hits.length > 0 ? meshes.indexOf(hits[0].object) : -1;

  cards.forEach((c, i) => {
    const isHovered = i === newHovered;
    const targetScale = isHovered ? 1.08 : 1.0;
    c.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    c.glowMesh.material.opacity = isHovered ? 0.18 : 0.06;
    c.group.position.y = Math.sin(time + i * 1.2) * 0.35;
  });

  document.body.style.cursor = newHovered >= 0 ? 'pointer' : 'default';

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
