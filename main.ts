import { UIElement } from "./ui.js";
import { Component } from "./components/component.js";
import { Conveyor } from "./components/conveyor.js";
import { Adder } from "./components/adder.js";
import { Producer } from "./components/producer.js";
import { Space } from "./components/space.js";

class Game {
    private width: number;
    private height: number;
    private grid: Component[][] = new Array();
    private components: Component[] = new Array();
    private uiElements: UIElement[] = new Array();

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let i = 0; i < width; i++) {
            let column = new Array();
            this.grid.push(column);
            for (let j = 0; j < height; j++) {
                column.push(new Space(i, j, []));
            }
        }
        console.log(this.grid);

        this.addComponent(new Producer(2, 5, []));
        this.addComponent(new Conveyor(2, 6, ["n"]));
        this.addComponent(new Conveyor(2, 7, ["n"]));
        this.addComponent(new Conveyor(2, 8, ["n"]));
        this.addComponent(new Adder(2, 9, ["n", "e", "w"]));
        this.addComponent(new Conveyor(2, 10, ["n"]));
        this.addComponent(new Conveyor(2, 11, ["n"]));
        this.addComponent(new Conveyor(2, 12, ["n"]));

        this.addComponent(new Conveyor(1, 12, ["w"]));
        this.addComponent(new Conveyor(0, 12, ["w"]));
        this.addComponent(new Conveyor(0, 11, ["s"]));
        this.addComponent(new Conveyor(0, 10, ["s"]));
        this.addComponent(new Conveyor(0, 9, ["s"]));
        this.addComponent(new Conveyor(1, 9, ["e"]));

        this.addComponent(new Producer(5, 5, []));
        this.addComponent(new Conveyor(5, 6, ["n"]));
        this.addComponent(new Conveyor(5, 7, ["n"]));
        this.addComponent(new Conveyor(5, 8, ["n"]));
        this.addComponent(new Conveyor(5, 9, ["n"]));
        this.addComponent(new Conveyor(4, 9, ["w"]));
        //this.addComponent(new Conveyor(3, 9, ["w"]));
    }

    getComponent(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return new Space(x, y, []);
        }
        return this.grid[x][y];
    }

    addComponent(component: Component) {
        this.grid[component.x][component.y] = component;
        this.components.push(component);
    }

    drawSelectorBar(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(0, window.innerHeight - 80, window.innerWidth, 80);
        ctx.fill();
    }

    render(ctx: CanvasRenderingContext2D) {
        this.grid.forEach((column, _) => {
            column.forEach((component, _) => {
                component.render(ctx);
            });
        });
        this.drawSelectorBar(ctx);
    }

    tick_states() {
        for (let c of this.components) {
            c.tick_state();
        }
    }

    step_inputs() {
        for (let c of this.components) {
            c.take_inputs(
                this.getComponent(c.x, c.y - 1),
                this.getComponent(c.x - 1, c.y),
                this.getComponent(c.x, c.y + 1),
                this.getComponent(c.x + 1, c.y),
            );
        }
    }
}

export function init() {
    let canvas: HTMLCanvasElement | null = document.getElementById(
        "canvas",
    ) as HTMLCanvasElement;
    let resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let game = new Game(100, 100);

    setInterval(() => {
        game.step_inputs();
        game.tick_states();
        ctx.clearRect(0, 0, 1000, 1000);
        game.render(ctx);
    }, 200);
}

init();
