const SHAPE_CUBE = 1;
const SHAPE_SPHERE = 2;

export const boxData = (s) => {
    const size = s || 1;

    return {
        t: SHAPE_CUBE,
        p: [0, 0, 0],
        r: [0,0,0],
        b: [size, size, size],
        op: 2,
        sm: 0.0,
    };
}

export const sphereData = (s) => {
    const size = s || 1;
    return {
        t: SHAPE_SPHERE,
        p: [0, 0, 0],
        r: [0,0,0],
        b: [size, size, size],
        op: 2,
        sm: 0.0,
    };

}

export const randPos = (range) => {
    const min = -range/2;
    
    return [
        Math.random() * range + min,
        Math.random() * range + min,
        Math.random() * range + min,
    ];
}