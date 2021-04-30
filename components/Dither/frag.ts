const glslify = require("glslify");

export const frag = glslify(`
    precision highp float;
    uniform vec3 color;
    uniform float time;
    uniform vec2 resolution;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 screenUV;

    float luma(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
    }

    float luma(vec4 color) {
        return dot(color.rgb, vec3(0.299, 0.587, 0.114));
    }

    float dither(vec2 position, float brightness) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float limit = 0.0;

    if (x < 8) {
        if (index == 0) limit = 0.0625;
        if (index == 1) limit = 0.5625;
        if (index == 2) limit = 0.1875;
        if (index == 3) limit = 0.6875;
        if (index == 4) limit = 0.8125;
        if (index == 5) limit = 0.3125;
        if (index == 6) limit = 0.9375;
        if (index == 7) limit = 0.4375;
        if (index == 8) limit = 0.25;
        if (index == 9) limit = 0.75;
        if (index == 10) limit = 0.125;
        if (index == 11) limit = 0.625;
        if (index == 12) limit = 1.0;
        if (index == 13) limit = 0.5;
        if (index == 14) limit = 0.875;
        if (index == 15) limit = 0.375;
    }

    return brightness < limit ? 0.0 : 1.0;
    }

    void main () {
        // Spin light around a bit
        float angle = sin(time * 0.25) * 2.0 + 3.14 * 0.5;
        vec3 lightPosition = vec3(cos(angle), sin(time * 1.0), sin(angle));
        vec3 L = normalize(lightPosition);
        vec3 N = normalize(vNormal);

        // Get diffuse contribution
        float diffuse = max(0.0, dot(N, L));
        diffuse = smoothstep(0.0, 1.25, diffuse);
        diffuse = pow(diffuse, 0.25);
        diffuse *= max(0.0, 1.0 - distance(vPosition, lightPosition) / 2.0) * 1.0;
        diffuse += pow(vNormal.z, 0.95) * 0.05;
        diffuse = clamp(diffuse, 0.0, 1.0);

        float ditherSize = 300.0;
        diffuse = dither(gl_FragCoord.xy / resolution.xy * ditherSize, diffuse);

        gl_FragColor = vec4(color * diffuse, 1.0);
    }
`);
