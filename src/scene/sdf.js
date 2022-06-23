import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useLayoutEffect, Suspense } from 'react';

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

    #define TEX_SIZE 256.
    #define PIX_PER_SHAPE 4.
    #define PIX_SIZE 4.

    uniform vec2 resolution;
    uniform float uTime;
    uniform int numShapes;
    uniform sampler2D shapesTex;
    uniform vec3 tmp;

    float smoothUnion( float d1, float d2, float k) {
        float h = clamp(0.5 + 0.5*(d2-d1)/k, 0., 1.);
        return mix(d2, d1, h) - k*h*(1.-h);
    }

    float smoothSubtract(float d1, float d2, float k) {
        float h = clamp(0.5 - 0.5*(d2+d1)/k, 0., 1.);
        return mix(d2, -d1, h) + k*h*(1.-h);
    }

    float smoothIntersect(float d1, float d2, float k) {
        float h = clamp(0.5 - 0.5*(d2-d1)/k, 0., 1.);
        return mix(d2, d1, h) + k*h*(1.-h);
    }


    float sphere(vec3 p, vec4 s) {
        return length(p - s.xyz) - s.w;
    }

    float box(vec3 p, vec3 bounds) {        
        vec3 q = abs(p) - bounds;
        return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);        
    }

    vec2 getBaseUV(int i) {
        float pixPerW = TEX_SIZE / PIX_SIZE;
        // rect W is (PIX_PER_SHAPE * PIX_SIZE)
        // rect H is PIX_SIZE

        float shapesPerW = TEX_SIZE / (PIX_PER_SHAPE * PIX_SIZE);
        
        vec2 uv = vec2(0.);
        uv.x = float(i % int(shapesPerW)) * PIX_PER_SHAPE;
        uv.y = floor(float(i) / shapesPerW);

        uv *= 1. / (TEX_SIZE / PIX_SIZE);
        uv.y = 1. - uv.y;

        return uv;
    }

    vec3 getPos(vec2 baseUv, vec2 offset) {
        // get the position
        vec3 pos = texture2D(shapesTex, baseUv + offset).xyz;
        return pos;
    }

    float scene(vec3 p) {
        float d = p.y;

        vec2 pixOffset = vec2(1. / (TEX_SIZE / PIX_SIZE));
        // pixOffset.y *= -1.;

        for (int i=0; i < numShapes; i++) 
        {
            vec2 baseUv = getBaseUV(i);

            vec3 pos = getPos(baseUv, pixOffset * vec2(0.5, -0.5));
            pos *= 5.;

            vec3 rot = getPos(baseUv, pixOffset * vec2(1.5, -0.5));

            vec3 bounds = getPos(baseUv, pixOffset * vec2(2.5, -0.5));
            bounds *= 5.;

            vec3 data = getPos(baseUv, pixOffset * vec2(3.5, -0.5));
            int type = int(data.x * 256.) % 64;
            int operation = int((data.x * 256.) / 64.);
            float smoothAmt = data.g;

            float nd = 0.;
            if (type == 1) nd = sphere(p-pos, vec4(vec3(0.), bounds.x));
            if (type == 2) nd = box(p-pos, bounds);

            if (operation == 1) d = smoothUnion(d, nd, smoothAmt);
            if (operation == 2) d = smoothSubtract(nd, d, smoothAmt); // max(-nd, d);
            // d = min(d, nd);
        }

        /*
        float sd = sphere(p, vec4(0., 1., 3., 1.));
        float bd = box(p, vec3(0., 2., 3.), vec3(0.5));
        float d = min(pd, sd);
        d = min(d, bd);
        */

        return d;
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
        // color = getPos(1);

        gl_FragColor = vec4(color, 1.);
    }

