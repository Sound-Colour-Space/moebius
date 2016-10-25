global.$       = global.jQuery = require('jquery');
var foundation = require('../../node_modules/foundation-sites/dist/foundation.js');

$(document).foundation();

console.log('start');


var stats;
var camera, scene, renderer;

init();
animate();

var mobiusStrip;

function init() {
  camera = new THREE.PerspectiveCamera( 35, 1.6, 1, 10000 );
  camera.position.y = 1500;

  doRotate = false;

  // controls
  controls = new THREE.OrbitControls( camera );

  scene = new THREE.Scene();

  var light, object, materials;

  scene.add( new THREE.AmbientLight( 0x404040 ) );

  light = new THREE.PointLight( 0xffffff );
  light.position.set( 30, 600, 0 );
  scene.add( light );

  var front = THREE.ImageUtils.loadTexture( 'textures/moebius_front.jpg' );
  front.wrapS = front.wrapT = THREE.RepeatWrapping;
  front.anisotropy = 16;

  var back = THREE.ImageUtils.loadTexture( 'textures/moebius_back.jpg' );
  back.wrapS = back.wrapT = THREE.RepeatWrapping;
  back.anisotropy = 16;

  materials = [
  new THREE.MeshLambertMaterial( { ambient: 0xffffff, map: front, side: THREE.BackSide } ),
  new THREE.MeshLambertMaterial( { ambient: 0xffffff, map: back, side: THREE.FrontSide } )
    //new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, transparent: true, opacity: 0.6, side: THREE.FrontSide } ),
    //new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: false, transparent: false, opacity: 0.6, side: THREE.DoubleSide } ),
    //new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.6, side: THREE.FrontSide } ),
    ];

    //var heightScale = 1;
    //var p = 2;
    //var q = 3;
    //var radius = 150, tube = 10, segmentsR = 50, segmentsT = 20;

    console.log(THREE.ParametricGeometries);
    var geo;

  // Mobius Strip

  geo = new THREE.ParametricGeometry( THREE.ParametricGeometries.mobius, 40, 40 );
  mobiusStrip = THREE.SceneUtils.createMultiMaterialObject( geo, materials );
  mobiusStrip.position.set( 0, 0, -150 );
  mobiusStrip.rotation.x = -100;
  mobiusStrip.scale.multiplyScalar( 200 );
  scene.add( mobiusStrip );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  /*
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
  */

  window.addEventListener( 'resize', onWindowResize, false );

  $(document).keydown(function(e){
    if (e.keyCode==32)
        doRotate = !doRotate;
});

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
    //stats.update();
}

function render() {
    if (doRotate) {
        mobiusStrip.rotation.z = mobiusStrip.rotation.z + .004;
        mobiusStrip.rotation.y = Math.sin($.now()/1000)/10;
    }
    renderer.render( scene, camera );
}

function updateText(text) {

}

/*
var canvas = $("canvas");

var xOff=0, yOff=0;

for(var obj = canvas; obj != null; obj = obj.offsetParent) {
    xOff += obj.scrollLeft - obj.offsetLeft;
    yOff += obj.scrollTop - obj.offsetTop;
}
*/