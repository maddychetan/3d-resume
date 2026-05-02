import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 20, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 30;
controls.minDistance = 3;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const blueLight = new THREE.PointLight(0x4488ff, 3, 30);
blueLight.position.set(-8, 8, 5);
scene.add(blueLight);

const orangeLight = new THREE.PointLight(0xff6622, 2, 25);
orangeLight.position.set(8, 4, 5);
scene.add(orangeLight);

const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
topLight.position.set(0, 10, 5);
scene.add(topLight);

// Floating particles background
const particleCount = 300;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 60;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x4488ff, size: 0.08, transparent: true, opacity: 0.6 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Sections data
const sections = [
  { label: 'PROFILE', color: 0x4488ff },
  { label: 'EXPERIENCE', color: 0xff6622 },
  { label: 'SKILLS', color: 0x22cc88 },
  { label: 'EDUCATION', color: 0xaa44ff },
  { label: 'AWARDS', color: 0xffcc00 },
];

const cards = [];
const cardGroup = new THREE.Group();
scene.add(cardGroup);

// Card creation
function createCard(index, total) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.lookAt(0, 0, 0);

  // Card face
  const geo = new THREE.BoxGeometry(3.8, 2.2, 0.08);
  const mat = new THREE.MeshStandardMaterial({
    color: sections[index].color,
    transparent: true,
    opacity: 0.15,
    roughness: 0.1,
    metalness: 0.8,
  });
  const card = new THREE.Mesh(geo, mat);
  group.add(card);

  // Card border glow
  const edgeGeo = new THREE.EdgesGeometry(geo);
  const edgeMat = new THREE.LineBasicMaterial({ color: sections[index].color, linewidth: 2 });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);
  group.add(edges);

  cards.push(group);
  cardGroup.add(group);
}

sections.forEach((_, i) => createCard(i, sections.length));

// Central sphere (logo)
const sphereGeo = new THREE.IcosahedronGeometry(1.2, 1);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0x4488ff,
  wireframe: true,
  transparent: true,
  opacity: 0.6,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const innerSphereGeo = new THREE.SphereGeometry(0.9, 32, 32);
const innerSphereMat = new THREE.MeshStandardMaterial({
  color: 0x112244,
  roughness: 0.2,
  metalness: 0.9,
  transparent: true,
  opacity: 0.9,
});
const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
scene.add(innerSphere);

// Orbit rings
function createRing(radius, color, tilt) {
  const geo = new THREE.TorusGeometry(radius, 0.02, 8, 80);
  const mat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.4, metalness: 1 });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = tilt;
  scene.add(ring);
  return ring;
}
const ring1 = createRing(2.2, 0x4488ff, Math.PI / 4);
const ring2 = createRing(2.8, 0xff6622, -Math.PI / 3);

// HTML Overlay UI
const overlay = document.getElementById('overlay');

const infoData = {
  PROFILE: `<h2>Chetan Holiyappa</h2>
    <p><strong>Strategic Talent Partner</strong> | 10+ Years Experience</p>
    <p>📍 Bengaluru &nbsp;|&nbsp; ✉️ Chaytonah@gmail.com</p>
    <p>Product, SaaS & Technology hiring specialist. Expert in scalable recruitment, automation, and AI-assisted hiring workflows.</p>`,

  EXPERIENCE: `<h2>Experience</h2>
    <div class="item"><strong>Global TA Partner</strong> — Resilinc <span>Feb 2024 – Present</span></div>
    <p>AI-assisted hiring, Lever ATS automation, SeekOut & Talent Neuron sourcing.</p>
    <div class="item"><strong>Senior Recruiter</strong> — Mitratech <span>Feb 2023 – Jul 2023</span></div>
    <p>Java, .Net, Automation, Product Owner roles. Greenhouse ATS super-user.</p>
    <div class="item"><strong>TA Specialist, EMEA & APAC</strong> — TomTom <span>May 2021 – Dec 2022</span></div>
    <p>D&I hiring +20%, offer acceptance ratio 95%, drop ratio reduced from 40% → 10%.</p>
    <div class="item"><strong>Senior IT Recruitment Consultant</strong> — KellyOCG <span>Jan 2019 – Apr 2021</span></div>
    <p>Multi-client APAC hiring: Citi, Ford & more.</p>`,

  SKILLS: `<h2>Skills</h2>
    <div class="skills-grid">
      <span>AI-Assisted Hiring</span><span>Lever ATS</span><span>Greenhouse ATS</span>
      <span>Juicebox</span><span>ChatGPT</span><span>SeekOut</span>
      <span>Talent Neuron</span><span>Power BI</span><span>LinkedIn Recruiter</span>
      <span>D&I Hiring</span><span>Stakeholder Mgmt</span><span>Agile/Scrum</span>
      <span>Employer Branding</span><span>Market Intelligence</span><span>Workflow Automation</span>
    </div>`,

  EDUCATION: `<h2>Education & Certifications</h2>
    <div class="item"><strong>MSc Computer Science</strong> — University of Hertfordshire, 2012</div>
    <div class="item"><strong>BE Information Science</strong> — GM Institute of Technology, 2009</div>
    <br/>
    <p><strong>Certifications:</strong></p>
    <p>Tech Recruiter Cert · Sourcing Level 1 & 2 · D&I LinkedIn · LinkedIn Recruiter · Talent Sourcing · Cyber Security · Java (Udemy)</p>`,

  AWARDS: `<h2>Awards & Recognition</h2>
    <div class="item">🏆 <strong>Most Promising New Talent</strong> — TomTom, Jul 2021</div>
    <div class="item">⭐ <strong>Going the Extra Mile Award</strong> — KellyOCG, Aug 2020</div>
    <div class="item">🎖️ <strong>Recruiter Honor Award</strong> — Sunrise Systems, Jun 2018</div>
    <div class="item">🧠 <strong>IBM Great Mind Challenge Winner</strong> — IBM, Jun 2009</div>`,
};

// Raycasting for click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cards.map(c => c.children[0]));
  if (hits.length > 0) {
    const idx = cards.findIndex(c => c.children[0] === hits[0].object);
    showPanel(sections[idx].label);
  }
});

function showPanel(label) {
  const panel = document.getElementById('panel');
  const content = document.getElementById('panel-content');
  content.innerHTML = infoData[label] || '';
  panel.classList.add('active');
}

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('panel').classList.remove('active');
});

// Labels using CSS
cards.forEach((card, i) => {
  const div = document.createElement('div');
  div.className = 'card-label';
  div.textContent = sections[i].label;
  div.style.color = `#${sections[i].color.toString(16).padStart(6, '0')}`;
  document.getElementById('labels').appendChild(div);
});

// Animation
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

  // Float cards
  cards.forEach((card, i) => {
    card.position.y = Math.sin(time + i * 1.2) * 0.3;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
