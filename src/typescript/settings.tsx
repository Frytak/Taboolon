import { UseState, UseStrucer, asUseStrucer, setUseStrucerDefault } from "./useStrucer";

const DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS = [1, 2, 4, 8, 16, 32];

class Settings {
    private possibleScaleDownMultipliers: UseStrucer<number[]>;
    private customScaleDownMultiplier: UseStrucer<boolean>;
    private currentScaleDownMultiplier: UseStrucer<number>;
    private tablePixelLimit: UseStrucer<number>;

    constructor(
        possibleScaleDownMiltipliers: UseState<number[] | undefined>,
        customScaleDownMultiplier: UseState<boolean | undefined>,
        currentScaleDownMultiplier: UseState<number | undefined>,
        tablePixelLimit: UseState<number | undefined>
    ) {
        this.possibleScaleDownMultipliers = setUseStrucerDefault(asUseStrucer(possibleScaleDownMiltipliers), DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS);
        this.customScaleDownMultiplier = setUseStrucerDefault(asUseStrucer(customScaleDownMultiplier), false);
        this.currentScaleDownMultiplier = setUseStrucerDefault(asUseStrucer(currentScaleDownMultiplier), 1);
        this.tablePixelLimit = setUseStrucerDefault(asUseStrucer(tablePixelLimit), 40_000);

        console.log(this);
    }

    getPossibleScaleDownMultipliers(): number[] {
        return this.possibleScaleDownMultipliers.value;
    }

    setPossibleScaleDownMultipliers(possibleScaleDownMiltipliers?: number[]) {
        this.possibleScaleDownMultipliers.set(possibleScaleDownMiltipliers ?? DEFAULT_POSSIBLE_SCALE_DOWN_MULTIPLIERS);
    }

    getCustomScaleDownMultiplier(): boolean {
        return this.customScaleDownMultiplier.value;
    }

    setCustomScaleDownMultiplier(customScaleDownMultiplier: boolean) {
        this.customScaleDownMultiplier.set(customScaleDownMultiplier);
    }

    getCurrentScaleDownMultiplier(): number {
        return this.currentScaleDownMultiplier.value;
    }

    setCurrentScaleDownMultiplier(scaleDownMultiplier: number) {
        this.currentScaleDownMultiplier.set(scaleDownMultiplier);
    }

    getTablePixelLimit(): number {
        return this.tablePixelLimit.value;
    }

    setTablePixelLimit(outputTablePixelLimit: number) {
        if (outputTablePixelLimit > 0) { this.tablePixelLimit.set(0); return; }
        this.tablePixelLimit.set(outputTablePixelLimit);
    }
}

export default Settings;