import { useContext } from "react";
import { store } from "../../data/store";

const Prim = (props) => {
    const globalState = useContext(store);
    const { dispatch } = globalState;
    // console.log('prim', globalState);

    const { data } = props;

    const click = (e) => {
        console.log(`clicked on object ${data.id}`);
        props.onSelect(data.id);
    }

    const makeGeo = (data) => {
        switch (data.t) {
            case 1:
                return (
                    <boxGeometry args={data.b} />
                );
            case 2:
                return (
                    <sphereGeometry args={[data.b[0], 32, 32]} />
                );
            default:
                return null;
        }
    }
    const geo = makeGeo(data);

    const color = "gray"; // (data.id === globalState.state.selected) ? 'red' : 'gray';

    return (        
        <mesh position={data.p}
            onClick={click}
        >
            {geo}
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