import style from "./Converter.module.css";
import { ReactElement, memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Button from "../Standard/Button/Button";
import Settings from "@/typescript/settings";
import ConverterTS, { ConverterContext } from "@/typescript/converter";
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
    // Settings
    const possibleScaleDownMiltipliers = useState<number[] | undefined>();
    const customScaleDownMultiplier = useState<boolean | undefined>();
    const currentScaleDownMultiplier = useState<number | undefined>();
    const tablePixelLimit = useState<number | undefined>();

    // Converter
    const canvas = useRef<HTMLCanvasElement | undefined>(undefined);
    const inputFile = useState<File | undefined>();
    const inputImage = useState<HTMLImageElement | undefined>();

    const converter = useRef(new ConverterTS(
      new Settings(
        possibleScaleDownMiltipliers,
        customScaleDownMultiplier,
        currentScaleDownMultiplier,
        tablePixelLimit
      ),
      canvas,
      inputFile,
      inputImage
    ))

    useEffect(() => {
      converter.current.getImageURL().then((imageURL) => {
        if (imageURL !== undefined && imageURL.length !== 0 && converter.current.getImage() === undefined) {
          converter.current.setImageURL(imageURL).then(() => {
            if (!converter.current.isScaleDownMultiplierApropariate()) {
              converter.current.setScaleDownMultiplier(converter.current.highestApropariateScaleDownMultiplier() ?? converter.current.getPossibleScaleDownMultipliers()[-1])
            }
          })
        }
      });
    }, [inputImage])

    function handleImageSubmition(file: File) { converter.current.setFile(file); }
    function handleConvert() { converter.current.convert(); }
    function handleCopyTable() {
      const TABLE = converter.current.getTable();
      if (TABLE === undefined) { return; }
      navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([renderToStaticMarkup(TABLE)], { type: 'text/html' }) })]);
    }

    let memoScaleOptions = useMemo((): ReactElement<ScaleDownToProps>[] => {
        let newScaleOptions: ReactElement<ScaleDownToProps>[] = [];

        console.log(converter.current);
        converter.current.getPossibleScaleDownMultipliers().forEach((scale, index) => {
          newScaleOptions.push( <ScaleDownTo key={index} className={style.scaleDownTo} scaleTo={scale} /> )
        })

        return newScaleOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [possibleScaleDownMiltipliers, customScaleDownMultiplier, currentScaleDownMultiplier])

    return (
      <section className={[style.converter, props.className].join(' ')}>

        <div className={style.input}>
          <ConverterContext.Provider value={converter}>
              <InputImage image={inputImage[0]} onImageSubmit={handleImageSubmition} />
              <Scale className={style.scaleOptions}>{memoScaleOptions}</Scale>
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