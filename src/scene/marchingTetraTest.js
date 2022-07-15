// import { BufferGeometry, BufferAttribute } from "three";
import { Suspense } from "react";
import { tetraPoints, processTetra } from "../geo/marchingTetra";

/*
                <mesh>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attach={"attributes-position"}
                            array={positions}
                            count={positions.length / 3}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach={"attributes-uv"}
                            array={uvs}
                            count={uvs.length / 2}
                            itemSize={2}
                        />
                    </bufferGeometry>
                    <meshBasicMaterial attach="material" color="red" />        
                </mesh>
*/

const MarchingTetra = (props) => {
    
    // const geo = props.geo || [];

    const n = 100;
    let positions = new Float32Array(n * 3);
  
    for (let index = 0; index < positions.length; index++) {
      positions[index] = Math.random(); // (Math.random() - 0.5) * 2;
    }    

    /*
    positions = new Float32Array([
        0, 0, 0,
        1, 1, 0,
        1, 0, 0
    ]);
    */

    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
    
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
    ] );

    /*
    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        1, 1,
        0, 1,
        0, 0
    ]);
    */

    const bp = tetraPoints(2);
    const allTPoints = [];
    allTPoints.push(bp[0], bp[2], bp[1]);
    allTPoints.push(bp[0], bp[3], bp[2]);
    allTPoints.push(bp[1], bp[2], bp[3]);
    allTPoints.push(bp[0], bp[1], bp[3]);

    const ptValues = [
        .1, -0.2, -0.8, 1
    ];

    const mtMesh = processTetra(bp, ptValues);
    const faceVertsRaw = [];
    mtMesh.forEach(v => {
        faceVertsRaw.push(...v);
    });
    const faceVerts = new Float32Array(faceVertsRaw);

    const rawVerts = [];
    allTPoints.forEach(p => {
        rawVerts.push(...p);
    })

    // const tetraVerts = new Float32Array(rawVerts);

    positions = vertices;
    
    return(
        <Suspense fallback={null}>
            <group>
                <mesh>
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            attach="attributes-position"
                            array={faceVerts}
                            count={faceVerts.length / 3}
                            itemSize={3}
                        />
                        <meshBasicMaterial
                        />
                    </bufferGeometry>
                </mesh>                
            </group>
        </Suspense>
    );
}

export default MarchingTetra;