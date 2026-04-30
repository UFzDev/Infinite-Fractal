/**
 * @class Time
 * @description Gestor de tiempo profesional para el ciclo de vida de la aplicación.
 * Proporciona deltaTime y tiempo transcurrido de forma centralizada.
 */
export class Time {
  public start: number;
  public current: number;
  public elapsed: number;
  public delta: number;

  constructor() {
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16; // Aproximación inicial (60fps)
  }

  /**
   * Actualiza los valores de tiempo en cada frame.
   * Debe llamarse al inicio de cada ciclo de animación.
   */
  tick(): void {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
  }

  /**
   * Devuelve el tiempo transcurrido en segundos.
   */
  getElapsedTime(): number {
    return this.elapsed * 0.001;
  }

  /**
   * Devuelve el delta time en segundos (útil para multiplicadores de velocidad).
   */
  getDelta(): number {
    return this.delta * 0.001;
  }
}
