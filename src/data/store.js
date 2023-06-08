import { createContext, useReducer } from "react";

const objLookup = new Map();

const initialState = {
    selected: -1,
    nextId: 2,
    objLookup: objLookup,
    objects: []
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({children}) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add':
                const newObj = {
                    id: state.nextId,
                    ...action.payload
                }
                const newLookup = new Map(state.objLookup);
                newLookup.set(state.nextId, newObj);
                const newState = {
                    objLookup: newLookup,
                    nextId: state.nextId + 1,
                    selected: newObj.id,
                    objects: [...state.objects, newObj]
                }
                // console.log(newState);
                return newState;
            case 'select':
                console.log('selecting', action.payload);
                return {
                    ...state,
                    selected: action.payload 
                }
            case 'remove':
                console.log('remove')
                return state;
            case 'inflate':
                const obj = state.objLookup.get(state.selected);
                obj.b = [...obj.b.map((v) => v * action.payload)]
                const newLookupInfl = new Map(state.objLookup);
                newLookupInfl.set(state.selected, obj);

                const newStateInfl = {
                    ...state,
                    objLookup: newLookupInfl,
                }
                return newStateInfl;
            case 'move':                
                let objToMove = state.objLookup.get(state.selected);
                if (!objToMove) {
                    return state;
                }
                console.log('move', action.payload, objToMove);
                objToMove.p = [...objToMove.p.map((v, i) => v + action.payload[i])];
                
                const newLookupMove = new Map(state.objLookup);
                newLookupMove.set(state.selected, objToMove);
                const newStateMove = {
                    ...state,
                    objLookup: newLookupMove,
                }
                return newStateMove;
            case 'moveto':
                let objToMoveTo = state.objLookup.get(state.selected);
                if (!objToMoveTo) {
                    return state;
                }
                console.log('moveto', action.payload);
                objToMoveTo.p = [...action.payload];
                
                const newLookupMoveTo = new Map(state.objLookup);
                newLookupMoveTo.set(state.selected, objToMoveTo);
                const newStateMoveTo = {
                    ...state,
                    objLookup: newLookupMoveTo,
                }
                return newStateMoveTo;
            case 'delete':
                const newLookupDel = new Map(state.objLookup);
                newLookupDel.delete(state.selected);
                const newStateDel = {
                    ...state,
                    objLookup: newLookupDel,
                    selected: -1,
                    objects: state.objects.filter((obj) => obj.id !== state.selected)
                }
                return newStateDel;
            default:
                throw new Error(`unknown action ${action}`);
        };
    }, initialState);

    return <Provider value={{state, dispatch}}>{children}</Provider>
};

export { store, StateProvider }