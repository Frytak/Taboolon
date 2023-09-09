import { UseState, UseStrucer, asUseStrucer, setUseStrucerDefault } from "./useStrucer";
import { Dispatch, MutableRefObject, ReactElement, TableHTMLAttributes, createContext, useContext } from "react";
import Settings from "./settings";
import Pixel from "./pixel";

class ConverterTS {
    readonly settings: Settings;

    readonly canvas: MutableRefObject<HTMLCanvasElement | undefined>;
    private reader: FileReader;

    private file: UseStrucer<File | undefined>;
    private image: UseStrucer<HTMLImageElement | undefined>;
    private table?: ReactElement<TableHTMLAttributes<any>>;


    constructor(
        settings: Settings,
        canvas: MutableRefObject<HTMLCanvasElement | undefined>,
        inputFile: UseState<File | undefined>,
        inputImage: UseState<HTMLImageElement | undefined>,
    ) {
        this.reader = new FileReader;

        this.settings = settings;
        this.canvas = canvas;
        this.file = asUseStrucer(inputFile);
        this.image = asUseStrucer(inputImage);

        console.log(this);
    }

    getScaleDownMultiplier(): number { return this.settings.getCurrentScaleDownMultiplier(); }
    getPossibleScaleDownMultipliers(): number[] { return this.settings.getPossibleScaleDownMultipliers(); }
    getCustomScaleDownMultiplier(): boolean { return this.settings.getCustomScaleDownMultiplier(); }

    highestApropariateScaleDownMultiplier(): number | undefined {
        const POSSIBLE_SCALE_DOWN_MULTIPLIERS = this.getPossibleScaleDownMultipliers(); 
        for (let i = 0; i < POSSIBLE_SCALE_DOWN_MULTIPLIERS.length; i++) {
            if (this.isScaleDownMultiplierApropariate(POSSIBLE_SCALE_DOWN_MULTIPLIERS[i])) {
                return POSSIBLE_SCALE_DOWN_MULTIPLIERS[i];
            }
        };
        return;
    }

    isScaleDownMultiplierApropariate(scaleDownMultiplier?: number): boolean {
        const SCALED_IMAGE_PIXEL_TOTAL = this.getScaledImagePixelTotalBy(scaleDownMultiplier ?? this.getScaleDownMultiplier());
        

        if (SCALED_IMAGE_PIXEL_TOTAL === undefined) { return true; }
        if (SCALED_IMAGE_PIXEL_TOTAL > this.getTablePixelLimit()) { return false; }

        return true;
    }

    setScaleDownMultiplier(scaleDownMultiplier: number) { 
        if (!this.isScaleDownMultiplierApropariate(scaleDownMultiplier)) { return; }
        this.settings.setCurrentScaleDownMultiplier(scaleDownMultiplier);
    }

    getTablePixelLimit(): number {
        return this.settings.getTablePixelLimit();
    }

    setTablePixelLimit(outputTablePixelLimit: number) {
        this.settings.setTablePixelLimit(outputTablePixelLimit);
    }

    // Input file
    getFile(): File | undefined { return this.file.value; }
    setFile(file: File) {
        this.image.set(undefined);
        this.file.set(file); 
    }

    // Input Image
    getImage(): HTMLImageElement | undefined {
        return this.image.value;
    }

    setImage(image: HTMLImageElement | undefined) {
        this.image.set(image);
    }

    getImagePixelWidth(): number | undefined {
        return this.getImage()?.width;
    }

    getImagePixelHeight(): number | undefined {
        return this.getImage()?.height;
    }

    getImagePixelTotal(): number | undefined {
        const WIDTH = this.getImagePixelWidth();
        const HEIGHT = this.getImagePixelHeight();

        if (WIDTH === undefined) { return undefined; }
        if (HEIGHT === undefined) { return undefined; }

        return WIDTH * HEIGHT;
    }

    getScaledImagePixelWidthBy(scaleDownMultiplier: number): number | undefined {
        let WIDTH = this.getImagePixelWidth();
        if (WIDTH === undefined) { return undefined; }

        return Math.floor(WIDTH / scaleDownMultiplier);
    }

    getScaledImagePixelHeightBy(scaleDownMultiplier: number): number | undefined {
        let HEIGHT = this.getImagePixelHeight();
        if (HEIGHT === undefined) { return undefined; }

        return Math.floor(HEIGHT / scaleDownMultiplier);
    }
    
