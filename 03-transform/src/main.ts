import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from 'three'

class App {
  private renderer: THREE.WebGLRenderer
  private domApp: Element
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera
  private cube?: THREE.Mesh

  constructor(){
    console.info("Hello Three.js")
    this.renderer = new THREE.WebGLRenderer({antialias: true })
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

    this.domApp = document.querySelector("#app")!
    this.domApp.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }
  private setupCamera(){
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight 

    this.camera = new THREE.PerspectiveCamera(78, width / height, 0.1, 100)

    new OrbitControls(this.camera, this.domApp as HTMLElement)
}
  private setupLight(){
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)

    this.scene.add(light)
  }
  private setupModels(){
    const geomBox = new THREE.BoxGeometry(1)
    const material = new THREE.MeshStandardMaterial()
    const box = new THREE.Mesh(geomBox, material)
    this.scene.add(box)
  }

  
  private setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()

    this.renderer.setAnimationLoop(this.render.bind(this))
  }
  private resize() {
    const width =  this.domApp?.clientWidth
    const height = this.domApp?.clientHeight

    const camera = this.camera
    if(camera){
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
  }
  
  private update(time: number) {
    time *= 0.001
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()