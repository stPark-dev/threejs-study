import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

class App {
  private domApp: Element
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera
  private cube?: THREE.Mesh 

  constructor() {
    console.log('Hello three.js')

    this.domApp = document.querySelector('#app')!
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.domApp.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x00000000, 1, 3.5)

    this.setupCamera()
    this.setupLight()
    this.setupHelpers()
    this.setupModels()
    this.setupControls()
    this.setupEvents()
  }

  private setupCamera() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100)
    this.camera.position.z = 2
  }

  private setupLight() {
    const lights = []
    for (let i = 0; i < 3; i++) {
      lights[i] = new THREE.DirectionalLight(0xffffff, 3)
      this.scene.add(lights[i])
    }

    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)
  }

  private setupHelpers() {
    const axes = new THREE.AxesHelper(10);
    axes.position.y = 0.01; 
    this.scene.add(axes);
  
    const grid = new THREE.GridHelper(5, 20, 0x888888, 0x444444); 
    this.scene.add(grid);
  }

  private setupModels() {
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      flatShading: true, side: THREE.DoubleSide,
      transparent: true, opacity: .75
    })

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, opacity: 0.8
    })

    const args = {
      width: 1,
      height: 1,
      depth: 1,
      widthSegments: 1,
      heightSegments: 1,
      depthSegments: 1
    }

    const createModel = () => {
      const geometry = new THREE.BoxGeometry(args.width, args.height, args.depth, args.widthSegments, args.heightSegments, args.depthSegments)
    const mesh = new THREE.Mesh(geometry, meshMaterial)
    const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial)

    const group = new THREE.Group()

    group.name = "myModel"
    group.add(mesh, line)

    const oldModel = this.scene.getObjectByName("myModel")
    if(oldModel){
      (oldModel.children[0] as THREE.Mesh).geometry.dispose();
      (oldModel.children[1] as THREE.LineSegments).geometry.dispose();
      this.scene.remove(oldModel)
    }

    this.scene.add(group)
    }

    createModel()

    const gui = new GUI();
    const widthController = gui.add(args, "width", 0.1, 10, 0.01).onChange(createModel);
    const heightController = gui.add(args, "height", 0.1, 10, 0.01).onChange(createModel);
    const depthController = gui.add(args, "depth", 0.1, 10, 0.01).onChange(createModel);
    const widthSegmentsController = gui.add(args, "widthSegments", 1, 10, 1).onChange(createModel);
    const heightSegmentsController = gui.add(args, "heightSegments", 1, 10, 1).onChange(createModel);
    const depthSegmentsController = gui.add(args, "depthSegments", 1, 10, 1).onChange(createModel);
  
    // 초기화 버튼 추가
    gui.add({ reset: () => {
      args.width = 1;
      args.height = 1;
      args.depth = 1;
      args.widthSegments = 1;
      args.heightSegments = 1;
      args.depthSegments = 1;
      createModel();  // 모델 재생성
  
      // GUI 컨트롤러 값 업데이트
      widthController.setValue(1);
      heightController.setValue(1);
      depthController.setValue(1);
      widthSegmentsController.setValue(1);
      heightSegmentsController.setValue(1);
      depthSegmentsController.setValue(1);
    } }, 'reset').name('초기화');

  }

  private setupControls() {
    new OrbitControls(this.camera!, this.domApp! as HTMLElement)
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  private resize() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight

    const camera = this.camera
    if(camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
  }

  private update(time: number) {
    time *= 0.001 // ms -> s
    
    // const cube = this.cube
    // const cube = this.scene.getObjectByName("myModel")
    // if(cube) {
    //   cube.rotation.x = time
    //   cube.rotation.y = time
    // }
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()