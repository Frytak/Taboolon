import ConverterTS, { ConverterDispatchAction } from "@/typescript/converter";
import { Dispatch, memo, useState } from "react";

interface ConversionOptionsProps {
    settings: ConverterTS,
    settingsDispatcher: Dispatch<ConverterDispatchAction[]>,

    children?: any,
}

function ConversionOptions(props: ConversionOptionsProps) {
    return (
        <div>
            {props.children}
        </div>
    )
}

export default memo(ConversionOptions);