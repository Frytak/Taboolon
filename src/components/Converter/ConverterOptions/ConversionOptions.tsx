import ConverterTS, { ConverterDispatchAction } from "@/typescript/converter";
import { Dispatch, memo, useState } from "react";

interface ConversionOptionsProps {
    settings: ConverterTS,
    settingsDispatcher: Dispatch<ConverterDispatchAction[]>,

    children?: any,
}

function ConversionOptions(props: ConversionOptionsProps) {
    return (
        <section>
            {props.children}
        </section>
    )
}

export default memo(ConversionOptions);