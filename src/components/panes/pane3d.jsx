import { useContext, useState, useEffect } from "react";
import { store } from "../../data/store";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Prim from "../geo/prim";
import styles from "./panes.module.css"
import { BaseHandle } from "../geo/baseHandle";

const HandleTest = () => {
    const { scene } = useThree();

    useEffect(() => {
        scene.add(new BaseHandle());
    }, []);

    return(
        <group></group>
    );
}


const Pane3d = (props) => {
    const globalState = useContext(store);
    const { dispatch } = globalState;
    // console.log('pane3d', globalState);
    // console.log('pane3d', Array.from(globalState.state.objLookup));

    /*
    const [handle, setHandle] = useState(null);

    useEffect(() => {
        setHandle(new BaseHandle());
    }
    , []);
    */

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

    const clearSelection = (e) => {
        console.log('clear selection');
        dispatch({
            type: 'select',
            payload: -1
        });
    }

    return (
        <div className={styles.pane3d}>
            <Canvas
            >
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
                <HandleTest />
            </Canvas>
        </div>
    );
}

export default Pane3d;