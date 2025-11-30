export const SQUARE_SIZE = 50;
export const SQUARE_DISTANCE = 5;
export const TOTAL_SIZE = SQUARE_DISTANCE / 2 + SQUARE_SIZE;

export function drawArrow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    direction: string,
) {
    let p1: [number, number];
    let p2: [number, number] = [x + size / 2, y + size / 2];
    let p3: [number, number];
    switch (direction) {
        case "n":
            p1 = [x, y];
            p3 = [x + size, y];
            break;
        case "e":
            p1 = [x, y];
            p3 = [x, y + size];
            break;
        case "s":
            p1 = [x, y + size];
            p3 = [x + size, y + size];
            break;
        default: // "w"
            p1 = [x + size, y];
            p3 = [x + size, y + size];
            break;
    }
    ctx.fillStyle = "#FFFA";
    ctx.beginPath();
    ctx.moveTo(...p1);
    ctx.lineTo(...p2);
    ctx.lineTo(...p3);
    ctx.fill();
    ctx.stroke();
}
