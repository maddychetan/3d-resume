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
controls.autoRotate = true;

// ── Lights ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const blueLight = new THREE.PointLight(0x4477ff, 6, 35);
blueLight.position.set(-10, 10, 5);
scene.add(blueLight);

// ── CARD TEXTURE (UPDATED) ────────────────────────────────────────────────
const icons = { PROFILE: '👤', EXPERIENCE: '💼', SKILLS: '⚡', EDUCATION: '🎓', AWARDS: '🏆' };

function makeCardTexture(label, hex) {
  const W = 600, H = 320;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingQuality = "high";

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, 'rgba(8,12,30,0.97)');
  bg.addColorStop(1, 'rgba(14,20,50,0.97)');
  ctx.fillStyle = bg;
  ctx.roundRect(4, 4, W - 8, H - 8, 18);
  ctx.fill();

  // Border glow
  ctx.shadowColor = hex;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = hex;
  ctx.lineWidth = 3;
  ctx.roundRect(4, 4, W - 8, H - 8, 18);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Accent line
  ctx.strokeStyle = hex;
  ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(W - 40, 30); ctx.stroke();

  // PROFILE IMAGE
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
    ctx.fillText(icons[label], W / 2, 110);
  }

  // ===== FINAL TEXT =====
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

// ── CARDS ────────────────────────────────────────────────────────────────
const sections = [
  { label: 'PROFILE', hex: '#4488ff' },
  { label: 'EXPERIENCE', hex: '#ff5500' },
  { label: 'SKILLS', hex: '#22cc88' },
  { label: 'EDUCATION', hex: '#aa44ff' },
  { label: 'AWARDS', hex: '#ffcc00' },
];

const group = new THREE.Group();
scene.add(group);

sections.forEach((sec, i) => {
  const tex = makeCardTexture(sec.label, sec.hex);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2.5),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  mesh.position.x = (i - 2) * 5;
  group.add(mesh);
});

// ── ANIMATION ─────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();