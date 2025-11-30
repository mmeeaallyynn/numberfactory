import { Component } from "./component.js";
import { SQUARE_SIZE, TOTAL_SIZE } from "../draw.js";

/** Ininite trash bin */
export class Bin extends Component {
    private previousRenderWidth = 0;
    render(ctx: CanvasRenderingContext2D): void {
        let text = `${this.content}`;
        // Draw the text on top of the square
        ctx.font = "30px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";

        ctx.clearRect(
            TOTAL_SIZE * this.x +
                SQUARE_SIZE / 2 -
                this.previousRenderWidth / 2,
            TOTAL_SIZE * this.y + SQUARE_SIZE / 2 - 30 / 2,
            this.previousRenderWidth,
            30,
        );
        this.previousRenderWidth = ctx.measureText(text).width;

        this.renderDefault(ctx, "#AF0", text);
    }

    tickState(): void {}
    interact(components: Map<string, Component>): void {
        let value: number | null = null;
        for (let [_, component] of components) {
            value = component.take();
        }

        if (value != null) {
            this.content = value;
        }
    }
}