    getScaledImagePixelTotalBy(scaleDownMultiplier: number): number | undefined {
        const SCALED_WIDTH = this.getScaledImagePixelWidthBy(scaleDownMultiplier);
        const SCALED_HEIGHT = this.getScaledImagePixelHeightBy(scaleDownMultiplier);

        if (SCALED_WIDTH === undefined) { return undefined; }
        if (SCALED_HEIGHT === undefined) { return undefined; }

        return SCALED_WIDTH * SCALED_HEIGHT;
    }

    getScaledImagePixelWidth(): number | undefined {
        let SCALE_DOWN_MULTIPLIER = this.getScaleDownMultiplier();
        if (SCALE_DOWN_MULTIPLIER === undefined) { return undefined; }

        return this.getScaledImagePixelWidthBy(SCALE_DOWN_MULTIPLIER);
    }

    getScaledImagePixelHeight(): number | undefined {
        let SCALE_DOWN_MULTIPLIER = this.getScaleDownMultiplier();
        if (SCALE_DOWN_MULTIPLIER === undefined) { return undefined; }

        return this.getScaledImagePixelHeightBy(SCALE_DOWN_MULTIPLIER);
    }
    
    getScaledImagePixelTotal(): number | undefined {
        let SCALE_DOWN_MULTIPLIER = this.getScaleDownMultiplier();
        if (SCALE_DOWN_MULTIPLIER === undefined) { return undefined; }

        return this.getScaledImagePixelTotalBy(SCALE_DOWN_MULTIPLIER);
    }

    getImageURL(): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            const FILE = this.getFile();
            const IMAGE = this.getImage();

            if (FILE === undefined) { 
                resolve(undefined);
            }

            if (IMAGE !== undefined && IMAGE.src.length !== 0) {
                resolve(IMAGE.src);
            }

            this.reader.onload = () => {
                if (this.reader.result === null || this.reader.result instanceof ArrayBuffer) { 
                    throw Error("Unhandled result.");
                }
                resolve(this.reader.result);
            }

            this.reader.readAsDataURL(FILE!);
        });
    }

    setImageURL(URL: string | undefined): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const IMAGE = this.getImage();
            let newImage = new Image();
            if (IMAGE !== undefined) { newImage = IMAGE; }

            newImage.onload = () => {
                this.setImage(newImage);
                resolve(true);
            }

            newImage.src = (URL ?? "");
        });
    }

    // Output table
    getTable(): ReactElement<TableHTMLAttributes<any>> | undefined { return this.table; }
    setTable(table: ReactElement<TableHTMLAttributes<any>>) { this.table = table; }

    convert() {
        const IMAGE = this.getImage();

        if (IMAGE === undefined) { throw Error("No input image found."); }
        if (this.canvas.current === undefined) { throw Error("No canvas found."); }

        const WIDTH = Math.floor(IMAGE.width / this.settings.getCurrentScaleDownMultiplier());
        const HEIGHT = Math.floor(IMAGE.height / this.settings.getCurrentScaleDownMultiplier());

        // Set canvas size
        this.canvas.current.width = WIDTH;
        this.canvas.current.height = HEIGHT;

        // Get canvas context
        const CANVAS_CONTEXT = this.canvas.current.getContext('2d', { willReadFrequently: true });
        if (CANVAS_CONTEXT === null) { throw Error("No canvas found."); }
        
        // Draw image to canvas
        CANVAS_CONTEXT.drawImage(IMAGE, 0, 0, WIDTH, HEIGHT);

        // Get scaled image
        const SCALED_IMAGE = CANVAS_CONTEXT.getImageData(0, 0, WIDTH, HEIGHT);

        // Transform the scaled image to 2D array of `Pixel`s
        let imageAsPixels: Pixel[][] = Pixel.fromUint8ClampedArray(SCALED_IMAGE.data, WIDTH, HEIGHT);

        // Set table
        this.setTable(Pixel.toHTMLTable(imageAsPixels));
    }
}

interface ConverterDispatchAction {
    SetScaleDownMultiplier?: { multiplier: number },
    SetInputFile?: { file: File },
    SetInputImageURL?: { URL: string | undefined, then?: (converter: ConverterTS) => void },
    ImageURLSet?: { },
    Convert?: { },
}

export default ConverterTS;
export type { ConverterDispatchAction };

export const ConverterContext = createContext<MutableRefObject<ConverterTS> | undefined>(undefined);
export function useConverterContext(): MutableRefObject<ConverterTS> {
    if (ConverterContext === undefined) { throw Error("ConverterContext is undefined."); }
    return useContext(ConverterContext)!;
}