import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

interface IGeometryHelper {
  createGeometry: () => THREE.BufferGeometry
  createGUI: (update: () => void) => void
}

class BoxGeometryHelper implements IGeometryHelper {
  private args = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  }
  createGeometry() {
    return new THREE.BoxGeometry(this.args.width, this.args.height, this.args.depth, this.args.widthSegments, this.args.heightSegments, this.args.depthSegments)
  }
  createGUI(update: () => void) {
    const gui = new GUI();
    const widthController = gui.add(this.args, "width", 0.1, 10, 0.01).onChange(update);
    const heightController = gui.add(this.args, "height", 0.1, 10, 0.01).onChange(update);
    const depthController = gui.add(this.args, "depth", 0.1, 10, 0.01).onChange(update);
    const widthSegmentsController = gui.add(this.args, "widthSegments", 1, 10, 1).onChange(update);
    const heightSegmentsController = gui.add(this.args, "heightSegments", 1, 10, 1).onChange(update);
    const depthSegmentsController = gui.add(this.args, "depthSegments", 1, 10, 1).onChange(update);

    // 초기화 버튼 추가
    gui.add({ reset: () => {
      this.args.width = 1;
      this.args.height = 1;
      this.args.depth = 1;
      this.args.widthSegments = 1;
      this.args.heightSegments = 1;
      this.args.depthSegments = 1;
      update();  // 모델 재생성

      // GUI 컨트롤러 값 업데이트
      widthController.setValue(1);
      heightController.setValue(1);
      depthController.setValue(1);
      widthSegmentsController.setValue(1);
      heightSegmentsController.setValue(1);
      depthSegmentsController.setValue(1);
    } }, 'reset').name('초기화');
  }
}

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

    const geometryHelper = new BoxGeometryHelper()

    const createModel = () => {
    const geometry = geometryHelper.createGeometry()
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
    geometryHelper.createGUI(createModel)
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