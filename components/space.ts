import { Component } from "./component.js";

export class Space extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        this.render_default(ctx, "#000F", "");
    }

    tick_state(): void {}
    interact(_: Component[]): void {}
}
