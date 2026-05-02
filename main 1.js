import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 20, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 30;
controls.minDistance = 3;

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const blueLight = new THREE.PointLight(0x4488ff, 4, 30);
blueLight.position.set(-8, 8, 5);
scene.add(blueLight);
const orangeLight = new THREE.PointLight(0xff6622, 3, 25);
orangeLight.position.set(8, 4, 5);
scene.add(orangeLight);

const particleGeo = new THREE.BufferGeometry();
const pos = new Float32Array(600);
for (let i = 0; i < 600; i++) pos[i] = (Math.random() - 0.5) * 60;
particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x4488ff, size: 0.07, transparent: true, opacity: 0.5 }));
scene.add(particles);

const sphere = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.2, 1),
  new THREE.MeshStandardMaterial({ color: 0x4488ff, wireframe: true, transparent: true, opacity: 0.7 })
);
scene.add(sphere);
scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(0.85, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x112244, roughness: 0.2, metalness: 0.9 })
));

function makeRing(r, color, tilt) {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(r, 0.02, 8, 80),
    new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.4 })
  );
  m.rotation.x = tilt;
  scene.add(m);
  return m;
}
const ring1 = makeRing(2.2, 0x4488ff, Math.PI / 4);
const ring2 = makeRing(2.8, 0xff6622, -Math.PI / 3);

function makeCardTexture(label, hex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 256);
  ctx.strokeStyle = hex;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 236);
  const icons = { PROFILE: '👤', EXPERIENCE: '💼', SKILLS: '⚡', EDUCATION: '🎓', AWARDS: '🏆' };
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(icons[label] || '★', 256, 90);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Arial';
  ctx.fillText(label, 256, 168);
  ctx.fillStyle = hex;
  ctx.font = '22px Arial';
  ctx.fillText('CLICK TO EXPLORE', 256, 218);
  return new THREE.CanvasTexture(canvas);
}

const sections = [
  { label: 'PROFILE',    color: 0x4488ff, hex: '#4488ff' },
  { label: 'EXPERIENCE', color: 0xff6622, hex: '#ff6622' },
  { label: 'SKILLS',     color: 0x22cc88, hex: '#22cc88' },
  { label: 'EDUCATION',  color: 0xaa44ff, hex: '#aa44ff' },
  { label: 'AWARDS',     color: 0xffcc00, hex: '#ffcc00' },
];

const cards = [];
const cardGroup = new THREE.Group();
scene.add(cardGroup);

sections.forEach((sec, i) => {
  const angle = (i / sections.length) * Math.PI * 2;
  const group = new THREE.Group();
  group.position.set(Math.sin(angle) * 6, 0, Math.cos(angle) * 6);
  group.lookAt(0, 0, 0);

  const tex = makeCardTexture(sec.label, sec.hex);
  const cardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 2.2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
  group.add(cardMesh);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(3.9, 2.3, 0.05),
    new THREE.MeshStandardMaterial({ color: sec.color, transparent: true, opacity: 0.08 })
  );
  box.position.z = -0.03;
  group.add(box);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.9, 2.3, 0.05)),
    new THREE.LineBasicMaterial({ color: sec.color })
  );
  edges.position.z = -0.03;
  group.add(edges);

  cards.push({ group, mesh: cardMesh, label: sec.label });
  cardGroup.add(group);
});

