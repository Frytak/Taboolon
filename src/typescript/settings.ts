const DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS = [1, 2, 4, 8, 16, 32];

class Settings {
    private possibleScaleDownMultipliers: number[];
    private customScaleDownMultiplier: boolean;
    private currentScaleDownMultiplier: number;
    private tablePixelLimit: number;

    constructor(possibleScaleDownMiltipliers?: number[], customScaleDownMultiplier?: boolean, scaleDownMultiplier?: number, outputTablePixelLimit?: number) {
        this.possibleScaleDownMultipliers = (possibleScaleDownMiltipliers ?? DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS);
        this.customScaleDownMultiplier = (customScaleDownMultiplier ?? false);
        this.currentScaleDownMultiplier = (scaleDownMultiplier ?? 1);
        this.tablePixelLimit = (outputTablePixelLimit ?? 40_000);
    }

    getPossibleScaleDownMultipliers(): number[] {
        return [...this.possibleScaleDownMultipliers];
    }

    setPossibleScaleDownMultipliers(possibleScaleDownMiltipliers?: number[]) {
        this.possibleScaleDownMultipliers = (possibleScaleDownMiltipliers ?? DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS);
    }

    getCustomScaleDownMultiplier(): boolean {
        return this.customScaleDownMultiplier;
    }

    setCustomScaleDownMultiplier(customScaleDownMultiplier: boolean) {
        this.customScaleDownMultiplier = customScaleDownMultiplier;
    }

    getCurrentScaleDownMultiplier(): number { return this.currentScaleDownMultiplier; }
    setCurrentScaleDownMultiplier(scaleDownMultiplier: number) {
        this.currentScaleDownMultiplier = scaleDownMultiplier;
    }

    getTablePixelLimit(): number { return this.tablePixelLimit; }
    setTablePixelLimit(outputTablePixelLimit: number) {
        if (outputTablePixelLimit > 0) { this.tablePixelLimit = 0; return; }
        this.tablePixelLimit = outputTablePixelLimit;
    }
}

export default Settings;