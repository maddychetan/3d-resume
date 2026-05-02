import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Scene ────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x05070f, 0.02);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2.5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const point = new THREE.PointLight(0x4488ff, 6, 40);
point.position.set(-8, 8, 6);
scene.add(point);

// ── Card Texture (with outline + profile image) ──────────────────────────
const icons = {
  PROFILE: '👤',
  EXPERIENCE: '💼',
  SKILLS: '⚡',
  EDUCATION: '🎓',
  AWARDS: '🏆'
};

function makeCardTexture(label, hex) {
  const W = 600, H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingQuality = 'high';

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, 'rgba(8,12,30,0.97)');
  bg.addColorStop(1, 'rgba(14,20,50,0.97)');
  ctx.fillStyle = bg;
  roundRect(ctx, 4, 4, W - 8, H - 8, 18, true);

  // Border glow
  ctx.shadowColor = hex;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = hex;
  ctx.lineWidth = 3;
  roundRect(ctx, 4, 4, W - 8, H - 8, 18, false);
  ctx.shadowBlur = 0;

  // Accent line
  ctx.strokeStyle = hex;
  ctx.beginPath();
  ctx.moveTo(40, 30);
  ctx.lineTo(W - 40, 30);
  ctx.stroke();

  // PROFILE image
  if (label === 'PROFILE') {
    const img = new Image();
    img.src = './assets/profile.png';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, 95, 45, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, W / 2 - 45, 50, 90, 90);
      ctx.restore();

      ctx.strokeStyle = hex;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(W / 2, 95, 48, 0, Math.PI * 2);
      ctx.stroke();
    };
  } else {
    ctx.font = '56px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(icons[label] || '★', W / 2, 110);
  }

  // TEXT WITH OUTLINE
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(label, W / 2, 185);

  ctx.shadowColor = hex;
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, W / 2, 185);
  ctx.shadowBlur = 0;

  return new THREE.CanvasTexture(canvas);
}

// Helper for rounded rect
function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}

// ── Cards ────────────────────────────────────────────────────────────────
const sections = [
  { label: 'PROFILE', hex: '#4488ff' },
  { label: 'EXPERIENCE', hex: '#ff5500' },
  { label: 'SKILLS', hex: '#22cc88' },
  { label: 'EDUCATION', hex: '#aa44ff' },
  { label: 'AWARDS', hex: '#ffcc00' }
];

const cards = [];
const group = new THREE.Group();
scene.add(group);

sections.forEach((sec, i) => {
  const tex = makeCardTexture(sec.label, sec.hex);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 2.8),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );

  mesh.position.x = (i - 2) * 5;
  mesh.userData.label = sec.label;

  group.add(mesh);
  cards.push(mesh);
});

// ── Interaction (click → open panel) ─────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cards);

  if (hits.length > 0) {
    const label = hits[0].object.userData.label;
    showPanel(label);
    controls.autoRotate = false;
  }
});

// ── Panel Safe Logic (FIXED) ─────────────────────────────────────────────
const closeBtn = document.getElementById('close-btn');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    const panel = document.getElementById('panel');
    if (panel) panel.classList.remove('active');
    controls.autoRotate = true;
  });
}

function showPanel(label) {
  const panel = document.getElementById('panel');
  const content = document.getElementById('panel-content');

  if (!panel || !content) return;

  content.innerHTML = `<h2>${label}</h2><p>Details coming soon...</p>`;
  panel.classList.add('active');
}

// ── Animate ──────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += 0.0025;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ── Resize ───────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});