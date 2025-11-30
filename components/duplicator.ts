import { Component } from "./component.js";

/** Duplicate the input number */
export class Duplicator extends Component {
    private outputs: number[] = [];

    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#0FA", "");
    }

    tickState(): void {}
    interact(components: Map<string, Component>): void {
        if (this.outputs.length > 0) {
            return;
        }

        for (let [_, component] of components) {
            let value = component.take();
            if (value != null) {
                this.outputs = [value, value];
                break;
            }
        }
    }

    take(): number | null {
        return this.outputs.pop() || null;
    }
}
