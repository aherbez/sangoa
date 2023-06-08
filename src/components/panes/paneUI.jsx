import { store } from "../../data/store";
import { useContext } from "react";
import { boxData, sphereData, randPos } from "../../data/objHelpers";
import SDF from "../sdf";
import styles from "./panes.module.css"

const PaneUI = (props) => {
    
    const globalState = useContext(store);
    const { dispatch } = globalState;
    console.log('paneUI', globalState);

    const objects = Array.from(globalState.state.objLookup.values());
    
    const addBox = () => {
        console.log('add box');
        
        const b = boxData(1);
        b.p = randPos(5);
        
        dispatch({ 
            type: 'add',
            payload: b
        });
    }

    const addSphere = () => {
        console.log('add sphere');

        const s = sphereData(1);
        s.p = randPos(5);

        dispatch({
            type: 'add',
            payload: s
        });
    }

    const obj1 = () => {
        dispatch({
            type: 'add',
            payload: {
                t: 1,
                p: [0, 1.75, 3],
                r: [-30,0,-30],
                b: [1,0.5,0.5],
                op: 1,
                sm: 0
            }
        });
    }

    const obj2 = () => {
        dispatch({
            type: 'add',
            payload: {
                t: 2,
                p: [0., 1.5, 3],
                r: [0,0,0],
                b: [0.325, 0.75, 0.75],
                op: 1,
                sm: 0.25
            }
        });
    }

    const inflate = () => {
        console.log('inflate');
        dispatch({
            type: 'inflate',
            payload: 1.5
        });
    }

    const deleteObj = () => {
        console.log('delete');
        dispatch({
            type: 'delete',
            payload: null
        });
    }

    const nudgeLeft = () => {
        dispatch({
            type: 'move',
            payload: [-1, 0, 0]
        });
    }
    const nudgeRight = () => {
        dispatch({
            type: 'move',
            payload: [1, 0, 0]
        });
    }
    const nudgeUp = () => {
        dispatch({
            type: 'move',
            payload: [0, 1, 0]
        });
    }
    const nudgeDown = () => {
        dispatch({
            type: 'move',
            payload: [0, -1, 0]
        });
    }
    
    return (
        <div className={styles.paneUI}>
            <button onClick={addBox}>Add Box</button>
            <button onClick={addSphere}>Add Sphere</button>
            <hr />
            <button onClick={inflate}>Inflate</button>
            <button onClick={deleteObj}>Delete</button>
            <hr />
            <button onClick={nudgeLeft}>&lt;--</button>
            <button onClick={nudgeUp}>^</button>
            <button onClick={nudgeDown}>V</button>
            <button onClick={nudgeRight}>--&gt;</button>
            { (globalState.state.selected !== -1) &&
                <div>
                    <span>selected: </span>
                    <span>{globalState.state.selected}</span>
                </div>
            }

            <SDF 
                objects={objects}
            />
        </div>
    );
}

export default PaneUI;