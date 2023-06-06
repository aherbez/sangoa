import { useContext } from "react";
import { store } from "../../src/data/store";

const Prim = (props) => {
    const globalState = useContext(store);
    const { dispatch } = globalState;
    console.log('prim', globalState);

    const { data } = props;

    const click = (e) => {
        console.log(`clicked on object ${data.id}`);
        props.onSelect(data.id);
    }

    const color = "gray"; // (data.id === globalState.state.selected) ? 'red' : 'gray';

    return (        
        <mesh position={data.p}
            onClick={click}
        >
            <boxGeometry args={data.b} />
            <meshStandardMaterial 
                color={color} 
            />
            {props.selected &&
                <axesHelper args={[2]} />
            }
        </mesh>
    );
}

export default Prim;