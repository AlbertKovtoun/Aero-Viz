attribute vec3 aInstanceColor;

varying vec2 vUv;
varying vec3 vInstanceColor;

void main()
{
    vec4 modelPosition = instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * modelPosition;

    vUv = uv;
    vInstanceColor = aInstanceColor;
}

