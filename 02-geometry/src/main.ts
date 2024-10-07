import './style.css'
import * as THREE from "three"

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

    this.setupCamera()
    this.setupLight()
    this.setupModels()
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
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this.scene.add(light)
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

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const mesh = new THREE.Mesh(geometry, meshMaterial)
    const line = new THREE.LineSegments(geometry, lineMaterial)

    const group = new THREE.Group()

    group.name = "myModel"
    group.add(mesh, line)

    this.scene.add(group)

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
    const cube = this.scene.getObjectByName("myModel")
    if(cube) {
      cube.rotation.x = time
      cube.rotation.y = time
    }
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()