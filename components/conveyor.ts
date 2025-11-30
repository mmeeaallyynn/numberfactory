import { Component } from "./component.js";

/** Take in some input and move it into the content section after one tick. */
export class Conveyor extends Component {
    private waitingRoom: number | null = null;
    render(ctx: CanvasRenderingContext2D): void {
        let contentString: string;
        if (this.content != null) {
            let roundedValue = Math.round(this.content * 100) / 100;
            contentString = `${roundedValue}`;

            if (roundedValue == 0 && this.content != 0) {
                contentString += "...";
            }
        } else {
            contentString = "";
        }
        this.renderDefault(ctx, "#F00F", contentString);
    }

    tickState(): void {
        if (this.waitingRoom != null) {
            this.content = this.waitingRoom;
            this.waitingRoom = null;
        }
    }

    interact(components: Map<string, Component>): void {
        if (this.content != null) {
            return;
        }

        for (let [_, component] of components) {
            let value = component.take();
            if (value != null) {
                this.waitingRoom = value;
                break;
            }
        }
    }
}
