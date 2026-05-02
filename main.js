import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060612);

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,2,8);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

scene.add(new THREE.AmbientLight(0xffffff,1));

// orb
const orb = new THREE.Mesh(
  new THREE.SphereGeometry(1,32,32),
  new THREE.MeshStandardMaterial({ color:0x4488ff })
);
scene.add(orb);

// cards
const cards = [];
["PROFILE","EXPERIENCE","SKILLS"].forEach((text,i)=>{
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshBasicMaterial({ color:0x222244 })
  );

  mesh.position.set(Math.sin(i*2)*4,0,Math.cos(i*2)*4);
  mesh.lookAt(0,0,0);
  mesh.userData.label = text;

  scene.add(mesh);
  cards.push(mesh);
});

// interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click",(e)=>{
  mouse.x = (e.clientX/innerWidth)*2-1;
  mouse.y = -(e.clientY/innerHeight)*2+1;

  raycaster.setFromCamera(mouse,camera);
  const hit = raycaster.intersectObjects(cards);

  if(hit.length){
    const label = hit[0].object.userData.label;
    openPanel(label);
  }
});

function openPanel(text){
  document.getElementById("panel").classList.add("active");
  document.getElementById("content").innerHTML = text;
}

function closePanel(){
  document.getElementById("panel").classList.remove("active");
}
window.closePanel = closePanel;

// animate
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