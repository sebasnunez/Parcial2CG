Physijs.scripts.worker = './physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';

var isPaused = false;
//Controles
dir = 0;
var keyboard	= new THREEx.KeyboardState();
function controles(){
    //Jugador
    if(jugador.position.x>-2.4){
        if( keyboard.pressed('left') ){
            dir += -0.3;		
        }
    }
    if(jugador.position.x<2.4){
        if( keyboard.pressed('right') ){
            dir += 0.3;			
        }
    }
    
    if(keyboard.pressed('p')){
        if(isPaused){
            isPaused = false;
            scene.onSimulationResume();
        }
        else{
            isPaused = true;
        }
    }
    
}

var gravity = -5;
var gravityX = 0;
//Escena
var scene = new Physijs.Scene();
scene.fog = new THREE.Fog(0xffffff, 10, 140);
scene.setGravity(new THREE.Vector3( gravityX, gravity, 0));
//Camara
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Stats
var stats;
stats = new Stats();
stats.setMode(2); // 0: fps, 1: ms, 2memory
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "100px";
stats.domElement.style.top = "10px";
document.getElementById("myStats").appendChild(stats.domElement);




//Limites
const Lright = new Physijs.BoxMesh( new THREE.BoxGeometry( 0.5, 8.5, 1), new THREE.MeshBasicMaterial( {color: 0xffffff} ),0 );
Lright.position.x = 4;
const Lleft = new Physijs.BoxMesh( new THREE.BoxGeometry( 0.5, 8.5, 1 ), new THREE.MeshBasicMaterial( {color: 0xffffff} ),0 );
Lleft.position.x = -4;
const Ltop = new Physijs.BoxMesh( new THREE.BoxGeometry( 7.5, 0.5, 1 ), new THREE.MeshBasicMaterial( {color: 0xffffff} ),0 );
Ltop.position.y = 4;
const Lbottom = new Physijs.BoxMesh( new THREE.BoxGeometry( 7.5, 0.5, 1 ), new THREE.MeshBasicMaterial( {color: 0xffffff} ),0 );
Lbottom.position.y = -4;
scene.add(Lright);
scene.add(Lleft);
scene.add(Ltop);
scene.add(Lbottom);
//Geometrias
const cpu = new Physijs.BoxMesh( new THREE.BoxGeometry( 2.5, 0.5, 1 ), new THREE.MeshBasicMaterial( {color: 0x4C1080} ),0 );
cpu.position.y = 3;

const jugador = new Physijs.BoxMesh( new THREE.BoxGeometry( 2.5, 0.5, 1 ), new THREE.MeshBasicMaterial( {color: 0xBF2601} ),0 );
jugador.position.y = -3;

const pelota = new Physijs.SphereMesh(new THREE.SphereGeometry( 0.2, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0x2FCE00}));
scene.add(pelota);
scene.add(cpu);
scene.add(jugador);

//Collisiones
pelota.setCcdSweptSphereRadius(0.19);
pelota.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    gravityX = Math.random()*(5+5) -5;
    scene.setGravity(new THREE.Vector3( gravityX, gravity, 0));
    console.log(other_object.name);
});





var dirC = 0;
function animate() {
    if(!isPaused){
        scene.simulate();
    }
    requestAnimationFrame( animate );
    if(pelota.position.y >= 2.5 ){
        gravity = -5;
        scene.setGravity(new THREE.Vector3( gravityX, gravity, 0));
    }
    if(pelota.position.y <= -2.5 ){
        gravity = 5;
        scene.setGravity(new THREE.Vector3( gravityX, gravity, 0));
    }
    jugador.position.set(dir,-3,0);
    jugador.__dirtyPosition = true;

    
    if(cpu.position.x<=2.4){
        if(cpu.position.x<pelota.position.x){
            dirC+=0.2;
            cpu.position.set(dirC,3,0);
            cpu.__dirtyPosition = true;
        }
    }
    if(cpu.position.x>=-2.4){
        if(cpu.position.x>pelota.position.x){
            dirC-=0.2;
            cpu.position.set(dirC,3,0);
            cpu.__dirtyPosition = true;
        }
    }
    

    
    controles();
    renderer.render( scene, camera );
    stats.update();
}
animate();
