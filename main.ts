import { UI, Button, Overlay } from "./ui.js";
import { Component } from "./components/component.js";
import { Conveyor } from "./components/conveyor.js";
import {
    Adder,
    Multiplier,
    Divider,
    Subtractor,
} from "./components/operator.js";
import { Producer } from "./components/producer.js";
import { Space } from "./components/space.js";
import { TOTAL_SIZE } from "./draw.js";

type ComponentConstructor = new (
    x: number,
    y: number,
    direction: string,
) => Component;

const componentRegister: { [name: string]: ComponentConstructor } = {
    Conveyor: Conveyor,
    Adder: Adder,
    Multiplier: Multiplier,
    Subtractor: Subtractor,
    Divider: Divider,
    Producer: Producer,
    Remove: Space,
};

/** Holds the game state and the UI */
class Game {
    /** Number of columns on the map grid */
    private width: number;
    /** Number of rows on the map grid */
    private height: number;

    /** Holds a set of components that need to be progressed */
    private components: Set<Component> = new Set();
    /** Holds a set of components that need to be rendered */
    private componentsToRender: Set<Component> = new Set();
    /** A component instance for each position on the map */
    private grid: Component[][] = new Array();

    private ui: UI;
    /** The constructor of the specific component that will be placed on click */
    private activeComponent: ComponentConstructor = Conveyor;
    /** The starting ponit of a mouse drag when it has been initiated */
    private dragStart = { x: 0, y: 0 };

    constructor(width: number, height: number, ui: UI) {
        this.width = width;
        this.height = height;

        this.ui = ui;
        this.setupUI();

        // initialize the map with all Space
        for (let i = 0; i < width; i++) {
            let column = new Array();
            this.grid.push(column);
            for (let j = 0; j < height; j++) {
                column.push(new Space(i, j, "n"));
            }
        }

        // initial default map for debugging
        // this.addComponent(new Producer(2, 5, "n"));
        // this.addComponent(new Conveyor(2, 6, "n"));
        // this.addComponent(new Conveyor(2, 7, "n"));

        // this.addComponent(new Producer(4, 5, "n"));
        // this.addComponent(new Conveyor(4, 6, "n"));
        // this.addComponent(new Conveyor(4, 7, "n"));

        // this.addComponent(new Adder(3, 7, "n"));
        // this.addComponent(new Conveyor(3, 8, "n"));
        // this.addComponent(new Conveyor(3, 9, "n"));

        // this.addComponent(new Conveyor(2, 7, ["n"]));
        // this.addComponent(new Adder(2, 8, ["n", "e", "w"]));
        // //this.addComponent(new Multiplier(2, 9, ["n", "e", "w"]));
        // this.addComponent(new Conveyor(2, 10, ["n"]));
        // this.addComponent(new Conveyor(2, 11, ["n"]));
        // this.addComponent(new Conveyor(2, 12, ["n"]));

        // this.addComponent(new Conveyor(1, 12, ["w"]));
        // this.addComponent(new Conveyor(0, 12, ["w"]));
        // this.addComponent(new Conveyor(0, 11, ["s"]));
        // this.addComponent(new Conveyor(0, 10, ["s"]));
        // this.addComponent(new Conveyor(0, 9, ["s"]));
        // this.addComponent(new Conveyor(1, 9, ["e"]));

        // this.addComponent(new Producer(5, 5, []));
        // this.addComponent(new Conveyor(5, 6, ["n"]));
        // this.addComponent(new Conveyor(5, 7, ["n"]));
        // this.addComponent(new Conveyor(5, 8, ["n"]));
        // this.addComponent(new Conveyor(5, 9, ["n"]));
        // this.addComponent(new Conveyor(4, 9, ["w"]));
        //this.addComponent(new Conveyor(3, 9, ["w"]));
    }

