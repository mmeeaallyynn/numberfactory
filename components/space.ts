import { Component } from "./component.js";

/** Placeholder that does nothing. */
export class Space extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#FFF", "");
    }

    tickState(): void {}
    interact(_: Map<string, Component>): void {}
}
