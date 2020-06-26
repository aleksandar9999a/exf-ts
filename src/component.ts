import { createHTMLSource } from "./packages/ex-html/index";
import { state } from "./packages/decorators/state";
import { Component } from "./packages/decorators/Component";

const rootTemplate = (context: any) => createHTMLSource`
<div>
    <button @click=${() => context.counter++}>test</button>
    <p>${context.counter}</p>
</div>
`;

@Component({
    selector: "ex-app",
    templateFn: rootTemplate
})
class AppRoot {
    @state counter = 0;

    constructor() {

    }
}
