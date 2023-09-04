import { ReactNode } from "react";

const PIXEL_VAL_LOWER_BOUND = 0;
const PIXEL_VAL_HIGHER_BOUND = 255;

class Pixel {
    private r!: number;
    private g!: number;
    private b!: number;
    private a!: number;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0, unckecked: boolean = false) {
        this.setR(r, unckecked);
        this.setG(g, unckecked);
        this.setB(b, unckecked);
        this.setA(a, unckecked);
    }

    getR(): number { return this.r; }
    getG(): number { return this.g; }
    getB(): number { return this.b; }
    getA(): number { return this.a; }

    setR(r: number, unckecked: boolean = false) {
        if (unckecked) {
            this.r = r;
        } else {
            this.r = Math.floor(r);
            if (r < PIXEL_VAL_LOWER_BOUND) { this.r = 0; }
            if (r > PIXEL_VAL_HIGHER_BOUND) { this.r = 255; }
        }
    }

    setG(g: number, unckecked: boolean = false) {
        if (unckecked) {
            this.g = g;
        } else {
            this.g = Math.floor(g);
            if (g < PIXEL_VAL_LOWER_BOUND) { this.g = 0; }
            if (g > PIXEL_VAL_HIGHER_BOUND) { this.g = 255; }
        }
    }

    setB(b: number, unckecked: boolean = false) {
        if (unckecked) {
            this.b = b;
        } else {
            this.b = Math.floor(b);
            if (b < PIXEL_VAL_LOWER_BOUND) { this.b = 0; }
            if (b > PIXEL_VAL_HIGHER_BOUND) { this.b = 255; }
        }
    }

    setA(a: number, unckecked: boolean = false) {
        if (unckecked) {
            this.a = a;
        } else {
            this.a = Math.floor(a);
            if (a < PIXEL_VAL_LOWER_BOUND) { this.a = 0; }
            if (a > PIXEL_VAL_HIGHER_BOUND) { this.a = 255; }
        }
    }

    static fromUint8ClampedArray(data: Uint8ClampedArray, width: number, height: number): Pixel[][] {
        const SPACING = 4;
        let pixels2DArray: Pixel[][] = [];

        for (let y = 0; y < (width * height * SPACING); y += width * SPACING) {
            pixels2DArray.push([]);
            let arrRow = y / (width * SPACING);

            for (let x = 0; x < width * SPACING; x += SPACING) {
                pixels2DArray[arrRow].push(new Pixel(
                    data[y + x + 0],
                    data[y + x + 1],
                    data[y + x + 2],
                    data[y + x + 3],
                    true
                ));
            }
        }

        return pixels2DArray;
    }

    static toHTMLTable(data: Pixel[][]) {
        const WIDTH = data[0].length;
        const HEIGHT = data.length;

        let rows: ReactNode[] = [];
        for (let y = 0; y < HEIGHT; y++) {
            let row: ReactNode[] = [];
            for (let x = 0; x < WIDTH; x++) {
                row.push(<td key={y*x} style={{backgroundColor: `rgba(${data[y][x].getR()}, ${data[y][x].getG()}, ${data[y][x].getB()}, ${data[y][x].getA()})`}} ></td>)
            }
            rows.push(<tr key={y}>{row}</tr>);
        }

        return (<table>{rows}</table>);
    }
}

export default Pixel;
export { PIXEL_VAL_HIGHER_BOUND, PIXEL_VAL_LOWER_BOUND };
