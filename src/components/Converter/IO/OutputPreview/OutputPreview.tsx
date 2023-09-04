import { memo } from "react";
import style from "./OutputPreview.module.css";
import box_style from "../Box.module.css";

interface OutputPreviewProps {
    canvasRef?: any,
}

function OutputPreview(props: OutputPreviewProps) {
    return (
        <div className={[box_style.box, style.outputPreview].join(' ')}>
            <canvas ref={props.canvasRef} className={style.canvas}></canvas>
        </div>
    )
}

export default memo(OutputPreview);