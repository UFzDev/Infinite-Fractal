import { Experience } from "./lib/Experience";

/**
 * ENTRY POINT
 * Punto de entrada de la aplicación.
 * Solo se encarga de localizar el canvas e instanciar la Experiencia.
 */
const init = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#webgl-canvas");

  if (!canvas) {
    console.error("No se pudo inicializar la aplicación: Canvas no encontrado.");
    return;
  }

  // Instanciamos el motor de la experiencia
  new Experience(canvas);
};

// Arrancamos la App
init();