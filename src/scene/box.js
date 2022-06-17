import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

const Box = (props) => {
    const mesh = useRef();
    const [hovered, setHover ] = useState(false);
    const [ active, setActive ] = useState(false);
  
    useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  
    return (
      <mesh
        {...props}
        ref={mesh}
        onClick={(event)=> setActive(!active)}
        onPointerOver={(event)=>setHover(true)}
        onPointerOut={(evt) => setHover(false)}
      >
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
}

export default Box;