import { Component } from "./component.js";

/** Produce a `1` once. */
export class Producer extends Component {
    content: number | null = 1;
    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#0F0F", `${this.content}`);
    }

    tickState(): void {}
    interact(_: Map<string, Component>): void {}
}
