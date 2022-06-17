import { Canvas } from "@react-three/fiber";
import Box from "./box";
import SDF from "./sdf";

/*
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
*/

const World = (props) => {
    return (
        <div className="panel-world">
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            
                <SDF />
            </Canvas>
      </div>);
}

export default World;