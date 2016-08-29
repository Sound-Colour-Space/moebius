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
  camera = new THREE.PerspectiveCamera( 35, 1.6, 500, 10000 );
  camera.position.y = 1500;

  // controls
  controls = new THREE.OrbitControls( camera );

  scene = new THREE.Scene();

  var light, object, materials;

  scene.add( new THREE.AmbientLight( 0x404040 ) );

  light = new THREE.PointLight( 0xffffff );
  light.position.set( 30, 600, 0 );
  scene.add( light );

  var map1 = THREE.ImageUtils.loadTexture( 'textures/test.jpg' );
  map1.wrapS = map1.wrapT = THREE.RepeatWrapping;
  map1.anisotropy = 16;

  var map2 = THREE.ImageUtils.loadTexture( 'textures/text-back.jpg' );
  map2.wrapS = map2.wrapT = THREE.RepeatWrapping;
  map2.anisotropy = 16;

  var map3 = THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' );
  map3.wrapS = map3.wrapT = THREE.RepeatWrapping;
  map3.anisotropy = 16;

  materials = [
    new THREE.MeshLambertMaterial( { ambient: 0xffffff, map: map1, side: THREE.BackSide } ),
    new THREE.MeshLambertMaterial( { ambient: 0xffffff, map: map1, side: THREE.FrontSide} )
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

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

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
    stats.update();
}

function render() {
    mobiusStrip.rotation.z = mobiusStrip.rotation.z + .004;
    mobiusStrip.rotation.y = Math.sin($.now()/1000)/10;
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