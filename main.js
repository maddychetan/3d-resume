import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* SCENE */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060612);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,2,10);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

/* LIGHT */
scene.add(new THREE.AmbientLight(0xffffff,0.5));

/* ORB */
const orb = new THREE.Mesh(
  new THREE.SphereGeometry(1,32,32),
  new THREE.MeshStandardMaterial({ color:0x4488ff })
);
scene.add(orb);

/* CARD */
const cards = [];
const labels = ["PROFILE","EXPERIENCE","SKILLS"];

labels.forEach((label,i)=>{
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3,2),
    new THREE.MeshBasicMaterial({ color:0x111133 })
  );

  mesh.position.set(Math.sin(i)*5,0,Math.cos(i)*5);
  mesh.lookAt(0,0,0);

  mesh.userData.label = label;
  scene.add(mesh);
  cards.push(mesh);
});

/* DATA */
const infoData = {
  PROFILE: `
    <div class="panel-header">
      <div class="panel-icon">👤</div>
      <div>
        <h3>Chetan Holiyappa</h3>
        <p class="subtitle">Talent Architect</p>
      </div>
    </div>

    <div class="contact-row">
      <a href="tel:+917338025205">📞 Call</a>
      <a href="mailto:chaytonah@gmail.com">✉️ Mail</a>
      <a href="https://linkedin.com" target="_blank">🔗 LinkedIn</a>
    </div>

    <p>AI-driven hiring specialist building scalable recruitment systems.</p>

    <div class="tag-row">
      <span class="tag">AI Hiring</span>
      <span class="tag">ATS</span>
      <span class="tag">SaaS</span>
    </div>
  `
};

/* INTERACTION */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click",(e)=>{
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse,camera);
  const hit = raycaster.intersectObjects(cards);

  if(hit.length){
    const label = hit[0].object.userData.label;

    document.getElementById("panel-content").innerHTML = infoData[label] || "Coming soon";
    document.getElementById("panel").classList.add("active");

    /* orb reaction */
    orb.scale.set(1.3,1.3,1.3);
    setTimeout(()=>orb.scale.set(1,1,1),300);
  }
});

/* CLOSE */
document.getElementById("close-btn").onclick = ()=>{
  document.getElementById("panel").classList.remove("active");
};

/* ANIMATE */
function animate(){
  requestAnimationFrame(animate);

  orb.rotation.y += 0.01;
  controls.update();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});