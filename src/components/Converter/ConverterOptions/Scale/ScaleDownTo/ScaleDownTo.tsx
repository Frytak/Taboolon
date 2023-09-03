import Button from "@/components/Standard/Button/Button";
import { useConverterDispatchContext } from "@/typescript/converter";
import { memo } from "react";

export interface ScaleDownToProps {
    scaleTo: number;
    className?: string;
}

function ScaleDownTo(props: ScaleDownToProps) {
    const converterDispatch = useConverterDispatchContext();

    function handleClick() {
        converterDispatch([{ SetScaleDownMultiplier: { multiplier: props.scaleTo } }]);
    }

    return (
        <Button className={props.className} onClick={handleClick}>
            <p>x{props.scaleTo}</p>
        </Button>
    )
}

export default memo(ScaleDownTo);