import optionsStyle from "./ScaleDownTo/ScaleDownTo.module.css";
import { ReactElement, ReactNode, memo, useEffect, useMemo, useRef, useState } from "react";
import { ScaleDownToProps } from "./ScaleDownTo/ScaleDownTo";
import React from "react";
import { useConverterContext } from "@/typescript/converter";

interface ScaleProps {
    className?: string;

    children?: ReactElement<ScaleDownToProps>[];
}

function Scale(props: ScaleProps) {
    const converter = useConverterContext();
    let oldChildren = useRef<ReactElement<ScaleDownToProps, string | React.JSXElementConstructor<any>>[]>();

    let memoChildren = useMemo((): ReactElement<ScaleDownToProps>[] | undefined => {
        if (props.children === undefined) { return; }
        let newChildren: ReactElement<ScaleDownToProps>[] = [];

        if (converter.getFile() === undefined) {
            props.children.forEach((element) => {
                let elementCopy = React.cloneElement(element, {
                    className: [element.props.className].join(' '),
                    disabled: true
                });
                newChildren.push(elementCopy);
            })
            return newChildren;
        }

        if (converter.getImage() === undefined) { return oldChildren.current; }
        if (converter.getImage()!.src.length === 0) { return oldChildren.current; }

        props.children.forEach((element) => {
            // When element is active
            if (element.props.scaleTo === converter.getScaleDownMultiplier()) {
                let elementCopy = React.cloneElement(element, {
                    className: [element.props.className, optionsStyle.selected].join(' '),
                });
                newChildren.push(elementCopy);
            } else {
                // When element is disabled
                if (!converter.isScaleDownMultiplierApropariate(element.props.scaleTo)) {
                    let elementCopy = React.cloneElement(element, {
                        className: [element.props.className].join(' '),
                        disabled: true
                    });
                    newChildren.push(elementCopy);
                } else {
                    newChildren.push(element);
                }
            }
        });

        oldChildren.current = newChildren;
        return newChildren;
    }, [props.children, converter])

    return (
        <div className={props.className}>
            {memoChildren}
        </div>
    )
}

export default memo(Scale);