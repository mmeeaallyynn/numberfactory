import { Component } from "./component.js";

/** Ininite trash bin */
export class Bin extends Component {
    render(ctx: CanvasRenderingContext2D): void {
        this.renderDefault(ctx, "#AF0", "");
    }

    tickState(): void {}
    interact(components: Map<string, Component>): void {
        for (let [_, component] of components) {
            let _ = component.take();
        }
    }
}
