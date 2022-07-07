import * as THREE from 'three';
import { sphere, box } from './shapeFunctions';

const clamp = (v, minV, maxV) => {
    if (v < minV) return minV;
    if (v > maxV) return maxV;
    return v;
}

const mix = (v1, v2, u) => {
    return (v1 * (1-u)) +  (v2 * u);
}

const smoothUnion = (d1, d2, k) => {
    const h = clamp(0.5 + 0.5*(d2-d1)/k, 0., 1.);
    return mix(d2, d1, h) - k*h*(1.-h);
}

const smoothSubtract = (d1, d2, k) => {
    const h = clamp(0.5 - 0.5*(d2+d1)/k, 0., 1.);
    return mix(d2, -d1, h) + k*h*(1.-h);
}

const smoothIntersect = (d1, d2, k) => {
    const h = clamp(0.5 - 0.5*(d2-d1)/k, 0., 1.);
    return mix(d2, d1, h) + k*h*(1.-h);
}

// create a (x,y,z) => float function from a list of shapes
const sceneFunction = (shapes) => {

    const f = (x,y,z) => {
        return 0.;
    }

    return f;
}

 