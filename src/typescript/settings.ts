class Settings {
    private scaleDownMultiplier: number;
    private tablePixelLimit: number;

    constructor(scaleDownMultiplier?: number, outputTablePixelLimit?: number) {
        this.scaleDownMultiplier = (scaleDownMultiplier ?? 1);
        this.tablePixelLimit = (outputTablePixelLimit ?? 40_000);
    }

    getScaleDownMultiplier(): number { return this.scaleDownMultiplier; }
    setScaleDownMultiplier(scaleDownMultiplier: number) {
        this.scaleDownMultiplier = scaleDownMultiplier;
    }

    getTablePixelLimit(): number { return this.tablePixelLimit; }
    setTablePixelLimit(outputTablePixelLimit: number) {
        if (outputTablePixelLimit > 0) { this.tablePixelLimit = 0; return; }
        this.tablePixelLimit = outputTablePixelLimit;
    }
}

export default Settings;