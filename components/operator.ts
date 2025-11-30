import { Component } from "./component.js";

/** Abstract Binary Operator */
abstract class Operator extends Component {
    /** Holds inputs for each input direction or null if empty. */
    private slots: Map<string, number | null>;
    /** The name of the operator */
    protected abstract name: string;
    /** A function that executes the binary operation */
    protected abstract fn: Function;

    constructor(x: number, y: number, direction: string) {
        super(x, y, direction);
        // Use inputs for left and right of the direction
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

        // TODO: Input direction may be modified, but the slots are not changed in that case.
        // Initialize the slots for each input directions with zero
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

        for (let [direction, component] of components) {
            if (this.slots.get(direction) != null) {
                continue;
            }
            let value = component.take();
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
