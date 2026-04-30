precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uZoomProgress; 
uniform float uBaseZoom;
uniform float uPower;
uniform vec2 uJuliaC;
uniform vec2 uFixedPoint;
uniform float uLogScale;
uniform float uRotationStep;
uniform float uColorOffset;

varying vec2 vUv;

// Función fractal generalizada z^n + c con suavizado dinámico
float getFractalValue(vec2 z, vec2 c, float phaseOffset) {
    float iter = 0.0;
    float maxIter = 400.0;
    float bailout = 10000.0;
    
    for(float i = 0.0; i < 400.0; i++) {
        float r = length(z);
        float a = atan(z.y, z.x);
        float nr = pow(r, uPower);
        float na = a * uPower;
        
        z = vec2(cos(na), sin(na)) * nr + c;
        
        if(dot(z, z) > bailout) break;
        iter++;
    }
    
    if(iter >= maxIter) return -1.0;
    
    // Suavizado dinámico basado en la potencia n
    float distSq = dot(z, z);
    float nu = log(log(distSq) / log(bailout)) / log(uPower);
    return iter + 1.0 - nu - phaseOffset;
}

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 col_c = vec3(1.0, 1.0, 1.0);
    vec3 col_d = vec3(0.3, 0.4, 0.5);
    return a + b * cos(6.28318 * (col_c * t + col_d + uColorOffset));
}

void main() {
    vec2 p = (vUv - 0.5) * uResolution / min(uResolution.x, uResolution.y);
    float r = length(p);
    float a = atan(p.y, p.x);
    
    float logR = log(r) - log(uBaseZoom);
    
    vec3 finalColor = vec3(0.0);
    for(int i = 0; i <= 1; i++) {
        float phase = uZoomProgress + float(i);
        float currentLogR = logR - phase * uLogScale;
        float currentAngle = a - phase * uRotationStep;
        
        vec2 z = vec2(cos(currentAngle), sin(currentAngle)) * exp(currentLogR) + uFixedPoint;
        float weight = (i == 0) ? (0.5 + 0.5 * cos(uZoomProgress * 3.14159265)) : (0.5 - 0.5 * cos(uZoomProgress * 3.14159265));
        
        float val = getFractalValue(z, uJuliaC, phase);
        if(val >= 0.0) {
            finalColor += palette(val / 30.0) * weight;
        } else {
            finalColor += vec3(0.0, 0.005, 0.01) * weight;
        }
    }

    float vignette = smoothstep(1.8, 0.2, length(p));
    gl_FragColor = vec4(finalColor * vignette, 1.0);
}
