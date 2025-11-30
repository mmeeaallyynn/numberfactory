import { Component } from "./component.js";

/** Take in some input and move it into the content section after one tick. */
export class Conveyor extends Component {
    private waitingRoom: number | null = null;
    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(
            ctx,
            "#F00F",
            `${this.content == null ? "" : this.content}`,
        );
    }

    tickState(): void {
        if (this.waitingRoom != null) {
            this.content = this.waitingRoom;
            this.waitingRoom = null;
        }
    }

    interact(components: Map<string, Component>): void {
        if (this.content != null) {
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
}