`;

const OP_UNION = 1;
const OP_SUB = 2;
const OP_INTERSECT = 3;

const SHP_SPHERE = 1;
const SHP_BOX = 2;

const oneShape = [
    {
        t: 2,
        p: [0.5, 1.5, 3],
        r: [0,0,0],
        b: [0.25,1,1],
        op: 1,
        sm: 0
    }
];

const oneShape2 = [
    {
        t: 2,
        p: [1.5, 1.5, 3],
        r: [0,0,0],
        b: [1,1,1],
        op: 1,
        sm: 0.5
    }
];

const oneShape3 = [
    {
        t: 2,
        p: [2, 1.5, 3],
        r: [0,0,0],
        b: [0.5,1,1],
        op: 1,
        sm: 0.5
    }
];

const threeShapes = [
    {
        t: 1,
        p: [0, 1.5, 3],
        r: [0,0,0],
        b: [0.2,1,1],
        op: 1,
        sm: 0
    },
    {
        t: 2,
        p: [0.5, 1.5, 3],
        r: [0,0,0],
        b: [0.5,1,1],
        op: 1,
        sm: 0.5
    },
    {
        t: 2,
        p: [1, 1.5, 3],
        r: [0,0,0],
        b: [0.7,1,1],
        op: 1,
        sm: 0.5
    }
];

const subTest = [
    {
        t: 2,
        p: [0, 0.5, 3],
        r: [0,0,0],
        b: [1,1,1],
        op: 1,
        sm: 0
    },
    {
        t: 1,
        p: [0., 1.5, 3],
        r: [0,0,0],
        b: [0.75, 0.75, 0.75],
        op: 1,
        sm: 0.25
    },
    {
        t: 1,
        p: [0.5, 2.5, 3],
        r: [0,0,0],
        b: [0.5, 0.75, 0.75],
        op: 1,
        sm: 0.25
    },

]

const shapes = subTest;

const makeColor = (inVals, bounds) => {
    const col = inVals.map(v => {
        return Math.floor((v / bounds) * 256)
    });

    const colSt = `rgb(${col[0]},${col[1]},${col[2]})`;
    return colSt;
}

const makeTex = (shapeList) => {
    const texSize = 256;
    const sqSize = 4;
    const pixPerShape = 4;

    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = texSize;
    ctx.canvas.height = texSize;       

    ctx.fillStyle = 'rgb(0,76,153)';
    ctx.fillRect(0, 0, 256, 256);

    const numWide = texSize / (pixPerShape * sqSize);

    shapeList.forEach((s,i) => {
        // p, r, b
        // extra data
        // let i = j % shapeList.length;
        // let s = shapeList[i];

        const x = i % numWide;
        const y = Math.floor(i / numWide);
        
        ctx.save();
        ctx.translate(x * sqSize * pixPerShape, y * sqSize);

        // draw pos
        ctx.fillStyle = makeColor(s.p, 5);
        ctx.fillRect(0, 0, sqSize, sqSize);
        
        // draw rot
        ctx.fillStyle = makeColor(s.r, 360);
        ctx.fillRect(sqSize, 0, sqSize, sqSize);

        // draw bounds
        ctx.fillStyle = makeColor(s.b, 5);
        ctx.fillRect(2 * sqSize, 0, sqSize, sqSize);

        // draw other stuff
        // type, operation, smoothing
        // type: one of 16?
        // operation: one of 4
        const r = (s.op * 64) + s.t;
        const g = Math.floor(s.sm * 256);
        ctx.fillStyle = `rgb(${r},${g},0)`;
        ctx.fillRect(3 * sqSize, 0, sqSize, sqSize);
        
        // ctx.strokeStyle = 'white';
        // ctx.strokeRect(0, 0, sqSize * pixPerShape, sqSize);
    
        ctx.restore();
    });

    document.getElementById("canvasAttach").innerHTML = '';
    document.getElementById("canvasAttach").appendChild(ctx.canvas);

    return new THREE.CanvasTexture(ctx.canvas);
}


const SDF = (props) => {

    const tex = useLoader(THREE.TextureLoader, 'tmp.png');

    const shaderRef = useRef();
    const shapeTex = makeTex(shapes);
    shapeTex.needsUpdate = true;
    console.log(shapeTex);
    const uniforms = {
        resolution: { value: new THREE.Vector2(700, 700)},
        uTime: {value: 0.},
        shapesTex: { type: "t", value: shapeTex},
        numShapes: { value: shapes.length},
        tmp: {value: new THREE.Vector3(0, 76, 153)}
    }

    useFrame(({clock}) => {
        // console.log(clock.getElapsedTime());
        shaderRef.current.uniforms.uTime = { value: clock.getElapsedTime()};
        // shaderRef.current.uniform.shapeTex = { value: shapeTex};
        shapeTex.needsUpdate = true;
    })

    useLayoutEffect(() => {
        // shaderRef.current.uniforms.shapeTex.value.needsUpdate = true;
    })

/*
    <meshLambertMaterial
        ref={shaderRef}
        map={shapeTex}
    />
*/

    return (
        <Suspense fallbacl={null}>
            <mesh>
                <planeBufferGeometry args={[2,2,1,1]} />
                <shaderMaterial
                    ref={shaderRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                />
            </mesh>
        </Suspense>
    );
}

export default SDF;