import { Component } from "./component.js";

export class Conveyor extends Component {
    private waiting_room: number | null = null;
    render(ctx: CanvasRenderingContext2D): void {
        this.render_default(ctx, "#F00F", `${this.content || ""}`);
    }

    tick_state(): void {
        if (this.waiting_room != null) {
            this.content = this.waiting_room;
            this.waiting_room = null;
        }
    }

    interact(components: Component[]): void {
        if (this.content != null) {
            return;
        }

        for (let c of components) {
            let value = c.take();
            if (value != null) {
                this.waiting_room = value;
                break;
            }
        }
    }
}
