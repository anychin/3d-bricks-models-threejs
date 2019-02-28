// standard global variables
var container, scene, camera, renderer, controls, stats, phi = 0;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var android, brick;

var directionalLight, directionalLight2, pointLight, ambientLight, spotLight;

var mouseX = 0;
var mouseY = 0;

var targetX = 0, targetY = 0;


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var drug = false;

init();

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );
animate();

// FUNCTIONS
function init()
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);

	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	/*var width = SCREEN_WIDTH || 2;
	var height = SCREEN_HEIGHT || 2;
	effect = new THREE.AnaglyphEffect( renderer );
	effect.setSize( width, height );*/
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	/*controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 5.0;
	controls.zoomSpeed = 5;
	controls.panSpeed = 2;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;*/
	// STATS
	/*stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );*/
	// LIGHT
	ambientLight = new THREE.AmbientLight( 0x444444 );
	scene.add( ambientLight );

	//

	pointLight = new THREE.PointLight( 0xffffff, 1.5, 1000 );
	pointLight.color.setHSL( 0.05, 1, 0.95 );
	pointLight.position.set( 0, 0, 600 );

	scene.add( pointLight );

	// shadow for PointLight

	spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
	spotLight.position.set( 0.05, 0.05, 1 );
	spotLight.color.setHSL( 0.6, 1, 0.95 );
	scene.add( spotLight );

	spotLight.position.multiplyScalar( 700 );

	spotLight.castShadow = true;
	spotLight.onlyShadow = true;
	// spotLight.shadowCameraVisible = true;

	spotLight.shadowMapWidth = 2048;
	spotLight.shadowMapHeight = 2048;

	spotLight.shadowCameraNear = 200;
	spotLight.shadowCameraFar = 1500;

	spotLight.shadowCameraFov = 40;

	spotLight.shadowBias = -0.005;
	spotLight.shadowDarkness = 0.35;

	//

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
	directionalLight.position.set( 1, -0.5, 1 );
	directionalLight.color.setHSL( 0.08, 1, 0.95 );
	scene.add( directionalLight );

	//

	directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLight2.position.set( 1, -0.5, -1 );
	directionalLight2.color.setHSL( 0.08, 1, 0.825 );
	scene.add( directionalLight2 );

	directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.9 );
	directionalLight3.position.set( 10, 500, -1 );
	directionalLight3.color.setHSL( 0.08, 1, 0.825 );
	scene.add( directionalLight3 );



	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/1.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	// /scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	////////////
	// CUSTOM //
	////////////

	// Note: if imported model appears too dark,
	//   add an ambient light in this file
	//   and increase values in model's exported .js file
	//    to e.g. "colorAmbient" : [0.75, 0.75, 0.75]

	var loader = new THREE.ColladaLoader();
	loader.load('bricks/brick3/brick.dae', function (result) {
		brick = result.scene;
		brick.scale.set(60,60,60);
		brick.position.set(0,00,0);
		brick.rotation.x = 1.3;
		brick.rotation.y = 0.5;
		brick.rotation.z = 0.2;
	  	scene.add(brick);
	});


}

function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) * 1;
				mouseY = ( event.clientY - windowHalfY ) * 1;

			}


function addModelToScene( geometry, materials )
{
	var material = new THREE.MeshFaceMaterial( materials );
	android = new THREE.Mesh( geometry, material );
	android.scale.set(60,60,60);
	scene.add( android );
}

function onDocumentMouseDown(event) {
	drug = true;
}

function onDocumentMouseUp(event) {
	drug = false;
}

function animate()
{
  requestAnimationFrame( animate );
	render();
	update();

}

function update()
{
	if ( keyboard.pressed("z") ) {
		//controls.update();
		//stats.update();
	}
}

function render()
{
	if(drug == true) {
		targetX = mouseX * .005;
		targetY = mouseY * .005;
		brick.rotation.y += 0.05 * ( targetX - brick.rotation.y );
		brick.rotation.x += 0.05 * ( targetY - brick.rotation.x );
	}
	brick.position.y = Math.sin( phi ) * 5;
	phi+= 0.05;
	renderer.render( scene, camera );
}