const infoData = {
  PROFILE: `<h2>Chetan Holiyappa</h2>
    <p><strong>Strategic Talent Partner</strong> | 10+ Years</p>
    <p>📍 Bengaluru &nbsp;|&nbsp; ✉️ Chaytonah@gmail.com</p>
    <p>📞 +91-7338025205</p>
    <p>Product, SaaS & Technology hiring specialist. Expert in scalable recruitment, automation, and AI-assisted hiring workflows.</p>
    <p><a href="https://www.linkedin.com/in/caholiyappa/" target="_blank" style="color:#4488ff">LinkedIn Profile →</a></p>`,

  EXPERIENCE: `<h2>Experience</h2>
    <div class="item"><strong>Global TA Partner</strong> — Resilinc <span>Feb 2024 – Present</span></div>
    <p>AI-assisted hiring, Lever ATS automation, SeekOut & Talent Neuron sourcing.</p>
    <div class="item"><strong>Senior Recruiter</strong> — Mitratech <span>Feb 2023 – Jul 2023</span></div>
    <p>Java, .Net, Automation, Product Owner roles. Greenhouse ATS super-user.</p>
    <div class="item"><strong>TA Specialist EMEA & APAC</strong> — TomTom <span>May 2021 – Dec 2022</span></div>
    <p>D&I +20%, offer acceptance 95%, drop ratio 40% to 10%.</p>
    <div class="item"><strong>Senior IT Recruitment Consultant</strong> — KellyOCG <span>Jan 2019 – Apr 2021</span></div>
    <p>Multi-client APAC: Citi, Ford & more.</p>
    <div class="item"><strong>Lead Technical Recruiter</strong> — Sunrise Systems <span>Feb 2016 – Dec 2018</span></div>`,

  SKILLS: `<h2>Skills</h2>
    <div class="skills-grid">
      <span>AI-Assisted Hiring</span><span>Lever ATS</span><span>Greenhouse ATS</span>
      <span>Juicebox</span><span>ChatGPT</span><span>SeekOut</span>
      <span>Talent Neuron</span><span>Power BI</span><span>LinkedIn Recruiter</span>
      <span>D&I Hiring</span><span>Stakeholder Mgmt</span><span>Agile/Scrum</span>
      <span>Employer Branding</span><span>Market Intelligence</span><span>Workflow Automation</span>
    </div>`,

  EDUCATION: `<h2>Education & Certifications</h2>
    <div class="item"><strong>MSc Computer Science</strong> — University of Hertfordshire <span>2012</span></div>
    <div class="item"><strong>BE Information Science</strong> — GM Institute of Technology <span>2009</span></div>
    <br/>
    <p><strong>Certifications:</strong></p>
    <div class="item">Tech Recruiter Cert — hirist.com</div>
    <div class="item">Sourcing Level 1 & 2 — Recruiting Monk</div>
    <div class="item">Diversity, Inclusion & Belonging — LinkedIn</div>
    <div class="item">Cyber Security Investigation — Axpino Technologies</div>
    <div class="item">Java for Beginners — Udemy</div>`,

  AWARDS: `<h2>Awards & Recognition</h2>
    <div class="item">🏆 <strong>Most Promising New Talent</strong> — TomTom <span>Jul 2021</span></div>
    <div class="item">⭐ <strong>Going the Extra Mile Award</strong> — KellyOCG <span>Aug 2020</span></div>
    <div class="item">🎖️ <strong>Recruiter Honor Award</strong> — Sunrise Systems <span>Jun 2018</span></div>
    <div class="item">🧠 <strong>IBM Great Mind Challenge Winner</strong> — IBM <span>Jun 2009</span></div>`,
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let mouseDownPos = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => { mouseDownPos = { x: e.clientX, y: e.clientY }; isDragging = false; });
window.addEventListener('mousemove', (e) => {
  if (Math.abs(e.clientX - mouseDownPos.x) > 5 || Math.abs(e.clientY - mouseDownPos.y) > 5) isDragging = true;
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
  document.getElementById('panel-content').innerHTML = infoData[label] || '';
  document.getElementById('panel').classList.add('active');
}

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('panel').classList.remove('active');
});

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.005;
  sphere.rotation.y += 0.008;
  sphere.rotation.x += 0.003;
  ring1.rotation.z += 0.004;
  ring2.rotation.z -= 0.003;
  cardGroup.rotation.y += 0.003;
  particles.rotation.y += 0.0005;
  blueLight.position.x = Math.sin(time) * 8;
  blueLight.position.z = Math.cos(time) * 8;
  orangeLight.position.x = Math.sin(time + Math.PI) * 8;
  orangeLight.position.z = Math.cos(time + Math.PI) * 5;
  cards.forEach((c, i) => { c.group.position.y = Math.sin(time + i * 1.2) * 0.3; });
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
