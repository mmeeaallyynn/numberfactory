import { Component } from "./component.js";

/** Duplicate the input number */
export class Duplicator extends Component {
    private outputs: (number | null)[] = [];
    private waitingRoom: number | null = null;

    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#0FA", "");
    }

    tickState(): void {
        if (this.waitingRoom != null) {
            this.outputs = [this.waitingRoom, this.waitingRoom];
            this.waitingRoom = null;
        }
    }
    interact(components: Map<string, Component>): void {
        if (this.outputs.length > 0) {
            return;
        }

        for (let [_, component] of components) {
            let value = component.take();
            if (value != null) {
                this.waitingRoom = value;
                break;
            }
        }
    }

    take(): number | null {
        return this.outputs.pop() || null;
    }
}
