import { StateProvider, store } from "../data/store";
import Editor from "../components/editor";

const Home = () => {
    return(
        <StateProvider store={store}>
            <Editor />
        </StateProvider>
    )
}

export default Home;