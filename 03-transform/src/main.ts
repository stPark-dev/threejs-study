import { Font, OrbitControls, ParametricGeometries, ParametricGeometry, TextGeometry, TTFLoader } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { degToRad } from 'three/src/math/MathUtils.js'

interface IGeometryHelper {
  createGeometry: () => THREE.BufferGeometry
  createGUI: (update: () => void) => void
}

class ParametricGeometryHelper implements IGeometryHelper {
  private args = {
    slices: 25,
    stacks: 25,
  }
  public createGeometry() {
    const funcUV = ParametricGeometries.plane(10, 10)
    const geometry = new ParametricGeometry(
      funcUV,
      this.args.slices,
      this.args.stacks
    )
    geometry.center()
    geometry.scale(0.1, 0.1, 0.1)
    return geometry
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "slices", 1, 128, 1).onChange(update);
    gui.add(this.args, "stacks", 1, 128, 1).onChange(update);
  }
}

class LatheGeometryHelper implements IGeometryHelper {
  private args = {
    segments: 12,
    phiStart: 0,
    phiLength: 360,
  }
  public createGeometry() {
    const points = []

    for(let i = 0; i < 20; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * 0.2) * 7 * (i / 20) + 5,
          (i - 10) * 2
        )
      )
    }
    const geometry = new THREE.LatheGeometry(
      points,
      this.args.segments,
      degToRad(this.args.phiStart),
      degToRad(this.args.phiLength)
    )
    geometry.scale(0.04, 0.04, 0.04)
    return geometry
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "segments", 1, 30).onChange(update);
    gui.add(this.args, "phiStart", 0, 360).onChange(update);
    gui.add(this.args, "phiLength", 0, 360).onChange(update);
  }
}

class TextGeometryHelper implements IGeometryHelper {
  private args = {
    text: "안녕하세요.",
    size: .5,
    height: .1,
    curveSegments: 2,
    bevelSegments: 3,
    bevelThickness: 0.1,
    bevelSize: .01,
    bevelOffset: 0,
    bevelEnabled: true
  }
  private font: Font

  constructor(font: Font) {
    this.font = font
  }

  public createGeometry() {
    const geometry = new TextGeometry(this.args.text, {
      font: this.font,
      ...this.args
    }) 
    geometry.center()
    return geometry
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "text").onChange(update);
    gui.add(this.args, "size", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "height", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "curveSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelThickness", 0.01, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelSize", 0.01, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelOffset", -1, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelEnabled").onChange(update);
  }
}

class ExtrudeGeometryHelper implements IGeometryHelper {
  private args = {
    steps: 2,
    depth: .5,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: .1,
    bevelOffset: 0,
    curveSegments: 12,
    bevelSegments: 1
  }
  public createGeometry() {
    const x = 0, y = 0;
    const shape = new THREE.Shape()
    shape.moveTo(x + 5, y + 5)
    shape.bezierCurveTo(x+5,y+5,x+4,y,x,y)
    shape.bezierCurveTo(x-6,y,x-6,y+7,x-6,y+7)
    shape.bezierCurveTo(x-6,y+11,x-3,y+15.4,x+5,y+19)
    shape.bezierCurveTo(x+12,y+15.4,x+16,y+11,x+16,y+7)
    shape.bezierCurveTo(x+16,y+7,x+16,y,x+10,y)
    shape.bezierCurveTo(x+7,y,x+5,y+5,x+5,y+5)
    
    const geometry = new THREE.ExtrudeGeometry(shape, this.args)
    geometry.center()
    geometry.scale(0.1, -0.1, 1)

    return geometry
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "steps", 1, 10, 1).onChange(update);
    gui.add(this.args, "depth", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "bevelEnabled").onChange(update);
    gui.add(this.args, "bevelThickness", 0, 1, 0.01).onChange(update);
    gui.add(this.args, "bevelSize", 0, 1, 0.01).onChange(update);
    gui.add(this.args, "bevelOffset", -4, 5, 0.01).onChange(update);
    gui.add(this.args, "curveSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelSegments", 1, 32, 1).onChange(update);
  }
}

class SphereGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    widthSegments: 32,
    heightSegments: 16,
    phiStart: 0,
    phiLength: 360,
    thetaStart: 0,
    thetaLength: 180
  }
  public createGeometry() {
    return new THREE.SphereGeometry(
      this.args.radius,
      this.args.widthSegments,
      this.args.heightSegments,
      degToRad(this.args.phiStart),
      degToRad(this.args.phiLength),
      degToRad(this.args.thetaStart),
      degToRad(this.args.thetaLength),
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 1, 2, 0.01).onChange(update);
    gui.add(this.args, "widthSegments", 2, 30, 1).onChange(update);
    gui.add(this.args, "heightSegments", 3, 200, 1).onChange(update);
    gui.add(this.args, "phiStart", 2, 30, 1).onChange(update);
    gui.add(this.args, "phiLength", 3, 200, 1).onChange(update);
    gui.add(this.args, "thetaStart", 0, 360).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360).onChange(update);
  }
}

class TorusGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    tube: 0.3,
    radialSegments: 16,
    tabularSegments: 100,
    arc: 360,
  }
  public createGeometry() {
    return new THREE.TorusGeometry(
      this.args.radius,
      this.args.tube,
      this.args.radialSegments,
      this.args.tabularSegments,
      degToRad(this.args.arc),
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 1, 2, 0.01).onChange(update);
    gui.add(this.args, "tube", 1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 2, 30, 1).onChange(update);
    gui.add(this.args, "tabularSegments", 3, 200, 1).onChange(update);
    gui.add(this.args, "arc", 0.1, 360).onChange(update);
  }
}
class CylinderGeometryHelper implements IGeometryHelper {
  private args = {
    radiusTop: .5,
    radiusBottom: .5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360,
  }
  public createGeometry() {
    return new THREE.CylinderGeometry(
      this.args.radiusTop,
      this.args.radiusBottom,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength),
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radiusTop", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "radiusBottom", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "height", 1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 3, 64, 1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "openEnded").onChange(update);
    gui.add(this.args, "thetaStart", 0, 360).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360).onChange(update);
  }
}

class ConeGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 0.5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360,
  }
  public createGeometry() {
    return new THREE.ConeGeometry(
      this.args.radius,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength),
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 0.1, 10, 0.01).onChange(update);
    gui.add(this.args, "height", 0.1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "openEnded").onChange(update);
    gui.add(this.args, "thetaStart", 0, 360, 0.1).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360, 0.1).onChange(update);
  }
}

class CircleGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    segments: 32,
    thetaStart: 0,
    thetaLength: 360,
  }
  public createGeometry() {
    return new THREE.CircleGeometry(
      this.args.radius,
      this.args.segments,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength),
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI()
    gui.add(this.args, "radius", 0.1, 10, 0.01).onChange(update);
    gui.add(this.args, "segments", 1, 64, 1).onChange(update);
    gui.add(this.args, "thetaStart", 0, 360, 0.1).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360, 0.1).onChange(update);
  }
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
    this.scene.fog = new THREE.Fog(0x00000000, 1, 7.5)

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

  private async setupModels() {
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      flatShading: true, side: THREE.DoubleSide,
      transparent: true, opacity: .75
    })

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, opacity: 0.8
    })

    //const geometryHelper = new BoxGeometryHelper()
    // const geometryHelper = new CircleGeometryHelper()
    // const geometryHelper = new ConeGeometryHelper()
    // const geometryHelper = new CylinderGeometryHelper()
    // const geometryHelper = new TorusGeometryHelper()
    // const geometryHelper = new SphereGeometryHelper()
    // const geometryHelper = new ExtrudeGeometryHelper()

    // const json = await new TTFLoader().loadAsync("./GowunDodum-Regular.ttf")
    // const font = new Font(json)
    // const geometryHelper = new TextGeometryHelper(font)

    // const geometryHelper = new LatheGeometryHelper()

    const geometryHelper = new ParametricGeometryHelper()

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