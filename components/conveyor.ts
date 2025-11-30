import { Component } from "./component.js";

/** Take in some input and move it into the content section after one tick. */
export class Conveyor extends Component {
    private waiting_room: number | null = null;
    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(
            ctx,
            "#F00F",
            `${this.content == null ? "" : this.content}`,
        );
    }

    tickState(): void {
        if (this.waiting_room != null) {
            this.content = this.waiting_room;
            this.waiting_room = null;
        }
    }

    interact(components: Map<string, Component>): void {
        if (this.content != null) {
            return;
        }
        for (let d in components) {
            let value = components.get(d)?.take();
            if (value != null) {
                this.waiting_room = value;
                break;
            }
        }
    }
}
