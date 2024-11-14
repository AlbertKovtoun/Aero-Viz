varying vec2 vUv;
varying vec3 vInstanceColor;
varying float vOpacity;

void main()
{
    gl_FragColor = vec4(vInstanceColor, vOpacity);
}
