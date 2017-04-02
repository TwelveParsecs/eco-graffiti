var scene, camera, renderer, light, background, blender, blender_progress, ingredients_added, plane, pointer;
var spheres = [];
var ingredients = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

//modes
var blend = true;
var grabbing = false;
var grabbed_object;
var graffiti = false;
var drawing = false;
var third_button_hover = false;
var growing = false;
var growCounter;

init();
// begin();

function play() {
    $(".content-container").animate({ opacity: 0 }, 1000,  function() { 
        $(".content-container").css("width", "100%");
        $(".content-container").css("height", "100%");
        $(".content-container").css("border-color", "#fff"); 
        $(".content-container").css("border-width", "0");
        $(".first").css("display", "none");
        $(".second").css("display", "block");
        $(".second").css("opacity", 1);
        $(".content-container").css("background-color", "#8CD0C9");
        $(".second_text1").css("display", "block");
        $(".second_text1").css("opacity", 1);
        setTimeout(function(){
            $(".content-container").animate({ opacity: 1 }, 1000,  function() {
                setTimeout(function(){
                    $(".second_text1").animate({ opacity: 0 }, 1000,  function() {
                        $(".second_text1").css("display", "none");
                        $(".second_text2").css("display", "block");
                        setTimeout(function(){
                            $(".second_text2").animate({ opacity: 1 }, 1000,  function() {
                                setTimeout(function(){
                                    $(".second_text2").animate({ opacity: 0 }, 1000,  function() {
                                        $(".second_text2").css("display", "none");
                                        $(".second_text3").css("display", "block");
                                        $(".second_button").css("display", "block");
                                        setTimeout(function(){
                                            $(".second_text3").animate({ opacity: 1 }, 1000);
                                            $(".second_button").animate({ opacity: 1 }, 1000);
                                        }, 500);
                                    });
                                }, 4000);
                            });
                        }, 500);
                    });
                }, 4000);
            });
        }, 500);
    });

}

function begin() {
    $(".content-container").animate({ opacity: 0 }, 1000, function() {
        $(".content-container").css("background-color", "transparent").css("border", "none").css("width", "100%").css("height", "100%").css("pointer-events", "none");
        $(".first").css("display", "none");
        $(".second").css("display", "none");
        $(".third").css("display", "block");
        $(".third_text1").css("display", "block");
        $("canvas").css("display", "block");
        $("canvas").animate({ opacity: 1 }, 1000, function() {
            $(".content-container").animate({ opacity: 1 }, 1000);
        });
    });
}

