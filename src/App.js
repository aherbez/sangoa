// import { useRef, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
import EditorPanel from './ui/editor';
import World from './scene/world';
import './App.css';

function App() {
  return (
    <div className="panel-main">
      <World />
      <EditorPanel />
    </div>
  );
}

export default App;
