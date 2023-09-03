import style from "./Converter.module.css";
import { ReactElement, memo, useEffect, useReducer, useRef, useState } from "react";
import Button from "../Standard/Button/Button";
import Settings from "@/typescript/settings";
import ConverterTS, { ConverterContext, ConverterDispatchContext, converterReducer } from "@/typescript/converter";
import ScaleDownTo, { ScaleDownToProps } from "./ConverterOptions/Scale/ScaleDownTo/ScaleDownTo";
import InputImage from "./IO/InputImage/InputImage";
import ConversionOptions from "./ConverterOptions/ConversionOptions";
import Scale from "./ConverterOptions/Scale/Scale";
import OutputPreview from "./IO/OutputPreview/OutputPreview";
import Loader from "./Loader/Loader";
import { createContext } from "vm";

interface ConverterProps {
  className?: string,
}

function Converter(props: ConverterProps) {
    const canvas = useRef<HTMLCanvasElement | undefined>(undefined);
    const [converter, converterDispatch] = useReducer(
      converterReducer,
      new ConverterTS(new Settings(32), canvas)
    )

    const [inputImage, setInputImage] = useState<HTMLImageElement | undefined>(undefined);
    useEffect(() => {
      converter.getInputImageURL().then((imageURL) => {
        if (imageURL !== undefined && imageURL.length !== 0 && converter.getInputImage()?.src.length === 0) {
          converterDispatch([{ SetInputImageURL: { URL: imageURL } }]);
        }
        setInputImage(converter.getInputImage());
      });
    }, [converter])

    function handleImageSubmition(file: File) { converterDispatch([{ SetInputFile: { file: file } }]) }
    function handleConvert() { converterDispatch([{ Convert: {} }]); }

    const renderScaleOptions = (howMany: number): ReactElement<ScaleDownToProps>[] => {
        let newScaleOptions: ReactElement<ScaleDownToProps>[] = [];

        for (let i = 0; i < howMany; i++) {
            newScaleOptions.push( <ScaleDownTo key={i} className={style.scaleDownTo} scaleTo={2**i} /> )
        }

        return newScaleOptions;
    }

    return (
      <section className={[style.converter, props.className].join(' ')}>
        <ConverterContext.Provider value={converter}>
          <ConverterDispatchContext.Provider value={converterDispatch}>
            <section className={style.input}>
              <InputImage image={inputImage} onImageSubmit={handleImageSubmition} />
              <Scale className={style.scaleOptions}>{renderScaleOptions(6)}</Scale>
            </section>
          </ConverterDispatchContext.Provider>
        </ConverterContext.Provider>
            <Loader />
            <Button onClick={handleConvert}>
              Convert!
            </Button>
            <OutputPreview canvasRef={canvas}/>
      </section>
    )
}

export default memo(Converter);