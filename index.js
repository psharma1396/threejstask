import * as THREE from './three.js-master/build/three.module.js';
import {
    OBJLoader
} from './three.js-master/examples/jsm/loaders/OBJLoader.js';

document.addEventListener("DOMContentLoaded", function (event) {

    let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
    camera.position.set(10, 99, 150);

    var sliderValue = document.getElementById("sliderValue");

    let scene = new THREE.Scene();
    scene.background = new THREE.Color('silver');


    const canvas = document.getElementById('canvas-main');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let renderer = new THREE.WebGLRenderer({
        canvas
    });
    renderer.setSize(window.innerWidth/2 + 10 , window.innerHeight/2);

    const manager = new THREE.LoadingManager()
    var modelObj = null; 
    new OBJLoader(manager)
        .load('./model.obj', function (obj) {
            obj.position.y = 100;
            obj.position.z = -11;
            obj.position.x = 11;
            obj.name = "main_obb";
            obj.scale.set(10, 10, 10);
            scene.add(obj);
            modelObj = obj;
        });

    var slider = document.getElementById("slider");
    slider.addEventListener("input", function () {
        sliderValue.innerHTML = "Day:" + slider.value;

        console.log(slider.value);

        //This colors the child to white
        function colorChildW(child){
            child.material = new THREE.MeshBasicMaterial({
                color : "white"
            });
        }

        //This colors the child to green
        function colorChildG(child){
            child.material = new THREE.MeshBasicMaterial({
                color : "green"
            });
        }

        //This traverses the child
        function traverser(n,child){
            var i = 0;
            while(i < n){
                colorChildW(modelObj.children[i]);
                i++;
            }
            colorChildG(child);
        }

        scene.getObjectByName('main_obb').traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: "white"
                });

                //Child color should be white if slider reaches 16
                if (slider.value >= 16) {
                    traverser(4,modelObj.children[4]);
                    colorChildW(modelObj.children[4]);

                } else if (child.name === 'Column1' && slider.value <= 2) {
                    //For the slider value less than or equal to 2, 0th element is under construction
                    traverser(0,child);

                } else if (child.name === 'Column2' && slider.value >= 3 && slider.value <= 4) {
                    //For the slider value between 3 and 4, 1st element is under construction
                    traverser(1,child);
                } else if (child.name === 'Column3' && slider.value >= 5 && slider.value <= 8) {
                    //For the slider value between 5 and 8, 2nd element is under construction
                    traverser(2,child);
                } else if (child.name === 'Column4' && slider.value >= 9 && slider.value <= 11) {
                    //For the slider value between 9 and 11, 3rd element is under construction
                    traverser(3,child);
                } else if (child.name === 'Slab' && slider.value >= 12 && slider.value <= 15) {
                    //For the slider value between 12 and 15, 4th element is under construction
                    traverser(4,child);
                }
                if (slider.value == 0) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: "white"
                    });
                }
            }
        });
    });
    
    var dl = new THREE.DirectionalLight('white', 0.6);
    dl.position.set(-5, 11, 5);
    scene.add(dl);

    animate();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
});