function growTime() {
    growCounter = spheres.length * 4;
    growing = true;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor ( 0xffffff, 1 );
    document.body.appendChild( renderer.domElement );

    camera.position.set( -50, 0, 0 );
    camera.rotation.set( 0, 0, 0 );

    //background
    var background_geometry = new THREE.PlaneGeometry( 200, 300 );
    var background_material = new THREE.MeshBasicMaterial( {color: 0x666666, side: THREE.DoubleSide} );
    background = new THREE.Mesh( background_geometry, background_material );
    background.position.set( 0, 0, -20 );
    background.rotation.set( 0, 0, Math.PI/2 );
    background.material.transparent = true;
    background.material.opacity = 0;
    scene.add( background );

    //blender
    var blender_geometry = new THREE.CylinderGeometry( 6, 5, 15 );
    var blender_material = new THREE.MeshBasicMaterial( {color: 0xcacaca, depthWrite: false} );
    blender = new THREE.Mesh( blender_geometry, blender_material );
    blender.position.set( -40, 0, -20 );
    blender.material.transparent = true;
    blender.material.opacity = 0.5;
    scene.add( blender );

    var blender_top_geometry = new THREE.CylinderGeometry( 6, 6.5, 1 );
    var blender_top_material = new THREE.MeshBasicMaterial( {color: 0x75AADB} );
    var blender_top = new THREE.Mesh( blender_top_geometry, blender_top_material );
    blender_top.position.set( -40, 8, -20 );
    scene.add( blender_top );

    var blender_bottom_geometry = new THREE.CylinderGeometry( 5, 6, 4 );
    var blender_bottom_material = new THREE.MeshBasicMaterial( {color: 0x75AADB} );
    var blender_bottom = new THREE.Mesh( blender_bottom_geometry, blender_bottom_material );
    blender_bottom.position.set( -40, -9.5, -20 );
    scene.add( blender_bottom );

    //blender progress
    var blender_progress_geometry = new THREE.CylinderGeometry( 4.5, 4.5, 1 );
    var blender_progress_material = new THREE.MeshBasicMaterial( {color: 0x9b7a52} );
    blender_progress = new THREE.Mesh( blender_progress_geometry, blender_progress_material );
    blender_progress.position.set( -40, -7, -20 );
    scene.add( blender_progress );

    //ingredient1
    var ingredient1_map = new THREE.TextureLoader().load( "buttermilk.png" );
    var ingredient1_material = new THREE.SpriteMaterial( { map: ingredient1_map, color: 0xffffff } );
    var ingredient1 = new THREE.Sprite( ingredient1_material );
    ingredient1.position.set( -55, 0, -20 );
    ingredient1.scale.set( 5, 9, 1)
    scene.add( ingredient1 );
    ingredients.push( ingredient1 );

    //ingredient2
    var ingredient2_map = new THREE.TextureLoader().load( "cornsyrup.png" );
    var ingredient2_material = new THREE.SpriteMaterial( { map: ingredient2_map, color: 0xffffff } );
    var ingredient2 = new THREE.Sprite( ingredient2_material );
    ingredient2.position.set( -65, 0, -20 );
    ingredient2.scale.set( 5, 9, 1)
    scene.add( ingredient2 );
    ingredients.push( ingredient2 );

    //ingredient3
    var ingredient3_map = new THREE.TextureLoader().load( "water.png" );
    var ingredient3_material = new THREE.SpriteMaterial( { map: ingredient3_map, color: 0xffffff } );
    var ingredient3 = new THREE.Sprite( ingredient3_material );
    ingredient3.position.set( -55, 10, -20 );
    ingredient3.scale.set( 5, 5, 1)
    scene.add( ingredient3 );
    ingredients.push( ingredient3 );

    //ingredient4
    var ingredient4_map = new THREE.TextureLoader().load( "sugar.png" );
    var ingredient4_material = new THREE.SpriteMaterial( { map: ingredient4_map, color: 0xffffff } );
    var ingredient4 = new THREE.Sprite( ingredient4_material );
    ingredient4.position.set( -62, -10, -20 );
    ingredient4.scale.set( 5, 5, 1)
    scene.add( ingredient4 );
    ingredients.push( ingredient4 );

    //ingredient5
    var ingredient5_map = new THREE.TextureLoader().load( "moss.png" );
    var ingredient5_material = new THREE.SpriteMaterial( { map: ingredient5_map, color: 0xffffff } );
    var ingredient5 = new THREE.Sprite( ingredient5_material );
    ingredient5.position.set( -52, -10, -20 );
    ingredient5.scale.set( 5, 5, 1)
    scene.add( ingredient5 );
    ingredients.push( ingredient5 );

    //pointer
    var pointer_geometry = new THREE.SphereGeometry( 1, 20, 20 );
    var pointer_material = new THREE.MeshBasicMaterial( {color: 0xfafafa} );
    pointer = new THREE.Mesh( pointer_geometry, pointer_material );
    pointer.position.set( 0, 0, -15 );
    pointer.material.transparent = true;
    pointer.material.opacity = 0.5;
    scene.add( pointer );

    //plane
    var plane_geometry = new THREE.PlaneGeometry( 16, 20 );
    var plane_material = new THREE.MeshBasicMaterial( {color: 0xdadada, side: THREE.DoubleSide} );
    plane = new THREE.Mesh( plane_geometry, plane_material );
    plane.position.set( 0, 0, -15 );
    plane.rotation.set( 0, 0, Math.PI/2 );
    scene.add( plane );

    render();
}

