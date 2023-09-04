import style from "./Converter.module.css";
import { ReactElement, memo, useEffect, useReducer, useRef, useState } from "react";
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
      new ConverterTS(new Settings(32), canvas)
    )

    const [inputImage, setInputImage] = useState<HTMLImageElement | undefined>(undefined);
    useEffect(() => {
      converter.getImageURL().then((imageURL) => {
        if (imageURL !== undefined && imageURL.length !== 0 && converter.getImage()?.src.length === 0) {
          converterDispatch([{ SetInputImageURL: { URL: imageURL } }]);
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

    const renderScaleOptions = (howMany: number): ReactElement<ScaleDownToProps>[] => {
        let newScaleOptions: ReactElement<ScaleDownToProps>[] = [];

        for (let i = 0; i < howMany; i++) {
            newScaleOptions.push( <ScaleDownTo key={i} className={style.scaleDownTo} scaleTo={2**i} /> )
        }

        return newScaleOptions;
    }

    return (
      <section className={[style.converter, props.className].join(' ')}>

        <div className={style.input}>
          <ConverterContext.Provider value={converter}>
            <ConverterDispatchContext.Provider value={converterDispatch}>
              <InputImage image={inputImage} onImageSubmit={handleImageSubmition} />
              <Scale className={style.scaleOptions}>{renderScaleOptions(6)}</Scale>
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