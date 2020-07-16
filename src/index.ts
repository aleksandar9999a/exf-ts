import { RouterLink } from "./components/RouterLink";
import { RouterOutlet } from "./components/RouterOutlet";
import { About } from "./components/About";
import { Contacts } from "./components/Contacts";
import { App } from "./App";
import { Home } from "./components/Home/Home";
import { Test } from "./components/Test";
import { ExFModule } from "./packages";


export default ExFModule({
    components: [
        RouterLink,
        RouterOutlet,
        App,
        About,
        Test,
        Contacts,
        Home
    ],
    modules: [],
    bootstraps: [App]
})