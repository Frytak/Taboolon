class Settings {
    private scaleDownMultiplier: number;

    constructor(scaleDownMultiplier?: number) {
        this.scaleDownMultiplier = (scaleDownMultiplier ?? 1);
    }

    getScaleDownMultiplier(): number { return this.scaleDownMultiplier; }
    setScaleDownMultiplier(scaleDownMultiplier: number) {
        this.scaleDownMultiplier = scaleDownMultiplier;
    }
}

export default Settings;