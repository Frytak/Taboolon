import { Dispatch, MutableRefObject, ReactElement, TableHTMLAttributes, createContext, useContext } from "react";
import Settings from "./settings";
import Pixel from "./pixel";

class ConverterTS {
    readonly canvas: MutableRefObject<HTMLCanvasElement | undefined>;
    private settings: Settings;
    readonly reader: FileReader;

    private file?: File;
    private image?: HTMLImageElement;
    private table?: ReactElement<TableHTMLAttributes<any>>;


    constructor(settings: Settings, canvas: MutableRefObject<HTMLCanvasElement | undefined>, reader?: FileReader, inputFile?: File, inputImage?: HTMLImageElement, outputTable?: ReactElement<TableHTMLAttributes<any>>) {
        this.settings = settings;
        this.canvas = canvas;
        this.reader = (reader ?? new FileReader);
        this.file = inputFile;
        this.image = inputImage;
        this.table = outputTable;
    }

    // Settings
    getSettingsCopy(): Settings {
        return new Settings(
            this.getScaleDownMultiplier(),
            this.getTablePixelLimit()
        );
    }

    getScaleDownMultiplier(): number { return this.settings.getScaleDownMultiplier(); }

    isScaleDownMultiplierApropariate(scaleDownMultiplier: number): boolean {
        const SCALED_IMAGE_PIXEL_TOTAL = this.getScaledImagePixelTotalBy(scaleDownMultiplier);

        if (SCALED_IMAGE_PIXEL_TOTAL === undefined) { return true; }
        if (SCALED_IMAGE_PIXEL_TOTAL > this.getTablePixelLimit()) { return false; }

        return true;
    }

    setScaleDownMultiplier(scaleDownMultiplier: number) {
        if (!this.isScaleDownMultiplierApropariate(scaleDownMultiplier)) { return; }
        this.settings.setScaleDownMultiplier(scaleDownMultiplier);
    }

    getTablePixelLimit(): number {
        return this.settings.getTablePixelLimit();
    }

    setTablePixelLimit(outputTablePixelLimit: number) {
        this.settings.setTablePixelLimit(outputTablePixelLimit);
    }

    // Input file
    getFile(): File | undefined { return this.file; }
    setFile(image: File) {
        this.image = new Image();
        this.file = image; 
    }

    // Input Image
    getImage(): HTMLImageElement | undefined {
        // if (this.image === undefined) { throw Error("No input image from file. Remember to call dispatch function `SetInputImageURL` before using this function."); }
        return this.image;
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
            if (this.file === undefined) { 
                resolve(undefined);
            }

            if (this.image !== undefined && this.image.src.length !== 0) {
                resolve(this.image.src);
            }

            this.reader.onload = () => {
                if (this.reader.result === null || this.reader.result instanceof ArrayBuffer) { 
                    throw Error("Unhandled result.");
                }
                resolve(this.reader.result);
            }

            this.reader.readAsDataURL(this.file!);
        });
    }
    setImageURL(URL: string | undefined) {
        if (this.image === undefined) { this.image = new Image(); }
        this.image.src = (URL ?? "");
    }

    // Output table
    getTable(): ReactElement<TableHTMLAttributes<any>> | undefined { return this.table; }
    setTable(table: ReactElement<TableHTMLAttributes<any>>) { this.table = table; }

    convert() {
        if (this.image === undefined) { throw Error("No input image found."); }
        if (this.canvas.current === undefined) { throw Error("No canvas found."); }

        const WIDTH = Math.floor(this.image.width / this.settings.getScaleDownMultiplier());
        const HEIGHT = Math.floor(this.image.height / this.settings.getScaleDownMultiplier());

        // Set canvas size
        this.canvas.current.width = WIDTH;
        this.canvas.current.height = HEIGHT;

        // Get canvas context
        const CANVAS_CONTEXT = this.canvas.current.getContext('2d', { willReadFrequently: true });
        if (CANVAS_CONTEXT === null) { throw Error("No canvas found."); }
        
        // Draw image to canvas
        CANVAS_CONTEXT.drawImage(this.image, 0, 0, WIDTH, HEIGHT);

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
        state.getSettingsCopy(),
        state.canvas,
        state.reader,
        state.getFile(),
        state.getImage(),
        state.getTable(),
    );

    actions.forEach((action) => {
        if (Object.values(action).length > 1) { throw Error("More than one action in an item was passed to the `Settings` dispatcher."); }

        switch (true) {
            case (action.SetScaleDownMultiplier !== undefined): {
                newState.setScaleDownMultiplier(action.SetScaleDownMultiplier!.multiplier);
                break;
            }

            case (action.SetInputFile !== undefined): {
                newState.setFile(action.SetInputFile!.file);
                break;
            }

            case (action.SetInputImageURL !== undefined): {
                newState.setImageURL(action.SetInputImageURL!.URL);
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