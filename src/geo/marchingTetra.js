
export const tetraPoints = (size) => {
    const pts = [];
    for (let i=0; i < 3; i++) {
        let theta = ((Math.PI * 2) / 3) * i;
        pts.push([Math.cos(theta) * size, -size/2, Math.sin(theta) * size]);
    }
    pts.splice(1, 0, ([0, size/2, 0]));
    return pts;
}

const sign = (n) => {
    if (n <= 0) return -1;
    return 1;
}

const edgeLookup = [
    [0,1],
    [1,2],
    [2,3],
    [3,0],
    [0,2],
    [1,3]
];

const triLookup = [
    [], // 0
    [[0,3,4]], // 1
    [[0,1,5]], // 2
    [[5,3,4],[5,4,1]], // 3
    [[1,4,2]], // 4
    [[0,3,2],[0,2,1]], // 5
    [[0,4,2],[0,2,5]], // 6
    [[5,3,2]], // 7
    [[5,2,3]], // 8
    [[0,2,4],[0,5,2]], // 9
    [[0,2,3],[0,1,2]], // 10
    [[1,2,4]], // 11
    [[5,4,3],[5,1,4]], // 12
    [[0,5,1]], // 13
    [[0,4,3]], // 14
    [], // 15
];

const lerp = (a, b, u) => {
    return (a * u) + (b * (1-u));
}

const edgeToPoint = (eI, points, values) => {
    let s = edgeLookup[eI][0];
    let e = edgeLookup[eI][1];

    if (sign(values[s]) === sign(values[e])) return null;
    if (sign(values[s]) === 1) {
        // flip indices
        e = s;
        s = edgeLookup[eI][1];
    }

    const total = Math.abs(values[s]) + Math.abs(values[e]);
    const u = Math.abs(values[e]) / total;

    const pS = points[s];
    const pE = points[e];

    return [
        lerp(pS[0], pE[0], u),
        lerp(pS[1], pE[1], u),
        lerp(pS[2], pE[2], u),
    ];
}

/** return triangles (if any) for a given set of four points */
export const processTetra = (points, values) => {
    // make triangles

    // classify tetra
    let tetraType = 0;
    values.forEach((v, i) => {
        if (v <= 0) {
            tetraType += Math.pow(2, i);
        }
    });

    // process each edge
    const vertGuide = triLookup[tetraType];

    const vertices = [];
    vertGuide.forEach(f => {
        f.forEach(e => {
            const v = edgeToPoint(e, points, values);
            if (v !== null) {
                vertices.push(v);
            }
        })
    })

    return vertices;
} 