import { useContext } from 'react';
import { store } from '../data/store';
import '../App.css';

const EditorPanel = (props) => {
    
    const globalState = useContext(store);
    const { dispatch } = globalState;
    
    const addBox = () => {
      console.log('adding a box');
      
      const pos = [
          Math.random() * 3,
          0, // Math.random() * 3,
          3
      ];

      const size = 1; // Math.random() + 0.25;

      dispatch({
          type: 'add',
          payload: {
                t: 1,
                p: [0, 1.75, 3],
                r: [0,0,0],
                b: [size, size, size],
                op: 2,
                sm: 0.25,
            }
        })
    }
      
    return (
        <div className="panel-editor">
            <div>
                <button 
                    onClick={addBox}
                >Add Box</button>

            </div>
            Editor Panel
            <div id="canvasAttach"></div>
        </div>
    );
}

export default EditorPanel;