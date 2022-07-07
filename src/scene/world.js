import { Canvas, extend } from "@react-three/fiber";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from "@react-three/drei";
import Box from "./box";
import SDF from "./sdf";
import MarchingTetra from "./marchingTetraTest";


// <SDF />

const testShapes = [
    {
        t: 2,
        p: [0, 1.75, 3],
        r: [-30,0,-30],
        b: [1,0.5,0.5],
        op: 1,
        sm: 0,
        cl: [255,0,0]
    },
    {
        t: 1,
        p: [0., 1.5, 3],
        r: [0,0,0],
        b: [0.75, 0.75, 0.75],
        op: 2,
        sm: 0.25,
        cl: [0,255,0]
    },
    {
        t: 1,
        p: [0.5, 2.5, 2.5],
        r: [0,0,0],
        b: [0.5, 0.75, 0.75],
        op: 1,
        sm: 0.25,
        cl: [0,0,255]
    },
]

const World = (props) => {

    const showSDF = false;

    return (
        <div className="panel-world">
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={0.2}/>
                <directionalLight position={[10, 10, 10]} />

                {showSDF ? 
                    <SDF
                        geo={testShapes}
                    />
                    :
                    <MarchingTetra 
                        geo={testShapes}
                    />
                }
                <group>
                    <mesh>
                        <boxBufferGeometry args={[0.2,0.1,0.1]} />
                        <meshLambertMaterial color="blue" />
                    </mesh>
                    <MarchingTetra geo={testShapes} />
                </group>
            </Canvas>
      </div>);
}

export default World;