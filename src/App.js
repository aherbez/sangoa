import { useContext } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
import { StateProvider, store } from './data/store';
import EditorPanel from './ui/editor';
import World from './scene/world';
import './App.css';

function App() {
  return (
    <StateProvider>
      <div className="panel-main">
        <World />
        <EditorPanel 
        />
      </div>
    </StateProvider>
 
  );
}

export default App;
