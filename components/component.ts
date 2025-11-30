import { drawArrow, SQUARE_SIZE, TOTAL_SIZE } from "../draw.js";

/** An abstract class from which new components can be created. */
export abstract class Component {
    /** The output field of this component, that can be pulled from other components. */
    protected content: number | null = null;

    /** The x-position on the map grid */
    x: number;
    /** The y-position on the map grid */
    y: number;
    /** The directions of the inputs */
    protected inputDirections: Set<string>;
    protected direction: string;

    constructor(x: number, y: number, direction: string) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.inputDirections = new Set([direction]);
    }

    /** Enable or disable input directions */
    setInputDirection(direction: string, enabled: boolean) {
        if (enabled) {
            this.inputDirections.add(direction);
        } else {
            this.inputDirections.delete(direction);
        }
    }

    /** Called by other components to receive the content. */
    take(): number | null {
        let value = this.content;
        this.content = null;
        return value;
    }

    /** Take in all neighboring components and interact with those, are inputs. */
    receiveInputs(
        n: Component,
        e: Component,
        s: Component,
        w: Component,
    ): void {
        let possibleInputs = [n, e, s, w];
        let directions = ["n", "e", "s", "w"];
        let inputs: Map<string, Component> = new Map();

        for (let idx in directions) {
            if (this.inputDirections.has(directions[idx])) {
                inputs.set(directions[idx], possibleInputs[idx]);
            }
        }

        this.interact(inputs);
    }

    /** Render the component with the default styling. */
    renderDefault(
        ctx: CanvasRenderingContext2D,
        color: string,
        text: string,
    ): void {
        // Draw a square in the given color
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(
            TOTAL_SIZE * this.x,
            TOTAL_SIZE * this.y,
            SQUARE_SIZE,
            SQUARE_SIZE,
        );
        ctx.fill();

        // Overlay triangles, indicating the input directions
        for (let direction of this.inputDirections) {
            drawArrow(
                ctx,
                this.x * TOTAL_SIZE,
                this.y * TOTAL_SIZE,
                TOTAL_SIZE,
                direction,
            );
        }

        // Draw the text on top of the square
        ctx.font = "30px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#000";
        ctx.strokeText(
            text,
            TOTAL_SIZE * this.x + SQUARE_SIZE / 2,
            TOTAL_SIZE * this.y + SQUARE_SIZE / 2,
        );
        ctx.fillText(
            text,
            TOTAL_SIZE * this.x + SQUARE_SIZE / 2,
            TOTAL_SIZE * this.y + SQUARE_SIZE / 2,
        );
    }

    /** Getter for the component direction. */
    getDirection(): string {
        return this.direction;
    }

    /** Getter for the component's input directions. */
    getInputDirections(): Set<string> {
        return this.inputDirections;
    }

    /** Render this component. */
    abstract render(ctx: CanvasRenderingContext2D): void;
    /** Update the internal state of this component. */
    abstract tickState(): void;
    /** Interact with the neighboring components.  */
    abstract interact(components: Map<string, Component>): void;
}
