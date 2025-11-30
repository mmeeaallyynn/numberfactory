/** Holds UI elements */
export class UI {
    private parent: HTMLElement;
    private uiElements: UIElement[] = new Array();
    private onkeydown: Function = (key: string) => {};

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.setupEvents();
    }

    /** Process mousedown events
     * If the click is in bounds of multiple elements, only the last receives the event
     */
    onMouseDown(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            if (element.mouseDownEvent(event.x, event.y)) {
                break;
            }
        }
    }

    /** Process mouseup events
     * All elements within bounds receive the event
     */
    onMouseUp(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            element.mouseUpEvent(event.x, event.y);
        }
    }

    /** Process click events
     * If the click is in bounds of multiple elements, only the last receives the event
     */
    onClick(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            if (element.clickEvent(event.x, event.y)) {
                break;
            }
        }
    }

    /** Process hover events
     * All elements within bounds receive the event
     */
    onHover(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            element.moveEvent(event.x, event.y);
        }
    }

    setupEvents() {
        this.parent.addEventListener("click", (event) => {
            this.onClick(event);
        });
        this.parent.addEventListener("mousemove", (event) => {
            this.onHover(event);
        });
        this.parent.addEventListener("mousedown", (event) => {
            this.onMouseDown(event);
        });
        this.parent.addEventListener("mouseup", (event) => {
            this.onMouseUp(event);
        });

        // The keydown listener is global, since it can't be attached to a canvas element
        document.addEventListener("keydown", (event) => {
            this.onkeydown(event.key);
        });
    }

    /** Set the function that will be executed on key press */
    setOnKeyDown(onkeydown: (key: string) => void) {
        this.onkeydown = onkeydown;
    }

    render(ctx: CanvasRenderingContext2D) {
        for (let element of this.uiElements) {
            element.render(ctx);
        }
    }

    addElement(element: UIElement) {
        this.uiElements.push(element);
    }
}

/** A UI element with a given position and size that can be interacted with */
export class UIElement {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected onclick: Function = (x: number, y: number) => {};
    protected onmove: Function = (x: number, y: number) => {};
    protected onmousedown: Function = (x: number, y: number) => {};
    protected onmouseup: Function = (x: number, y: number) => {};

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /** Return true if the coordinates are out of bounds of this element */
    protected outOfBounds(x: number, y: number): boolean {
        return (
            x <= this.x ||
            y <= this.y ||
            x >= this.x + this.width ||
            y >= this.y + this.height
        );
    }

    /** Call the onclick handler if the coordinates are within bounds
     * Return true if it was a hit
     */
    clickEvent(x: number, y: number): boolean {
        if (this.outOfBounds(x, y)) {
            return false;
        }

        this.onclick(x, y);
        return true;
    }

    /** Call the onmove event handler */
    moveEvent(x: number, y: number) {
        this.onmove(x, y);
    }

    /** Call the onmousedown handler if the coordinates are within bounds
     * Return true if it was a hit
     */
    mouseDownEvent(x: number, y: number): boolean {
        if (this.outOfBounds(x, y)) {
            return false;
        }

        this.onmousedown(x, y);
        return true;
    }

    /** Call the onmouseup handler if the coordinates are within bounds */
    mouseUpEvent(x: number, y: number) {
        if (this.outOfBounds(x, y)) {
            return;
        }

        this.onmouseup(x, y);
    }

    /** Set the onclick event handler */
    setOnClick(onclick: Function) {
        this.onclick = onclick;
    }

    /** Set the onmousedown event handler */
    setOnMouseDown(onmousedown: Function) {
        this.onmousedown = onmousedown;
    }

    /** Set the onmouseup event handler */
    setOnMouseUp(onmouseup: Function) {
        this.onmouseup = onmouseup;
    }
}

/** A Button UI Element */
export class Button extends UIElement {
    private text: string;
    private hovered: boolean = false;
    private highlighted: boolean = false;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
    ) {
        super(x, y, width, height);
        this.text = text;
        this.onmove = (x: number, y: number) => {
            this.hovered = !this.outOfBounds(x, y);
        };
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        if (this.highlighted) {
            ctx.fillStyle = "#DFD";
        } else if (this.hovered) {
            ctx.fillStyle = "#DDD";
        } else {
            ctx.fillStyle = "#999";
        }
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.font = "30px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#000";
        ctx.strokeText(
            this.text,
            this.x + this.width / 2,
            this.y + this.height / 2,
        );
        ctx.fillText(
            this.text,
            this.x + this.width / 2,
            this.y + this.height / 2,
        );
    }

    /** Render this button in a highlighted color if enabled */
    setHighlight(enabled: boolean) {
        this.highlighted = enabled;
    }
}

/** A transparent UI Element */
export class Overlay extends UIElement {
    render(ctx: CanvasRenderingContext2D): void {}
}
