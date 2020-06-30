import { ExFModule } from "./packages";
import { RouterLink } from "./components/RouterLink";
import { RouterOutlet } from "./components/RouterOutlet";
import { About } from "./components/About";
import { Contacts } from "./components/Contacts";
import { App } from "./App";
import { Home } from "./components/Home/Home";


export default ExFModule({
    components: [
        RouterLink,
        RouterOutlet,
        App,
        About,
        Contacts,
        Home
    ]
})
