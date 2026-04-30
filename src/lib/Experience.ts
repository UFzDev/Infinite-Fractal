import * as THREE from "three";
import GUI from "lil-gui";
import { Renderer } from "./renderer";
import { Time } from "./Time";

// Shaders
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

/**
 * @class Experience
 * @description Motor Fractal con Solucionador de Punto Fijo Dinámico para Estabilidad Total.
 */
export class Experience {
  private renderer: Renderer;
  private time: Time;
  private gui: GUI;
  private scene: THREE.Scene;

  private fractalMesh: THREE.Mesh;
  private fractalMaterial: THREE.ShaderMaterial;

  private config = {
    juliaCX: -0.77568377,
    juliaCY: 0.13646737,
    zoomProgress: 0.0,
    zoomSpeed: 0.12,
    baseZoom: 10.0,
    power: 2.0, // Ahora estable gracias al solver
    colorOffset: 0.0,
    isZooming: true
  };

  constructor(canvas: HTMLCanvasElement) {
    this.time = new Time();
    this.renderer = new Renderer(canvas);
    this.scene = this.renderer.scene;
    this.gui = new GUI({ title: "Ajustes" });

    this.fractalMaterial = this.createMaterial();

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.fractalMesh = new THREE.Mesh(geometry, this.fractalMaterial);
    this.scene.add(this.fractalMesh);

    this.initGUI();
    this.start();

    window.addEventListener("resize", () => {
      this.fractalMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });
  }

  private createMaterial(): THREE.ShaderMaterial {
    const params = this.calculateLoopParams(this.config.juliaCX, this.config.juliaCY, this.config.power);

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uJuliaC: { value: new THREE.Vector2(this.config.juliaCX, this.config.juliaCY) },
        uFixedPoint: { value: new THREE.Vector2(params.fixedPointReal, params.fixedPointImag) },
        uLogScale: { value: params.logScale },
        uRotationStep: { value: params.rotationStep },
        uZoomProgress: { value: 0 },
        uBaseZoom: { value: this.config.baseZoom },
        uPower: { value: this.config.power },
        uColorOffset: { value: this.config.colorOffset }
      }
    });
  }

  /**
   * Solucionador Dinámico para z^n + c = z
   * Utiliza el método de Newton para encontrar el punto fijo repulsivo y calcular su multiplicador.
   */
  private calculateLoopParams(cx: number, cy: number, n: number) {
    // 1. Encontrar punto fijo z* tal que z^n + c = z
    // g(z) = z^n - z + c = 0
    let zr = 1.0, zi = 0.1; // Semilla inicial
    for (let i = 0; i < 10; i++) {
        // z^n (complex)
        let r = Math.sqrt(zr*zr + zi*zi);
        let theta = Math.atan2(zi, zr);
        let p_r = Math.pow(r, n);
        let p_theta = theta * n;
        let znr = p_r * Math.cos(p_theta);
        let zni = p_r * Math.sin(p_theta);
        
        // g(z) = z^n - z + c
        let gr = znr - zr + cx;
        let gi = zni - zi + cy;
        
        // g'(z) = n * z^(n-1) - 1
        let r_m1 = Math.pow(r, n-1);
        let th_m1 = theta * (n-1);
        let gpr = n * r_m1 * Math.cos(th_m1) - 1;
        let gpi = n * r_m1 * Math.sin(th_m1);
        
        // Newton step: z = z - g(z)/g'(z)
        let det = gpr*gpr + gpi*gpi;
        zr -= (gr * gpr + gi * gpi) / det;
        zi -= (gi * gpr - gr * gpi) / det;
    }

    // 2. Multiplicador lambda = f'(z*) = n * (z*)^(n-1)
    let r = Math.sqrt(zr*zr + zi*zi);
    let theta = Math.atan2(zi, zr);
    let r_m1 = Math.pow(r, n-1);
    let th_m1 = theta * (n-1);
    let lr = n * r_m1 * Math.cos(th_m1);
    let li = n * r_m1 * Math.sin(th_m1);

    return {
      fixedPointReal: zr,
      fixedPointImag: zi,
      logScale: Math.log(Math.sqrt(lr * lr + li * li)),
      rotationStep: Math.atan2(li, lr)
    };
  }

  private updateFractalParams(): void {
    const params = this.calculateLoopParams(this.config.juliaCX, this.config.juliaCY, this.config.power);
    this.fractalMaterial.uniforms.uJuliaC.value.set(this.config.juliaCX, this.config.juliaCY);
    this.fractalMaterial.uniforms.uFixedPoint.value.set(params.fixedPointReal, params.fixedPointImag);
    this.fractalMaterial.uniforms.uLogScale.value = params.logScale;
    this.fractalMaterial.uniforms.uRotationStep.value = params.rotationStep;
    this.fractalMaterial.uniforms.uPower.value = this.config.power;
  }

  private initGUI(): void {
    const zoomFolder = this.gui.addFolder("Zoom"); 
    zoomFolder.add(this.config, "isZooming").name("Animar");
    zoomFolder.add(this.config, "zoomSpeed", 0.0, 1.0).name("Velocidad");
    
    const geoFolder = this.gui.addFolder("Geometría");
    geoFolder.add(this.config, "juliaCX", -1, 1, 0.0001).name("C Real").onChange(() => this.updateFractalParams());
    geoFolder.add(this.config, "juliaCY", -1, 1, 0.0001).name("C Imag").onChange(() => this.updateFractalParams());
    geoFolder.add(this.config, "power", 1.5, 6.0, 0.1).name("Complejidad (n)").onChange(() => this.updateFractalParams());

    const aestheticFolder = this.gui.addFolder("Estética");
    aestheticFolder.add(this.config, "colorOffset", 0, 1, 0.01).name("Tono");
  }

  private start(): void {
    this.renderer.animate(() => {
      this.time.tick();
      const deltaTime = this.time.getDelta();
      if (this.config.isZooming) {
        this.config.zoomProgress = (this.config.zoomProgress + this.config.zoomSpeed * deltaTime) % 1.0;
        this.fractalMaterial.uniforms.uZoomProgress.value = this.config.zoomProgress;
      }
      this.fractalMaterial.uniforms.uTime.value = this.time.getElapsedTime();
      this.fractalMaterial.uniforms.uColorOffset.value = this.config.colorOffset + this.time.getElapsedTime() * 0.05;
    });
  }
}
