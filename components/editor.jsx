import { useContext } from "react";
import { store, StateProvider } from "../src/data/store";
import Pane3d from "./panes/pane3d";
import PaneUI from "./panes/paneUI";

const Editor = (props) => {
    const globalState = useContext(store);
    const { dispatch } = globalState;

    // console.log('editor', globalState);

    const onSelect = (id) => {
        // console.log('select', id);
        dispatch({
            type: 'select',
            payload: id
        });
    }

    return (
        <StateProvider store={store}>
            <div>
                <Pane3d 
                    onSelect={onSelect}
                />
                <PaneUI />
            </div>
        </StateProvider>
    );
}

export default Editor;