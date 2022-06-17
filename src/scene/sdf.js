import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

/*
unite(a,b) { return min(a,b)}

subtract(a,b) { return max(-a,b)}

intersect(a,b) { return max(a,b)}

smoothUnion(a,b,k) {
    float h = clamp(0.5 - 0.5*(a-b)/k, 0., 1.)
    return mix(a, b, h) + k*h*(1.-h)
}

smoothIntersect(a,b,k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0., 1.)
    return mix(a, b, h) + k*h*(1.-h)
}

*/

const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.);
    }
`;

const fragmentShader = `
    #define MAX_STEPS 100
    #define MIN_DIST 0.01
    #define MAX_DIST 100.

    uniform vec2 resolution;
    uniform float uTime;

    float sphere(vec3 p, vec4 s) {
        return length(p - s.xyz) - s.w;
    }

    float box(vec3 p, vec3 cent, vec3 bounds) {        
        return 0.;
    }

    float scene(vec3 p) {
        float sd = sphere(p, vec4(0., 1., 3., 1.));
        float pd = p.y;

        return min(pd, sd);
    }

    vec3 getNormal(vec3 p) {
        float d = scene(p);
        vec2 e = vec2(.01, 0.);

        vec3 n = d - vec3(
            scene(p - e.xyy),
            scene(p - e.yxy),
            scene(p - e.yyx)
        );

        return normalize(n);
    }


    float rayMarch(vec3 ro, vec3 rd) {
        float dO = 0.;

        for (int i=0; i<MAX_STEPS; i++) {
            vec3 p = ro + (rd * dO);
            float dS = scene(p);
            dO += dS;
            if (dO > MAX_DIST || dS < MIN_DIST) break;
        }
        return dO;
    }

    float getLight(vec3 p) {
        vec3 lightPos = vec3(0., 2., 0.);
        lightPos.xz += vec2(sin(uTime) * -3., cos(uTime) * -3.);

        vec3 l = normalize(lightPos - p);
        vec3 n = getNormal(p);

        float dif = clamp(dot(n,l), 0., 1.);
        float d = rayMarch(p + n*MIN_DIST*2., l);
        if (d < length(lightPos - p)) dif *= .1;

        return dif;
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy / resolution.xy) - 1.;
        uv.x *= resolution.x / resolution.y;

        vec3 pos = vec3(0., 2., -3.);
        vec3 dir = normalize(vec3(uv.x, uv.y, 2.));

        float d = rayMarch(pos, dir);
        vec3 p = pos + dir * d;

        float dif = getLight(p);

        vec3 color = vec3(dif);

        gl_FragColor = vec4(color, 1.);
    }

`;

const SDF = (props) => {

    const shaderRef = useRef();

    const uniforms = {
        resolution: { value: new THREE.Vector2(700, 700)},
        uTime: {value: 0.}
    }

    useFrame(({clock}) => {
        // console.log(clock.getElapsedTime());
        shaderRef.current.uniforms.uTime = { value: clock.getElapsedTime()}
    
    })

    return (
        <mesh>
            <planeBufferGeometry args={[2,2,1,1]} />
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export default SDF;