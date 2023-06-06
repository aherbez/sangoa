import { useContext } from "react";
import { store } from "../../src/data/store";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Prim from "../geo/prim";
import styles from "./panes.module.css"

const Pane3d = (props) => {
    const globalState = useContext(store);
    const { dispatch } = globalState;
    // console.log('pane3d', globalState);
    
    // console.log('pane3d', Array.from(globalState.state.objLookup));

    const onSelect = (id) => {
        console.log('select', id);
        dispatch({
            type: 'select',
            payload: id
        });
    }

    const contents = globalState.state.objects.map((obj, i) => {
        return (
            <Prim 
                key={obj.id}
                id={obj.id} 
                data={obj} 
                onSelect={onSelect}
                selected={obj.id === globalState.state.selected}
            />
        );
    });

    return (
        <div className={styles.pane3d}>
            <Canvas>
                <directionalLight 
                    intensity={1.0} 
                    position={[5, 10, 5]}
                />
                <ambientLight intensity={0.2} />
                <OrbitControls />
                <gridHelper args={[20, 20]} />

                <group>
                    {contents}
                </group>
            </Canvas>
        </div>
    );
}

export default Pane3d;