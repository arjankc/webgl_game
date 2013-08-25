var render, projector, renderer, scene, camera, theta,
	radius, objectHolder, difference, cube, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10, cube11, cube12, cube13, cube14, cubeHolder, sphereObs,
	sphere1, sphere2, sphere3, sphere4, sphere5;

var counterPoints = 0;
var counterPointsNeg = 0;

var amountOfPoints =10;

var spline = new THREE.SplineCurve3([
    new THREE.Vector3(-20,  0, 0),
    new THREE.Vector3(  0, 20, 0),
    new THREE.Vector3( 20,  0, 0)
]);



var range = 400, speed = 1, sphereSize = 4;

var obstacles = [];

var obstaclesNeg = [];


	var 	animOffset      = 0,   // starting frame of animation
	        duration        = 1000, // milliseconds to complete animation
	  		keyframes       = 12,   // total number of animation frames = SEE THE FILE OF MODEL !
	  		interpolation   = duration / keyframes, // milliseconds per frame
	  		lastKeyframe    = 0,    // previous keyframe
	  		currentKeyframe = 0,
	  		bird,bird_material;

	var clock = new THREE.Clock();
	var position = 0;

	var controls = {
	                left: false,
	                up: false,
	                right: false,
	                down: false
	            };
	var direction = new THREE.Vector3(0, 0, 0);

	var step =0;

	var rays = [
	                new THREE.Vector3(0, 0, 1),
	                new THREE.Vector3(1, 0, 1),
	                new THREE.Vector3(1, 0, 0),
	                new THREE.Vector3(1, 0, -1),
	                new THREE.Vector3(0, 0, -1),
	                new THREE.Vector3(-1, 0, -1),
	                new THREE.Vector3(-1, 0, 0),
	                new THREE.Vector3(-1, 0, 1)
	        ];
	var caster = new THREE.Raycaster();

	function initScene(){
			projector = new THREE.Projector;

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize( 	jQuery(window).width() -30,
								jQuery(window).height() - 30 );
			document.getElementById( 'viewport' ).appendChild( renderer.domElement );

			scene = new THREE.Scene();

			//Camera
			camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight,1,1000);
		   	camera.position.set( 160, 50, 160 );
		   	camera.lookAt( scene.position );
		   	scene.add( camera );

		   	//lights
		   	light = new THREE.DirectionalLight( 0xFFFFFF );
		   	light.position.set( 100, 0, 100 );
		   	scene.add( light );

			var jsonLoader = new THREE.JSONLoader();
			jsonLoader.load( "models/stork.js", function(geometry, materials){

			  if ( geometry.morphColors && geometry.morphColors.length ) {
			    var colorMap = geometry.morphColors[ 0 ];

			    for ( var i = 0; i < colorMap.colors.length; i ++ ) {
			      geometry.faces[ i ].color = colorMap.colors[ i ];
			      geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );
			    }
			  }

			  geometry.computeMorphNormals();
			  addModelToScene(geometry, materials);

			});
			
			objectHolder = new THREE.Object3D();

			scene.add(objectHolder);
			
			addCubes();
			addSphere();

			theBase();

			testObstacle();

			///////////////////////

			//Text COde

			var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
				var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
				var materialArray = [ materialFront, materialSide ];
				var textGeom = new THREE.TextGeometry( "Start", 
				{
					size: 30, height: 4, curveSegments: 3,
					font: "helvetiker", weight: "bold", style: "normal",
					bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
					material: 0, extrudeMaterial: 1
				});
				// font: helvetiker, gentilis, droid sans, droid serif, optimer
				// weight: normal, bold
				
				var textMaterial = new THREE.MeshFaceMaterial(materialArray);
				var textMesh = new THREE.Mesh(textGeom, textMaterial );
				
				textGeom.computeBoundingBox();
				var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
				
				textMesh.position.set(  50, 50, 100 );
				textMesh.rotation.y = -Math.PI;
				scene.add(textMesh);

			//////////////////////
			
			control_check();



			requestAnimationFrame(render);
	}

	function testObstacle(){
		sphereObs = new THREE.Mesh(new THREE.SphereGeometry( 30, 30, 32),
			   new THREE.MeshLambertMaterial( {color: 0xff00ff} ));
		scene.add(sphereObs);
	}

	function theBase(){
		var z_value_floor = 0;
		for(var i=0; i<=150;i++){
			var floorBase = new THREE.Mesh(new THREE.CubeGeometry( 200, 50, 5), 
							new THREE.MeshPhongMaterial({
							        // intermediate
							        color: '#ffff00',
							        shininess: 100,
							        opacity:0.2,
							        transparent: 0.2,
							        wireframe: true
							}));
			floorBase.position.set(0, -80, (i)*58);
			floorBase.rotation.x = -Math.PI / 2;
			scene.add(floorBase);

			z_value_floor = z_value_floor + 1;
		}

	}

	function addSphere(){
		sphere1 = new THREE.Mesh(new THREE.SphereGeometry( 12, 12, 10),
			   new THREE.MeshLambertMaterial( {color: 0x000000} ));
		sphere1.position.set(	-30, 0, 420);
		scene.add(sphere1);

		sphere2 = new THREE.Mesh(new THREE.SphereGeometry( 12, 12, 10),
			   new THREE.MeshLambertMaterial( {color: 0x000000} ));
		sphere2.position.set( 30, 0, 840);
		scene.add(sphere1);

		sphere3 = new THREE.Mesh(new THREE.SphereGeometry( 12, 12, 10),
			   new THREE.MeshLambertMaterial( {color: 0x000000} ));
		sphere3.position.set( -30, 0, 1240);
		scene.add(sphere3);

		sphere4 = new THREE.Mesh(new THREE.SphereGeometry( 12, 12, 10),
			   new THREE.MeshLambertMaterial( {color: 0x000000} ));
		sphere4.position.set( 30, 0, 1600);
		scene.add(sphere4);
	}

	function addCubes(){
		cube = new THREE.Mesh(new THREE.CubeGeometry( 12, 12, 16),
			   new THREE.MeshLambertMaterial( {color: 0x0000ff} ));
		cube.position.set(	0, 0, 500);
		scene.add(cube);

		cube2 = new THREE.Mesh(new THREE.CubeGeometry( 16, 16, 16),
			   new THREE.MeshLambertMaterial( {color: 0xffffff} ));
		cube2.position.set(	15, 0, 1000);
		scene.add(cube2);

		cube3 = new THREE.Mesh(new THREE.CubeGeometry( 18, 18, 16),
			   new THREE.MeshLambertMaterial( {color: 0xcccccc} ));
		cube3.position.set(	10, 0, 1500);
		scene.add(cube3);

		cube4 = new THREE.Mesh(new THREE.CubeGeometry( 7, 7, 16),
			   new THREE.MeshLambertMaterial( {color: 0x00ff00} ));
		cube4.position.set(	-50, 0, 2000);
		scene.add(cube4);

		cube5 = new THREE.Mesh(new THREE.CubeGeometry( 9, 9, 16),
			   new THREE.MeshLambertMaterial( {color: 0x0000ff} ));
		cube5.position.set(	30, 0, 2500);
		scene.add(cube5);

		cube6 = new THREE.Mesh(new THREE.CubeGeometry( 13, 13, 16),
			   new THREE.MeshLambertMaterial( {color: 0xff0000} ));
		cube6.position.set(	50, 0, 3000);
		scene.add(cube6);

		cube7 = new THREE.Mesh(new THREE.CubeGeometry( 16, 16, 16),
			   new THREE.MeshLambertMaterial( {color: 0xf3f3f3} ));
		cube7.position.set(	25, 0, 3500);
		scene.add(cube7);

		///////////////////////////////////////////////////////////

		cube8 = new THREE.Mesh(new THREE.CubeGeometry( 16, 16, 16),
			   new THREE.MeshLambertMaterial( {color: 0x00ff00} ));
		cube8.position.set(	50, 0, 4000);
		scene.add(cube8);

		cube9 = new THREE.Mesh(new THREE.CubeGeometry( 14, 14, 16),
			   new THREE.MeshLambertMaterial( {color: 0xffffff} ));
		cube9.position.set(	-50, 0, 4500);
		scene.add(cube9);

		cube10 = new THREE.Mesh(new THREE.SphereGeometry( 12, 12, 16),
			   new THREE.MeshLambertMaterial( {color: 0xcccccc} ));
		cube10.position.set(	30, 0, 5000);
		scene.add(cube10);

		cube11 = new THREE.Mesh(new THREE.CubeGeometry( 10, 10, 16),
			   new THREE.MeshLambertMaterial( {color: 0x00ff00} ));
		cube11.position.set(	-50, 0, 5500);
		scene.add(cube11);

		cube12 = new THREE.Mesh(new THREE.SphereGeometry( 16, 16, 16),
			   new THREE.MeshLambertMaterial( {color: 0x0000ff} ));
		cube12.position.set(	30, 0, 6000);
		scene.add(cube12);

		cube13 = new THREE.Mesh(new THREE.CubeGeometry( 11, 11, 16),
			   new THREE.MeshLambertMaterial( {color: 0xff0000} ));
		cube13.position.set(	50, 0, 6500);
		scene.add(cube13);

		cube14 = new THREE.Mesh(new THREE.CubeGeometry( 16, 16, 16),
			   new THREE.MeshLambertMaterial( {color: 0xf3f3f3} ));
		cube14.position.set(	25, 0, 7000);
		scene.add(cube14);
	}

	function getObstacles(){
		return	obstacles.concat(cube, cube2, cube3, cube4, cube5, cube6, cube7, 
								 cube8, cube9, cube10, cube11, cube12, cube13, cube14);
	}

	function getObstaclesNeg(){
		return	obstaclesNeg.concat(sphere1, sphere2, sphere3, sphere4);
	}

	function set_focus(object){
		
	}


	function control_check(){
		jQuery(document).keydown(function (e) {
		    var prevent = true;
		    // Update the state of the attached control to "true"
		    switch (e.keyCode) {
		        case 37:
		            controls.left = true;
		        break;
		        case 38:
		            controls.up = true;
		        break;
		    	case 39:
		            controls.right = true;
		        break;
		        case 40:
		            controls.down = true;
		        break;
		        default:
		            prevent = false;
		    }
		    // Avoid the browser to react unexpectedly
		    if (prevent) {
		        e.preventDefault();
		    } else {
		        return;
		    }
		    // Update the character's direction
		        setDirection(controls);
		});

		jQuery(document).keyup(function (e) {
		    var prevent = true;
		    // Update the state of the attached control to "true"
		    switch (e.keyCode) {
		        case 37:
		            controls.left = false;
		        break;
		        case 38:
		            controls.up = false;
		        break;
		    	case 39:
		            controls.right = false;
		        break;
		        case 40:
		            controls.down = false;
		        break;
		        default:
		            prevent = false;
		    }
		    // Avoid the browser to react unexpectedly
		    if (prevent) {
		        e.preventDefault();
		    } else {
		        return;
		    }
		    // Update the character's direction
		        setDirection(controls);
		});
	}

	function setDirection(controls){
		'use strict';
		// Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
		var z = controls.left ? 1 : controls.right ? -1 : 0,
			y = controls.down ? 1 : 0,
		    x = controls.up ? 1 : controls.down ? -1 : 0;
		direction.set(x, y, z);
	}

	function motion(){
		'use strict';
		// (if any)

		collide();
		if (direction.x !== 0 || direction.z !== 0) {
		    // Rotate the character
		    rotate();
		    // And, only if we're not colliding with an obstacle or a wall ...
		    if (collide2()) {
		        return false;
		    }
		    // ... we move the character
		    move();
		    return true;
		}
	}

	function collide2(){
		return false;
	}

	function rotate(){
		'use strict';
	}

	function move(){
		'use strict';
		// We update our Object3D's position from our "direction"
		objectHolder.position.z += direction.x * ((direction.z === 0) ? 14 : Math.sqrt(14));
		objectHolder.position.x += direction.z * ((direction.x === 0) ? 14 : Math.sqrt(14));
	}

	function collide(){
		'use strict';
		
		var collisions, i,
		// Maximum distance from the origin before we consider collision
		distance = 32,
		obstacles = getObstacles();
		obstaclesNeg = getObstaclesNeg();
		// Get the obstacles array from our world
		
		// For each ray
		for (i = 0; i < rays.length; i += 1) {
		    // We reset the raycaster to this direction
		    caster.set(objectHolder.position, rays[i]);
		    // Test if we intersect with any obstacle mesh
		    collisions = caster.intersectObjects(obstacles);
			// And disable that direction if we do
		    if (collisions.length > 0 && collisions[0].distance <= distance) {
		    	
		        // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
		        if ((i === 0 || i === 1 || i === 7) && direction.z === 1) {
		            // direction.setZ(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints + 1;
		            $("#counterValue").html(counterPoints);
		        } else if ((i === 3 || i === 4 || i === 5) && direction.z === -1) {
		            // direction.setZ(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints + 1;
		            $("#counterValue").html(counterPoints);
		        }
		        if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
		            // direction.setX(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints + 1;
		            $("#counterValue").html(counterPoints);
		        } else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {
		            // direction.setX(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints + 1;
		            $("#counterValue").html(counterPoints);
		        } else if (i === 0 || direction.z === 1){
		        	scene.remove( collisions[0].object );
		        	counterPoints = counterPoints + 1;
		            $("#counterValue").html(counterPoints);
		        }
		    }
		}



		// For each ray
		for (i = 0; i < rays.length; i += 1) {
		    // We reset the raycaster to this direction
		    caster.set(objectHolder.position, rays[i]);
		    // Test if we intersect with any obstacle mesh
		    collisions = caster.intersectObjects(obstaclesNeg);
			// And disable that direction if we do
		    if (collisions.length > 0 && collisions[0].distance <= distance) {
		    	
		        // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
		        if ((i === 0 || i === 1 || i === 7) && direction.z === 1) {
		            // direction.setZ(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints - 1;
		            $("#counterValue").html(counterPoints);
		        } else if ((i === 3 || i === 4 || i === 5) && direction.z === -1) {
		            // direction.setZ(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints - 1;
		            $("#counterValue").html(counterPoints);
		        }
		        if ((i === 1 || i === 2 || i === 3) && direction.x === 1) {
		            // direction.setX(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints - 1;
		            $("#counterValue").html(counterPoints);
		        } else if ((i === 5 || i === 6 || i === 7) && direction.x === -1) {
		            // direction.setX(0);
		            scene.remove( collisions[0].object );
		            counterPoints = counterPoints - 1;
		            $("#counterValue").html(counterPoints);
		        } else if (i === 0 || direction.z === 1){
		        	scene.remove( collisions[0].object );
		        	counterPoints = counterPoints - 1;
		            $("#counterValue").html(counterPoints);
		        }
		    }
		}
		
	}

	function addModelToScene( geometry, materials ){

		for (var i = 0; i < materials.length; i++) {
		  materials[i].morphTargets = true;
		}

		bird_material  = new THREE.MeshPhongMaterial
		    ({ 
		      color: 0xffffff, morphTargets: true, morphNormals: true, 
		      vertexColors: THREE.FaceColors, shading: THREE.SmoothShading 
		    });

		bird = new THREE.Mesh( geometry,bird_material );
		bird.castShadow  = true;

		objectHolder.add(bird);

		bird.scale.set(0.3,0.3,0.3);
		bird.rotation.set(0,6.2,0);
		bird.position.set(0,0,0);
	}


	function render(t) {

		var delta = clock.getDelta();

		if(bird){
			var time = t % duration;
			var keyframe = Math.floor( time / interpolation ) + animOffset;
			if ( keyframe != currentKeyframe ){
			  bird.morphTargetInfluences[ lastKeyframe ] = 0;
			  bird.morphTargetInfluences[ currentKeyframe ] = 1;
			  bird.morphTargetInfluences[ keyframe ] = 0;
			  lastKeyframe = currentKeyframe;
			  currentKeyframe = keyframe;
			}
			bird.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
			bird.morphTargetInfluences[ lastKeyframe ] = 1 - bird.morphTargetInfluences[ keyframe ];

			light.target.position.copy( objectHolder.position );
			light.position.addVectors( light.target.position, new THREE.Vector3( 200, 200, -150 ) );

		}

		//Cube rotation

		cube.rotation.x -= 0.2;
		cube2.rotation.x -= 0.2;
		cube3.rotation.y -= 0.2;
		cube4.rotation.x -= 0.2;
		cube5.rotation.x -= 0.2;
		cube6.rotation.y -= 0.2;
		cube7.rotation.x -= 0.2;
		cube8.rotation.x -= 0.2;
		cube9.rotation.y -= 0.2;
		cube10.rotation.x -= 0.2;
		cube11.rotation.x -= 0.2;
		cube12.rotation.x -= 0.2;
		cube13.rotation.y -= 0.2;
		cube14.rotation.x -= 0.2;


		for(var i = 0; i < 10; i += 0.5){
		    var t = spline.getUtoTmapping(i / 10);
		    sphereObs.position.setX(spline.getPoint(t));
		}

		

			


		motion();

		objectHolder.position.z += 5;


		camera.position.set(
			objectHolder.position.x, 
			objectHolder.position.y + 128,
			objectHolder.position.z - 256
			);

		camera.lookAt(objectHolder.position);

		requestAnimationFrame( render );
		renderer.render( scene, camera );
		
	}

	window.onload = initScene;