import Button from "@/components/Standard/Button/Button";
import { useConverterDispatchContext } from "@/typescript/converter";
import { memo } from "react";

export interface ScaleDownToProps {
    scaleTo: number;
    disabled?: boolean;
    className?: string;
}

function ScaleDownTo(props: ScaleDownToProps) {
    const converterDispatch = useConverterDispatchContext();

    function handleClick() {
        converterDispatch([{ SetScaleDownMultiplier: { multiplier: props.scaleTo } }]);
    }

    return (
        <Button className={props.className} disabled={props.disabled} onClick={handleClick}>
            <p>x{props.scaleTo}</p>
        </Button>
    )
}

export default memo(ScaleDownTo);