    /** Setup all ui elements and the functionality for the user to interact */
    setupUI() {
        // Add a button for each possible tool
        let i = 0;
        for (let toolName in componentRegister) {
            let b = new Button(10 + 210 * i, 10, 200, 50, toolName);
            b.setOnClick((_x: number, _y: number) => {
                this.activeComponent = componentRegister[toolName];
            });

            this.ui.addElement(b);
            i++;
        }

        let save = new Button(10, 70, 200, 50, "Save");
        save.setOnClick((_x: number, _y: number) => {
            this.saveState();
        });
        this.ui.addElement(save);

        let restore = new Button(220, 70, 200, 50, "Restore");
        restore.setOnClick((_x: number, _y: number) => {
            this.restoreState();
        });
        this.ui.addElement(restore);

        // An invisible overlay, that will receive the user input events
        let overlay = new Overlay(0, 0, 1000, 1000);
        overlay.setOnMouseDown((x: number, y: number) => {
            this.dragStart = { x: x, y: y };
        });

        overlay.setOnMouseUp((x: number, y: number) => {
            // determine the cardinal directions of the drag
            let xDiff = x - this.dragStart.x;
            let yDiff = y - this.dragStart.y;
            let xDirection = xDiff > 0 ? "e" : "w";
            let yDirection = yDiff > 0 ? "n" : "s";

            // find the position on the map grid for the start and end point
            let grid_x_start = Math.floor(this.dragStart.x / TOTAL_SIZE);
            let grid_y_start = Math.floor(this.dragStart.y / TOTAL_SIZE);
            let grid_x_end = Math.floor(x / TOTAL_SIZE);
            let grid_y_end = Math.floor(y / TOTAL_SIZE);

            // choose the main direction of the drag and place components along that in a straight line
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                let a = Math.min(grid_x_start, grid_x_end);
                let b = Math.max(grid_x_start, grid_x_end);
                for (let x = a; x <= b; x++) {
                    this.addComponent(
                        new this.activeComponent(x, grid_y_start, xDirection),
                    );
                }
            } else {
                let a = Math.min(grid_y_start, grid_y_end);
                let b = Math.max(grid_y_start, grid_y_end);
                for (let y = a; y <= b; y++) {
                    this.addComponent(
                        new this.activeComponent(grid_x_start, y, yDirection),
                    );
                }
            }
        });
        this.ui.addElement(overlay);
    }

    /** Return the component at the given grid position, or a Space when the position is outside of the grid. */
    getComponent(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return new Space(x, y, "n");
        }
        return this.grid[x][y];
    }

    /** Add a new component to the grid.
     *
     * If the target position of the component is already occupied, the component will be overridden.
     */
    addComponent(component: Component) {
        let current = this.grid[component.x][component.y];

        if (!(current instanceof Space) && !(component instanceof Space)) {
            current.setInputDirection(component.getDirection(), true);
            return;
        }

        this.components.delete(current);

        this.grid[component.x][component.y] = component;
        this.componentsToRender.add(component);
        if (!(component instanceof Space)) {
            this.components.add(component);
        }
    }

    /** Render all components that have been added to be rendered. */
    render(ctx: CanvasRenderingContext2D) {
        for (let component of this.componentsToRender) {
            component.render(ctx);
            this.componentsToRender.delete(component);
        }
        this.ui.render(ctx);
    }

    /** Advance the internal state of each component. */
    tickStates() {
        for (let c of this.components) {
            c.tickState();
            this.componentsToRender.add(c);
        }
    }

    /** Collect values for all inputs of each component. */
    stepInputs() {
        for (let c of this.components) {
            c.receiveInputs(
                this.getComponent(c.x, c.y - 1),
                this.getComponent(c.x - 1, c.y),
                this.getComponent(c.x, c.y + 1),
                this.getComponent(c.x + 1, c.y),
            );
        }
    }

    /** Save the current map components to the localStorage. */
    saveState() {
        let savedComponents: {
            name: string;
            x: number;
            y: number;
            direction: string;
            inputDirections: string[];
        }[] = [];

        for (let componentToSave of this.components) {
            let className: string | null = null;
            for (let name in componentRegister) {
                if (componentToSave instanceof componentRegister[name]) {
                    className = name;
                    break;
                }
            }

            if (className == null) {
                continue;
            }

            savedComponents.push({
                name: className,
                x: componentToSave.x,
                y: componentToSave.y,
                direction: componentToSave.getDirection(),
                inputDirections: Array.from(
                    componentToSave.getInputDirections(),
                ),
            });
        }

        localStorage.setItem("map", JSON.stringify(savedComponents));
    }

    /** Restore the map from the localStorage. */
    restoreState() {
        let savedComponents: {
            name: string;
            x: number;
            y: number;
            direction: string;
            inputDirections: string[];
        }[] = JSON.parse(localStorage.getItem("map") as string);

        for (let serializedComponent of savedComponents) {
            let constructor = componentRegister[serializedComponent.name];

            let component: Component = new constructor(
                serializedComponent.x,
                serializedComponent.y,
                serializedComponent.direction,
            );
            for (let direction of serializedComponent.inputDirections) {
                component.setInputDirection(direction, true);
            }

            this.addComponent(component);
        }

        console.log(savedComponents);
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

    let ui = new UI(canvas);
    let game = new Game(100, 100, ui);

    setInterval(() => {
        game.stepInputs();
        game.tickStates();
    }, 0.01);

    setInterval(() => {
        game.render(ctx);
    }, 10);
}

init();
