# ♾️ Infinite Fractal Explorer

Un explorador de fractales de alto rendimiento basado en **GPU**, diseñado para ofrecer una experiencia visual infinita y matemáticamente estable. Utiliza conjuntos de Julia con un mapeo Log-Polar para lograr un bucle de zoom fluido sin fin.

---

## ✨ Características Principales

- **Bucle de Zoom Infinito**: Gracias al mapeo log-polar y autosimilitud forzada, la cámara navega eternamente dentro de la geometría.
- **Estabilidad Dinámica**: Implementa un **Solucionador de Punto Fijo (Newton)** en tiempo real para estabilizar la rotación y escala del fractal según los parámetros de entrada.
- **Renderizado por GPU**: Shaders de fragmentos optimizados (GLSL) para un rendimiento de 60 FPS en resoluciones modernas.
- **Control Total**: Interfaz interactiva para manipular la constante de Julia ($c$), la potencia del fractal ($n$) y la estética del color.

---

## 🛠️ Stack Tecnológico

- **Core**: [Three.js](https://threejs.org/) & WebGL
- **Lenguaje**: TypeScript (Strict Mode)
- **Shaders**: GLSL (Vertex & Fragment)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Runtime**: [Bun](https://bun.sh/)
- **UI**: lil-gui

---

## 🚀 Inicio Rápido

Asegúrate de tener [Bun](https://bun.sh/) instalado.

1. **Clonar e instalar:**
   ```bash
   bun install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   bun run dev
   ```

3. **Compilar para producción:**
   ```bash
   bun run build
   ```

---

## 🧠 El Corazón del Motor

El proyecto utiliza una técnica avanzada de **mapeo logarítmico** para transformar la divergencia del fractal en un espacio de zoom constante. El archivo `src/lib/Experience.ts` contiene el motor principal que calcula los parámetros de rotación y escala necesarios para que el bucle sea imperceptible al ojo humano.

---

## 📜 Licencia

Desarrollado con pasión por el arte generativo y la computación gráfica.
Uso libre bajo la licencia MIT.
