import { createContext, useReducer } from "react";

const initialState = {objects: []};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({children}) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add':
                const newState = {
                    objects: [...state.objects, 'o']
                }
                return newState;
            default:
                throw new Error(`unknown action ${action}`);
        };
    }, initialState);

    return <Provider value={{state, dispatch}}>{children}</Provider>
};

export { store, StateProvider }