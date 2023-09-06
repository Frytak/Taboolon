import style from "./Converter.module.css";
import { ReactElement, memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Button from "../Standard/Button/Button";
import Settings from "@/typescript/settings";
import ConverterTS, { ConverterContext, ConverterDispatchContext, converterReducer } from "@/typescript/converter";
import ScaleDownTo, { ScaleDownToProps } from "./ConverterOptions/Scale/ScaleDownTo/ScaleDownTo";
import InputImage from "./IO/InputImage/InputImage";
import Scale from "./ConverterOptions/Scale/Scale";
import OutputPreview from "./IO/OutputPreview/OutputPreview";
import Loader from "./Loader/Loader";
import { renderToStaticMarkup } from "react-dom/server";

interface ConverterProps {
  className?: string,
}

function Converter(props: ConverterProps) {
    const canvas = useRef<HTMLCanvasElement | undefined>(undefined);
    const [converter, converterDispatch] = useReducer(
      converterReducer,
      new ConverterTS(new Settings(undefined, false, 32), canvas)
    )

    const [inputImage, setInputImage] = useState<HTMLImageElement | undefined>(undefined);
    useEffect(() => {
      converter.getImageURL().then((imageURL) => {
        if (imageURL !== undefined && imageURL.length !== 0 && converter.getImage() === undefined) {
          converterDispatch([{ SetInputImageURL: { URL: imageURL, then: ((converter) => {
            if (!converter.isScaleDownMultiplierApropariate()) {
              converterDispatch([{ SetScaleDownMultiplier: { multiplier: converter.highestApropariateScaleDownMultiplier() ?? converter.getPossibleScaleDownMultipliers()[-1] } }])
            } else {
              converterDispatch([{ ImageURLSet: {} }])
            }
          }) } }]);
        }
        setInputImage(converter.getImage());
      });
    }, [converter])

    function handleImageSubmition(file: File) { converterDispatch([{ SetInputFile: { file: file } }]) }
    function handleConvert() { converterDispatch([{ Convert: {} }]); }
    function handleCopyTable() {
      const TABLE = converter.getTable();
      if (TABLE === undefined) { return; }
      navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([renderToStaticMarkup(TABLE)], { type: 'text/html' }) })]);
    }

    let memoScaleOptions = useMemo((): ReactElement<ScaleDownToProps>[] => {
        let newScaleOptions: ReactElement<ScaleDownToProps>[] = [];

        converter.getPossibleScaleDownMultipliers().forEach((scale, index) => {
          newScaleOptions.push( <ScaleDownTo key={index} className={style.scaleDownTo} scaleTo={scale} /> )
        })

        return newScaleOptions;
    }, [converter])

    return (
      <section className={[style.converter, props.className].join(' ')}>

        <div className={style.input}>
          <ConverterContext.Provider value={converter}>
            <ConverterDispatchContext.Provider value={converterDispatch}>
              <InputImage image={inputImage} onImageSubmit={handleImageSubmition} />
              <Scale className={style.scaleOptions}>{memoScaleOptions}</Scale>
            </ConverterDispatchContext.Provider>
          </ConverterContext.Provider>
        </div>

        <Loader />
        <Button onClick={handleConvert}>Convert!</Button>
        
        <div className={style.output}>
          <OutputPreview canvasRef={canvas}/>
          <Button onClick={handleCopyTable}>Copy table</Button>
        </div>

      </section>
    )
}

export default memo(Converter);