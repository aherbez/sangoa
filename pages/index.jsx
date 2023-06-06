import { StateProvider, store } from "../src/data/store";
import World from "../src/components/world";
import EditorPanel from "../src/ui/editor";
import Editor from "../components/editor";

const Home = () => {
    return(
        <StateProvider store={store}>
            <Editor />
        </StateProvider>
    )
}

export default Home;