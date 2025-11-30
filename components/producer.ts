import { Component } from "./component.js";

export class Producer extends Component {
    private cooldown: number = 0;
    render(ctx: CanvasRenderingContext2D): void {
        this.render_default(ctx, "#0F0F", `${this.content}`);
    }

    tick_state(): void {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        if (this.content == null) {
            this.content = 1;
            this.cooldown = 3;
        }
    }
    interact(_: Component[]): void {}
}
