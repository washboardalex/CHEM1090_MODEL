//define constructors for bonds and molecules

function molecule(x, y, z) {
    var geometry = new THREE.SphereGeometry( 1, 32  , 32 );
    var material = new THREE.MeshLambertMaterial( {color: 'gray'} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(x, y, z);
    return sphere;
}

function tetrahedralBond(x,y,z) {
    // var material = new THREE.LineBasicMaterial( { color: 'black', linewidth: 10 } );
    // var points = [];
    // points.push( new THREE.Vector3( 0, 0, 0 ) );
    // points.push( new THREE.Vector3( x, y, z ) );
    // var geometry = new THREE.BufferGeometry().setFromPoints( points );
    // var line = new THREE.Line( geometry, material );
    var geometry = new THREE.Geometry();
    var start =  new THREE.Vector3( 0, 0, 0 );
    var end = new THREE.Vector3(x,y,z);
    geometry.vertices.push( start );
    geometry.vertices.push( end );
    var line = new MeshLine();
    line.setGeometry(geometry, function(p) {return .3});
    var material = new MeshLineMaterial({color: 'black'});
    var mesh = new THREE.Mesh( line.geometry, material );
    return mesh;
}

//initialise 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.z = 20;
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor('#e5e5e5');
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

var raycaster = new THREE.Raycaster();

var light = new THREE.PointLight('white', 1, 1000);
light.position.set(0,0,0);
scene.add(light)

var light = new THREE.PointLight( 'white', 1, 100 );
light.position.set( 0, 0, 7 );
scene.add( light );

var group = new THREE.Group();


//add molecule to scene

var molecules = [[0,0,0],[3,3,-3],[3,-3,3],[-3,-3,-3], [-3,3,3]]

for (var i = 0; i < molecules.length; ++i) {
    var coords = molecules[i];
    
    var sphere = molecule(...coords);
    var bond = tetrahedralBond(...coords);

    group.add(sphere);
    group.add(bond);
}

scene.add(group);

//render and animate

// loop
var frame = 0,
maxFrame = 1000;
var loop = function () {

    var per = frame / maxFrame,
    bias = Math.abs(.5 - per) / .5;

    requestAnimationFrame(loop);
    renderer.render(scene, camera);

    group.rotation.set(
        Math.PI * 2 * per,
        Math.PI * 16 * per,
        0);

    frame += .3;
    frame = frame % maxFrame;

};

renderer.render(scene, camera);
loop();
