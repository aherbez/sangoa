import { store } from "../../data/store";
import { useContext } from "react";
import { boxData, sphereData, randPos } from "../../data/objHelpers";
import styles from "./panes.module.css"

const PaneUI = (props) => {
    
    const globalState = useContext(store);
    const { dispatch } = globalState;
    // console.log('paneUI', globalState);
    
    const addBox = () => {
        console.log('add box');
        
        const b = boxData(1);
        b.p = randPos(10);
        
        dispatch({ 
            type: 'add',
            payload: b
        });
    }

    const addSphere = () => {
        console.log('add sphere');

        const s = sphereData(1);
        s.p = randPos(10);

        dispatch({
            type: 'add',
            payload: s
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
    
    return (
        <div className={styles.paneUI}>
            <button onClick={addBox}>Add Box</button>
            <button onClick={addSphere}>Add Sphere</button>
            <hr />
            <button onClick={inflate}>Inflate</button>
            <button onClick={deleteObj}>Delete</button>
            <hr />
            { (globalState.state.selected !== -1) &&
                <div>
                    <span>selected: </span>
                    <span>{globalState.state.selected}</span>
                </div>
            }

        </div>
    );
}

export default PaneUI;