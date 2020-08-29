import ExF, { Component, State } from './packages';


@Component({
    selector: 'exf-app'
})
export class App {
    green = 'green';

    @State
    className = '1';
    
    @State
    name = 'alex';

    @State
    list: string[] = ['i','i','i'];

    handleClick = (e: any) => {
        this.list = [...this.list, 'ivaneeee'];
    }

    handleRemove = (e: any) => {
        this.list = this.list.slice(0, this.list.length - 1)
    }

    handleClassName = (e: any) => {
        this.className = '2'
    }

    handleInput = (e: any) => {
        this.name = e.target.value;
    }

    log() {
        console.log('work')
    }

    render() {
        return (
            <div id="ivan" className={this.className}>
                <div style={{ backgroundColor: 'black' }}>
                    <button onClick={this.handleClick}>Add Item</button>
                    <button onClick={this.handleRemove}>Remove Item</button>
                    <button onClick={this.handleClassName}>Change className</button>
                </div>
                <input onInput={this.handleInput} />
                <div>
                    <p className={this.className}>{this.name}</p>
                </div>
                <div>
                    {this.list.map(item => {
                        return <p>{item}</p>
                    })}
                </div>
            </div>
        )
    }
}
