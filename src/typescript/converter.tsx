import { Dispatch, MutableRefObject, ReactNode, createContext, useContext } from "react";
import Settings from "./settings";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

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

class ConverterTS {
    readonly settings: Settings;
    canvas: MutableRefObject<HTMLCanvasElement | undefined>;
    readonly reader: FileReader;

    private inputFile?: File;
    private inputImage?: HTMLImageElement;
    private outputTable: HTMLTableElement;


    constructor(settings: Settings, canvas: MutableRefObject<HTMLCanvasElement | undefined>, reader?: FileReader, inputFile?: File, inputImage?: HTMLImageElement, outputTable?: any) {
        this.settings = settings;
        this.canvas = canvas;
        this.reader = (reader ?? new FileReader);
        this.inputFile = inputFile;
        this.inputImage = inputImage;
        this.outputTable = (outputTable ?? "Output test");
    }

    getInputFile(): File | undefined { return this.inputFile; }
    setInputFile(image: File) {
        this.inputImage = new Image();
        this.inputFile = image; 
    }

    /**
     * WARNING!
     * Remember to do `setInputImage` with the `converterDispatch` for the current image.
     */
    getInputImage(): HTMLImageElement | undefined { return this.inputImage; }

    getInputImageURL(): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            if (this.inputFile === undefined) { 
                resolve(undefined);
            }

            if (this.inputImage !== undefined && this.inputImage.src.length !== 0) {
                resolve(this.inputImage.src);
            }

            this.reader.onload = () => {
                if (this.reader.result === null || this.reader.result instanceof ArrayBuffer) { 
                    throw Error("Unhandled result.");
                }
                resolve(this.reader.result);
            }

            this.reader.readAsDataURL(this.inputFile!);
        });
    }
    setInputImageURL(URL: string | undefined) {
        if (this.inputImage === undefined) { this.inputImage = new Image(); }
        this.inputImage.src = (URL ?? "");
    }

    getOutputTable(): any { return this.outputTable; }
    setOutputTable(table: any) { this.outputTable = table; }

    convert() {
        if (this.inputImage === undefined) { throw Error("No input image found."); }
        if (this.canvas.current === undefined) { throw Error("No canvas found."); }

        const WIDTH = Math.floor(this.inputImage.width / this.settings.getScaleDownMultiplier());
        const HEIGHT = Math.floor(this.inputImage.height / this.settings.getScaleDownMultiplier());

        console.log(this.settings);

        // Set canvas size
        this.canvas.current.width = WIDTH;
        this.canvas.current.height = HEIGHT;

        // Get canvas context
        const CANVAS_CONTEXT = this.canvas.current.getContext('2d', { willReadFrequently: true });
        if (CANVAS_CONTEXT === null) { throw Error("No canvas found."); }
        
        // Draw image to canvas
        CANVAS_CONTEXT.drawImage(this.inputImage, 0, 0, WIDTH, HEIGHT);

        // Get scaled image
        const SCALED_IMAGE = CANVAS_CONTEXT.getImageData(0, 0, WIDTH, HEIGHT);

        // Transform the scaled image to 2D array of `Pixel`s
        let imageAsPixels: Pixel[][] = Pixel.fromUint8ClampedArray(SCALED_IMAGE.data, WIDTH, HEIGHT);

        // Set table
        this.setOutputTable(Pixel.toHTMLTable(imageAsPixels));
        // navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([renderToStaticMarkup(table)], { type: 'text/html' }) })]);
    }
}

interface ConverterDispatchAction {
    SetScaleDownMultiplier?: { multiplier: number },
    SetInputFile?: { file: File },
    SetInputImageURL?: { URL: string | undefined },
    Convert?: { },
}

/**
 * Handles actions on the `Convereter` class.
 * @param state Current state of `Convereter`.
 * @param actions Array of actions to be executed. No more than one action should be defined per item.
 * @returns New `Converter` with actions performed on it.
 */
function converterReducer(state: ConverterTS, actions: ConverterDispatchAction[]) {
    let newState = new ConverterTS(
        state.settings,
        state.canvas,
        state.reader,
        state.getInputFile(),
        state.getInputImage(),
        state.getOutputTable(),
    );

    actions.forEach((action) => {
        if (Object.values(action).length > 1) { throw Error("More than one action in an item was passed to the `Settings` dispatcher."); }

        switch (true) {
            case (action.SetScaleDownMultiplier !== undefined): {
                newState.settings.setScaleDownMultiplier(action.SetScaleDownMultiplier!.multiplier);
                break;
            }

            case (action.SetInputFile !== undefined): {
                newState.setInputFile(action.SetInputFile!.file);
                break;
            }

            case (action.SetInputImageURL !== undefined): {
                newState.setInputImageURL(action.SetInputImageURL!.URL);
                break;
            }

            case (action.Convert !== undefined): {
                newState.convert();
                break;
            }
        }
    })

    return newState;
}

export default ConverterTS;
export type { ConverterDispatchAction };
export { converterReducer };

export const ConverterContext = createContext<ConverterTS | undefined>(undefined);
export function useConverterContext(): ConverterTS {
    if (ConverterContext === undefined) { throw Error("SettingsContext is undefined."); }
    return useContext(ConverterContext)!;
}

export const ConverterDispatchContext = createContext<Dispatch<ConverterDispatchAction[]> | undefined>(undefined);
export function useConverterDispatchContext(): Dispatch<ConverterDispatchAction[]> {
    if (ConverterDispatchContext === undefined) throw Error("SettingsDispatchContext is undefined.");
    return useContext(ConverterDispatchContext)!;
}