export const boxData = (s) => {
    const size = s || 1;

    return {
        t: 1,
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