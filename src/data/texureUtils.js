import * as THREE from 'three';

const makeColor = (inVals, maxV, minV = 0) => {
    const range = maxV - minV;
    
    const col = inVals.map(v => {
        return Math.floor(((v - minV)/ range) * 256)
    });

    const colSt = `rgb(${col[0]},${col[1]},${col[2]})`;
    return colSt;
}

export const bakeShapeTexture = (shapeList) => {

    console.log('makeTex', shapeList);

    const texSize = 256;
    const sqSize = 2;
    const pixPerShape = 5;

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
        ctx.fillStyle = makeColor(s.r, 360, -360);
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
        
        const color = s.cl || [255,255,255];
        ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
        ctx.fillRect(4 * sqSize, 0, sqSize, sqSize);
    
        ctx.restore();
    });

    document.getElementById("canvasAttach").innerHTML = '';
    document.getElementById("canvasAttach").appendChild(ctx.canvas);

    return new THREE.CanvasTexture(ctx.canvas);
}