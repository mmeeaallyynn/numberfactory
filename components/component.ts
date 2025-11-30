import {
    draw_arrow,
    SQUARE_SIZE,
    SQUARE_DISTANCE,
    TOTAL_SIZE,
} from "../draw.js";

export abstract class Component {
    protected content: number | null = null;
    x: number;
    y: number;
    protected from: string[];
    constructor(x: number, y: number, from: string[]) {
        this.x = x;
        this.y = y;
        this.from = from;
    }
    take(): number | null {
        let value = this.content;
        this.content = null;
        return value;
    }
    take_inputs(n: Component, e: Component, s: Component, w: Component): void {
        let possible_inputs = [n, e, s, w];
        let directions = ["n", "e", "s", "w"];
        let inputs: Component[] = [];
        for (let idx in directions) {
            if (this.from.includes(directions[idx])) {
                inputs.push(possible_inputs[idx]);
            }
        }

        this.interact(inputs);
    }
    render_default(
        ctx: CanvasRenderingContext2D,
        color: string,
        text: string,
    ): void {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(
            TOTAL_SIZE * this.x,
            TOTAL_SIZE * this.y,
            SQUARE_SIZE,
            SQUARE_SIZE,
        );
        ctx.fill();
        for (let direction of this.from) {
            draw_arrow(
                ctx,
                this.x * TOTAL_SIZE,
                this.y * TOTAL_SIZE,
                TOTAL_SIZE,
                direction,
            );
        }

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.strokeText(
            text,
            TOTAL_SIZE * this.x + SQUARE_SIZE / 2,
            TOTAL_SIZE * this.y + SQUARE_SIZE / 2,
        );
    }
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract tick_state(): void;
    abstract interact(components: Component[]): void;
}
