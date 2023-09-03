import optionsStyle from "./ScaleDownTo/ScaleDownTo.module.css";
import { ReactElement, ReactNode, memo, useEffect, useMemo, useState } from "react";
import { ScaleDownToProps } from "./ScaleDownTo/ScaleDownTo";
import React from "react";
import { useConverterContext } from "@/typescript/converter";

interface ScaleProps {
    className?: string;

    children?: ReactElement<ScaleDownToProps>[];
}

function Scale(props: ScaleProps) {
    const converter = useConverterContext();

    let memoChildren = useMemo((): ReactElement<ScaleDownToProps>[] | undefined => {
        if (props.children === undefined) { return; }
        let newChildren: ReactElement<ScaleDownToProps>[] = [];

        props.children.forEach((element) => {
            if (element.props.scaleTo === converter.settings.getScaleDownMultiplier()) {
                let elementCopy = React.cloneElement(element, {
                    className: [element.props.className, optionsStyle.selected].join(' ')
                });
                newChildren.push(elementCopy);
            } else {
                newChildren.push(element);
            }
        });

        return newChildren;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.children])

    return (
        <section className={props.className}>
            {memoChildren}
        </section>
    )
}

export default memo(Scale);