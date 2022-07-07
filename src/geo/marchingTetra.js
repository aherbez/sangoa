
export const tetraPoints = (size) => {
    const pts = [];
    for (let i=0; i < 3; i++) {
        let theta = ((Math.PI * 2) / 3) * i;
        pts.push([Math.cos(theta) * size, -size/2, Math.sin(theta) * size]);
    }
    pts.push([0, size/2, 0]);
    return pts;
}



/** return triangles (if any) for a given set of four points */
export const processTetra = (points) => {
    
    
    
    return [];
} 