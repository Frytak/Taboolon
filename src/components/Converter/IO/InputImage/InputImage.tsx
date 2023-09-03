import style from "./InputImage.module.css";
import { ChangeEvent, ReactNode, memo, useMemo, useRef, useState } from "react";
import box_style from "../Box.module.css";

interface InputImageProps {
    image?: HTMLImageElement;
    className?: string,
    onImageSubmit?: (image: File) => void,
}

function InputImage(props: InputImageProps) {
    function handleFileSumbition(event: ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.files === null || props.onImageSubmit === undefined) { return; }
        props.onImageSubmit(event.currentTarget.files[0]);
    }

    let memoRenderImage = useMemo((): ReactNode => {
        if (props.image !== undefined && props.image.src.length !== 0) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={props.image.src} alt="Your Image" className={style.image}/>;
        } else {
            return <p>Choose an image</p>;
        }
    }, [props.image])

    return (
        <section className={[box_style.box, style.inputImage, props.className].join(' ')}>
            <label htmlFor="inputImage" className={style.inputLabel}>
                {memoRenderImage}
            </label>
            <input id="inputImage" className={style.inputFile} type="file" accept="image/*" onChange={handleFileSumbition}/>
        </section>
    )
}

export default memo(InputImage);