uniform sampler2D uColorTexture;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D(uColorTexture, vUv);
    gl_FragColor = vec4(vec3(color), 1.0);
}

