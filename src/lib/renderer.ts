import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * @class Renderer
 * @description Encapsula la configuración base de Three.js, incluyendo cámara, motor de renderizado,
 * controles de órbita y monitoreo de rendimiento.
 */
export class Renderer {
  /** Escena principal de Three.js */
  public scene: THREE.Scene;
  /** Cámara con perspectiva configurada para el canvas */
  private camera: THREE.PerspectiveCamera;
  /** Motor de renderizado WebGL optimizado */
  private renderer: THREE.WebGLRenderer;
  /** Monitor de estadísticas (FPS, MS, MB) */
  private stats: Stats;
  /** Controles de navegación en el espacio 3D */
  private controls: OrbitControls;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // El Aspect Ratio (width / height) evita que los objetos se vean estirados al cambiar el tamaño
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // Suaviza los bordes de los objetos (anti-aliasing)
    });
    this.renderer.setSize(width, height);
    
    // Limita la resolución a un máximo de 2 para evitar lag en pantallas 4K/Retina ultra densas
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Añade inercia al movimiento (se siente más "orgánico")
    this.controls.dampingFactor = 0.05;

    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.left = "0";
    this.stats.dom.style.top = "0";
    (canvas.parentElement ?? document.body).appendChild(this.stats.dom);

    window.addEventListener("resize", () => this.onWindowResize());
  }

  render(): void {
    // Actualiza la inercia de los controles en cada frame
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  /**
   * Ciclo de vida de la animación. 
   * requestAnimationFrame es preferible sobre setInterval porque se sincroniza con los Hz del monitor.
   */
  animate(callback: () => void): void {
    const loop = () => {
      this.stats.begin();
      callback();
      this.render();
      this.stats.end();
      requestAnimationFrame(loop);
    };
    loop();
  }

  clear(): void {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  /**
   * Reajusta el mundo 3D cuando el usuario cambia el tamaño del navegador. 
   * Importante: Se debe actualizar tanto el renderizador como la matriz de proyección de la cámara.
   */
  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Limpieza de memoria del motor (GPU y Eventos).
   * Este método detiene el motor de renderizado y libera los controles.
   */
  dispose(): void {
    window.removeEventListener("resize", () => this.onWindowResize());
    this.controls.dispose();
    this.renderer.dispose();
    this.stats.dom.remove();
  }
}