function render() {
    requestAnimationFrame(render);

    if( blend ) {
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( scene.children );
        for ( var i = 0; i < intersects.length; i++ ) {
            for ( var x = 0; x < ingredients.length; x++ ) {
                if( intersects[i].object == ingredients[x] && intersects[i].object.position.distanceTo(blender.position) >= 7 && grabbing && !grabbed_object ) {
                    grab( intersects[i].object );
                }
            }

            if( intersects[i].object == background && grabbing && grabbed_object ) {
                grabbed_object.position.set( intersects[i].point.x, intersects[i].point.y, intersects[i].point.z );
                if( grabbed_object.position.distanceTo(blender.position) <= 7 ) {
                    grabbed_object.position.set( blender.position.x, blender.position.y, blender.position.z );
                    grabbing = false;
                    if(!ingredients_added){
                        ingredients_added = 1;
                    } else {
                        ingredients_added++;
                    }
                }
            }
        }

        if( ingredients_added && blender_progress.scale.y < (14/5)*ingredients_added ) {
            blender_progress.scale.y += (14/5)/30;
            blender_progress.position.y += (((14/5)/30)/2);
        }

        if( blender_progress.scale.y >= (14/5)*5 ) {
            blend = false;
            setTimeout(function() {
                $(".third_text1").animate({ opacity: 0 }, 1000, function() {
                    $(".third_text1").css("display", "none");
                    graffiti = true;
                    $(".content-container").css("opacity", "0").css("background-color", "#fff");
                    $(".content-container").animate({ opacity: 1 }, 500, function() {
                        setTimeout(function() {
                            camera.position.set( 0, 0, 0 );
                            $(".content-container").animate({ opacity: 0 }, 1000, function() {
                                $(".third_text2").css("display", "block");
                                $(".third_button").css("display", "block");
                                $(".third_button").hover(function() {
                                    third_button_hover = true;
                                }, function() {
                                    third_button_hover = false;
                                });
                                $(".content-container").css("pointer-events", "auto").css("background-color", "transparent").animate({ opacity: 1 }, 1000);
                            });
                        }, 500);
                    });
                });
            }, 500)
        }
    }

    if( graffiti ) {
        // if( camera.position.x < 0 ) {
        //     camera.position.x += 0.3;
        // } else {
            if( !growing ) {
                raycaster.setFromCamera( mouse, camera );
                var intersects = raycaster.intersectObjects( scene.children );
                for ( var i = 0; i < intersects.length; i++ ) {
                    if( intersects[i].object == plane ) {
                        pointer.position.set( intersects[i].point.x, intersects[i].point.y, intersects[i].point.z );
                    }
                }
            }

            if(drawing) draw();
            if(growing) {
                if(growCounter == 0) {
                    growing = false;
                    $(".third_button").animate({ opacity: 0 }, 1000, function() {
                        $(".third_button").css("display", "none");
                    });

                    $(".third").animate({ opacity: 0 }, 1000, function() {
                        $(".third_text2").css("display", "none");
                        $(".third").css("background-color", "rgba(255, 255, 255, 0.7)").css("padding", "calc((100vh - 181px)/2) 100px");
                        $(".third_text3").css("padding", 0).css("display", "block").css("opacity", 1);
                        $(".third").animate({ opacity: 1 }, 1000);
                    });
                } else {
                    grow();
                    growCounter--;
                }
            }
        // }
    }

    renderer.render(scene, camera);
}

function grab( object ) {
    grabbed_object = object;
}

function draw() {
    var geometry = new THREE.SphereGeometry( 1, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0x9b7a52} );
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( pointer.position.x, pointer.position.y, pointer.position.z );
    scene.add( sphere );
    spheres.push( sphere );
}

window.addEventListener( 'mousemove', function(){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

window.addEventListener( 'mousedown', function(){
    if( blend ) {
        grabbing = true;
    } else if( graffiti && !third_button_hover && !growing && growCounter != 0) {
        drawing = true;
    }
});

window.addEventListener( 'mouseup', function(){
    if( blend ) {
        grabbing = false;
        grabbed_object = false;
    } else if( graffiti ) {
        drawing = false;
    }
});

function grow() {
    var growingSpheres = [   spheres[Math.floor((Math.random() * spheres.length))],
                             spheres[Math.floor((Math.random() * spheres.length))],
                             spheres[Math.floor((Math.random() * spheres.length))],
                             spheres[Math.floor((Math.random() * spheres.length))],
                             spheres[Math.floor((Math.random() * spheres.length))]
                         ];

    for( i = 0; i < growingSpheres.length; i++ ) {
        for(y = 0; y < growingSpheres[i].geometry.vertices.length; y++) {
            //move vertices
            growingSpheres[i].geometry.computeFaceNormals();
            growingSpheres[i].geometry.computeVertexNormals();
            growingSpheres[i].geometry.dynamic = true;
            growingSpheres[i].geometry.verticesNeedUpdate = true;
            var verticePos = new THREE.Vector3(growingSpheres[i].geometry.vertices[y].x, growingSpheres[i].geometry.vertices[y].y, growingSpheres[i].geometry.vertices[y].z);
            var spherePos = new THREE.Vector3(growingSpheres[i].position.x, growingSpheres[i].position.y, growingSpheres[i].position.z);
            var direction = verticePos.sub( spherePos );
            growingSpheres[i].geometry.vertices[y].x += Math.random() * direction.x * 0.005;
            growingSpheres[i].geometry.vertices[y].y += Math.random() * direction.y * 0.005;
            growingSpheres[i].geometry.vertices[y].z += Math.random() * direction.z * 0.005;

            //change color
            if( growingSpheres[i].material.color.r > 0.18 ) growingSpheres[i].material.color.r -= 0.0002;
            if( growingSpheres[i].material.color.g > 0.38 ) growingSpheres[i].material.color.g -= 0.0002;
            if( growingSpheres[i].material.color.b > 0.14 ) growingSpheres[i].material.color.b -= 0.0002;
        }
    }
}