varying vec2 vUv;
varying vec3 vInstanceColor;

void main()
{
    gl_FragColor = vec4(vInstanceColor, 1.0);
}