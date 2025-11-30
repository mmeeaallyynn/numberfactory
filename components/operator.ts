import { Component } from "./component.js";

abstract class Operator extends Component {
    private slots: Map<string, number | null>;
    protected abstract name: string;
    protected abstract fn: Function;
    constructor(x: number, y: number, direction: string) {
        super(x, y, direction);
        switch (direction[0]) {
            case "n":
                this.inputDirections = new Set(["e", "w"]);
                break;
            case "s":
                this.inputDirections = new Set(["e", "w"]);
                break;
            case "e":
                this.inputDirections = new Set(["n", "s"]);
                break;
            default: // "w"
                this.inputDirections = new Set(["n", "s"]);
                break;
        }
        this.slots = new Map();

        for (let direction of this.inputDirections) {
            this.slots.set(direction, null);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#F0FF", this.name);
    }
    tickState(): void {
        let values: (number | null)[] = [];
        for (let direction of this.inputDirections) {
            // In the consructor we make sure, that for every direction there will be a slot.
            // Therefore we never receive undefined
            values.push(this.slots.get(direction) as number | null);
        }

        if (values.some((v) => v == null)) {
            return;
        }

        this.content = this.fn(...values);

        for (let direction of this.inputDirections) {
            this.slots.set(direction, null);
        }
    }
    interact(components: Map<string, Component>): void {
        if (this.content != null) {
            return;
        }

        for (let direction in components) {
            if (this.slots.get(direction) != null) {
                continue;
            }
            let value = components.get(direction)?.take();
            if (value == null) {
                continue;
            }
            this.slots.set(direction, value);
        }
    }
}

export class Adder extends Operator {
    name = "+";
    fn = (a: number, b: number) => a + b;
}

export class Subtractor extends Operator {
    name = "-";
    fn = (a: number, b: number) => a - b;
}
export class Multiplier extends Operator {
    name = "×";
    fn = (a: number, b: number) => a * b;
}

export class Divider extends Operator {
    name = "/";
    fn = (a: number, b: number) => a / b;
}
