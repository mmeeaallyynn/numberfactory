export class UI {
    private parent: HTMLElement;
    private uiElements: UIElement[] = new Array();

    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.setupEvents();
    }

    onMouseDown(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            if (element.mouseDownEvent(event.x, event.y)) {
                break;
            }
        }
    }

    onMouseUp(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            element.mouseUpEvent(event.x, event.y);
        }
    }

    onClick(event: MouseEvent) {
        for (let idx = this.uiElements.length - 1; idx >= 0; idx--) {
            let element = this.uiElements[idx];
            if (element.clickEvent(event.x, event.y)) {
                break;
            }
        }
    }

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

    protected outOfBounds(x: number, y: number): boolean {
        return (
            x <= this.x ||
            y <= this.y ||
            x >= this.x + this.width ||
            y >= this.y + this.height
        );
    }

    clickEvent(x: number, y: number): boolean {
        if (this.outOfBounds(x, y)) {
            return false;
        }

        this.onclick(x, y);
        return true;
    }

    moveEvent(x: number, y: number) {
        this.onmove(x, y);
    }

    mouseDownEvent(x: number, y: number): boolean {
        if (this.outOfBounds(x, y)) {
            return false;
        }

        this.onmousedown(x, y);
        return true;
    }

    mouseUpEvent(x: number, y: number) {
        if (this.outOfBounds(x, y)) {
            return;
        }

        this.onmouseup(x, y);
    }

    setOnClick(onclick: Function) {
        this.onclick = onclick;
    }

    setOnMouseDown(onmousedown: Function) {
        this.onmousedown = onmousedown;
    }

    setOnMouseUp(onmouseup: Function) {
        this.onmouseup = onmouseup;
    }
}

export class Button extends UIElement {
    private text: string;
    private hovered: boolean = false;

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
        if (this.hovered) {
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
}

export class Overlay extends UIElement {
    render(ctx: CanvasRenderingContext2D): void {}
}
