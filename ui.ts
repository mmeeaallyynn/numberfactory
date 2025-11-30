export class UIElement {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected onclick = () => {};
    protected onhover = () => {};
    constructor(x: number, y: number, width: number, height: number, parent) {}
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
