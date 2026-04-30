# 🚀 Three.js + TypeScript Starter

Este proyecto es una base de Three.js configurada con **Vite**, **TypeScript** y **Bun**.

---

## 📜 Créditos
Este proyecto está basado en el repositorio original de [CastDev-j/threejs-ts-starter](https://github.com/CastDev-j/threejs-ts-starter).

---

## 📦 Instalación

Para configurar el proyecto desde cero, primero asegúrate de tener [Bun](https://bun.sh/) instalado en tu sistema.

1. **Instalar dependencias:**
   ```bash
   bun install
   ```
2. **Arrancar el servidor de desarrollo:**
   ```bash
   bun run dev
   ```

---

## 🎮 Cómo usar este Proyecto

1. **Controlar la Experiencia:** En `src/lib/Experience.ts` se añaden objetos, luces y se programa la lógica principal.
2. **Punto de Entrada:** `src/index.ts` solo se encarga de arrancar la aplicación.
3. **Añadir Interfaz:** En `index.html` se añaden botones o textos 2D que flotarán sobre el canvas 3D.
4. **Publicar:** Cuando termines, corre `bun run build` para generar la carpeta `dist/` lista para subirla a cualquier hosting.

---

## 🛠️ Archivos Modificables

Son los que definen la experiencia del usuario.

### 🔵 `src/index.ts`
Es el punto de arranque (Bootstrap). No deberías necesitar tocarlo mucho; su única misión es inicializar la clase `Experience`.

### 🟠 `src/lib/Experience.ts`
Este es el **corazón creativo**. Aquí se conectan los objetos, las luces y la lógica de movimiento.
- **¿Qué más se puede agregar aquí?**
    - **Nuevos Actores:** Esferas, planos, o modelos 3D complejos cargados externamente.
    - **Lógica de Juego:** Contadores de puntos, colisiones entre objetos.
    - **Interactividad:** Que el cubo cambie de color cuando hagas clic sobre él o se mueva con las flechas del teclado.
    - **Post-procesamiento:** Efectos de cine como desenfoque (blur) o brillo (bloom).

### 🟢 `index.html`
Es el esqueleto. Usado principalmente para elementos que están "fuera" del mundo 3D.
- **¿Qué más se puede agregar aquí?**
    - **HUD/UI:** Un menú de pausa, una barra de carga o un letrero de "Game Over".
    - **Fuentes Externas:** Enlaces a Google Fonts para que tus textos se vean increíbles.
    - **Scripts de análisis:** Como Google Analytics o Pixel de Meta.

### 🔴 `global.css`
Aquí esta cargado Tailwind CSS y tus reglas de diseño global.
- **¿Qué más se puede agregar aquí?**
    - **Variables de Color:** Define tus propios colores (ej: `--color-primary: #ff00ff`).
    - **Animaciones CSS:** Efectos para tus botones de la interfaz 2D.
    - **Cursores personalizados:** Cambiar el puntero del ratón por una mira o algo más temático.

---

## 🏗️ La Capa de Abstracción

### 📂 `src/lib/`
Aquí van las herramientas reutilizables.
- **¿Qué más se puede agregar aquí?**
    - **`InputManager.ts`:** Un archivo para centralizar los controles de teclado/gamepad.
    - **`AssetLoader.ts`:** Una herramienta para cargar muchas texturas al mismo tiempo con una barra de progreso.
    - **`MathUtils.ts`:** Funciones propias para calcular trayectorias o curvas puntuales.

---

## 🚫 Archivos que "NO SE DEBEN MODIFICAR"

Modificarlos sin conocimiento puede romper el proyecto.

1.  **`src/lib/renderer.ts`**: Es el motor de renderizado. Ya maneja el resize, la cámara y los FPS.
2.  **`bun.lock` / `package-lock.json`**: Son los registros de seguridad de las librerías. No se editan a mano, solo mediante comandos de terminal.
3.  **`tsconfig.json`**: Las reglas de TypeScript.
4.  **`vite.config.ts`**: Si se modifica, Tailwind o Three.js podrían dejar de compilar.
5.  **`vite-env.d.ts`**: Solo sirve para que el editor de código no muestre errores falsos.

---

## 🚀 Comandos Rápidos
- `bun run dev`: Arranca el estudio de grabación (Servidor local).
- `bun run build`: Prepara el proyecto para publicarlo en internet.
