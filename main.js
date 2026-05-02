import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,2,12);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff,0.6));

// CARDS
const labels = ["PROFILE","EXPERIENCE","SKILLS","EDUCATION","AWARDS"];
const group = new THREE.Group();
scene.add(group);

labels.forEach((label,i)=>{
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "#0b1230";
  ctx.fillRect(0,0,600,300);

  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#000";
  ctx.strokeText(label,300,160);

  ctx.fillStyle = "#fff";
  ctx.fillText(label,300,160);

  const texture = new THREE.CanvasTexture(canvas);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4,2.5),
    new THREE.MeshBasicMaterial({ map:texture, transparent:true })
  );

  mesh.position.x = (i-2)*5;
  mesh.userData.label = label;

  group.add(mesh);
});

// CLICK EVENT
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click',(e)=>{
  mouse.x = (e.clientX/innerWidth)*2-1;
  mouse.y = -(e.clientY/innerHeight)*2+1;

  raycaster.setFromCamera(mouse,camera);
  const hits = raycaster.intersectObjects(group.children);

  if(hits.length>0){
    showPanel(hits[0].object.userData.label);
    controls.autoRotate = false;
  }
});

// PANEL FIX
const closeBtn = document.getElementById('close-btn');
if(closeBtn){
  closeBtn.addEventListener('click',()=>{
    document.getElementById('panel').classList.remove('active');
    controls.autoRotate = true;
  });
}

// PANEL CONTENT
function showPanel(label){
  const panel = document.getElementById('panel');
  const content = document.getElementById('panel-content');

  if(!panel || !content) return;

  content.innerHTML = `
    <h2>Chetan Holiyappa</h2>
    <p><b>Strategic Talent Partner - 10+ Years</b></p>

    <p>
      📞 +91-7338025205<br>
      ✉️ Chaytonah@gmail.com<br>
      🔗 <a href="https://www.linkedin.com/in/caholiyappa/" target="_blank">LinkedIn</a>
    </p>

    <p>
      Product, SaaS & Technology hiring specialist with deep expertise in ATS automation 
      and AI-assisted workflows. Known for scaling hiring globally and stakeholder collaboration.
    </p>
  `;

  panel.classList.add('active');
}

// ANIMATION
function animate(){
  requestAnimationFrame(animate);
  group.rotation.y += 0.003;
  controls.update();
  renderer.render(scene,camera);
}
animate();

// RESIZE
window.addEventListener('resize',()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

});