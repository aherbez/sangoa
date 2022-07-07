export const sphere = (p, r) => {
    return p.length() - r;
}

export const box = (p, bounds) => {        
    // vec3 q = abs(p) - bounds;
    // return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);        

    const q = new THREE.Vector3(
        Math.abs(p.x),
        Math.abs(p.y),
        Math.abs(p.z)
    ).sub(bounds);

    
    return 1.0;
}

