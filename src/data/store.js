import { createContext, useReducer } from "react";

const initialState = {objects: [
    {
        t: 1,
        p: [0, 1.75, 3],
        r: [0,0,0],
        b: [1,1,1],
        op: 2,
        sm: 0.25,
    }    
]};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({children}) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add':
                const newState = {
                    objects: [...state.objects, action.payload]
                }
                console.log(newState);
                return newState;
            default:
                throw new Error(`unknown action ${action}`);
        };
    }, initialState);

    return <Provider value={{state, dispatch}}>{children}</Provider>
};

export { store, StateProvider }