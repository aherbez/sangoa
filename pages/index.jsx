import { StateProvider, store } from "../src/data/store";
import World from "../src/components/world";
import EditorPanel from "../src/ui/editor";

const Home = () => {
    return(
        <StateProvider store={store}>
            <div>
                <World />
                <EditorPanel />
            </div>
        </StateProvider>
    )
}

export default Home;