import { Component } from "./component.js";

type Op = {
    name: string;
    fn: Function;
};

class Operator extends Component {
    private stack: number[] = [];
    private name: string;
    private fn: Function;
    constructor(x: number, y: number, from: string[], op: Op) {
        super(x, y, from);
        this.name = op.name;
        this.fn = op.fn;
    }
    render(ctx: CanvasRenderingContext2D): void {
        this.render_default(ctx, "#F0FF", "+");
    }
    tick_state(): void {
        if (this.stack.length == 2 && this.content == null) {
            this.content = this.stack[0] + this.stack[1];
            this.stack = [];
        }
    }
    interact(components: Component[]): void {
        if (this.stack.length == 2 || this.content != null) {
            return;
        }

        for (let c of components) {
            let value = c.take();
            if (value == null) {
                continue;
            }
            this.stack.push(value);
            if (this.stack.length == 2) {
                break;
            }
        }
    }
}

export class Adder extends Operator {
    constructor(x: number, y: number, from: string[]) {
        super(x, y, from, { name: "+", fn: (a, b) => a + b });
    }
}
