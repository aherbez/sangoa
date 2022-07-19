import { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SDF from "./sdf";
import MarchingTetra from "./marchingTetraTest";
import { store } from "../data/store";

const testShapes = [
    {
        t: 2,
        p: [0, 1.75, 3],
        r: [-30,0,-10],
        b: [2,0.5,0.5],
        op: 1,
        sm: 0    
    },
    {
        t: 1,
        p: [0., 1.7, 3],
        r: [0,0,0],
        b: [0.75, 0.75, 0.75],
        op: 2,
        sm: 0.02,
    }
]

const World = (props) => {

    const ctx = useContext(store);
    console.log('SDF', ctx.state.objects, testShapes);

    const showSDF = true;

    return (
        <div className="panel-world">
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={0.2}/>
                <directionalLight position={[10, 10, 10]} />

                {showSDF ? 
                    <SDF 
                        geo={ctx.state.objects}
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