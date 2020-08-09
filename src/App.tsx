import { ExF, Component, State } from './packages';


@Component({
    selector: 'exf-app'
})
export class App {
    @State
    name = 'alex';

    @State
    list: string[] = [];

    handleClick = (e: any) => {
        this.list = [...this.list, 'ivaneeee'];
    }

    handleInput = (e: any) => {
        this.name = e.target.value;
    }

    render() {
        return <div id="ivan" className="pesho">
            <div>
                <button onClick={this.handleClick}>Add Item</button>
            </div>
            <input onInput={this.handleInput} />
            <div>
                <p>{this.name}</p>
            </div>
            <div>
                {this.list}
            </div>
        </div>
    }
}
