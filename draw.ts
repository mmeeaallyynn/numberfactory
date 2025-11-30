export const SQUARE_SIZE = 50;
export const SQUARE_DISTANCE = 5;
export const TOTAL_SIZE = SQUARE_DISTANCE / 2 + SQUARE_SIZE;

export function drawArrow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    direction: string,
    color: string,
) {
    // arrow points
    let arrow1: [number, number];
    let arrow3: [number, number];

    // connector points
    let connector1: [number, number];

    let center: [number, number] = [x + size / 2, y + size / 2];

    // connector line points
    switch (direction) {
        case "n":
            arrow1 = [x, y];
            arrow3 = [x + size, y];
            connector1 = [x + size / 2, y - size / 2];
            break;
        case "e":
            arrow1 = [x + size, y];
            arrow3 = [x + size, y + size];
            connector1 = [x + size + size / 2, y + size / 2];
            break;
        case "s":
            arrow1 = [x, y + size];
            arrow3 = [x + size, y + size];
            connector1 = [x + size / 2, y + size + size / 2];
            break;
        default: // "w"
            arrow1 = [x, y];
            arrow3 = [x, y + size];
            connector1 = [x - size / 2, y + size / 2];
            break;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(...arrow1);
    ctx.lineTo(...center);
    ctx.lineTo(...arrow3);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(...center);
    ctx.lineTo(...connector1);
    ctx.stroke();
}
