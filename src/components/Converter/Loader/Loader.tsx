import { memo } from "react";

interface LoaderProps {
    className?: string,
}

function Loader(props: LoaderProps) {
    return (
        <section className={[props.className].join(' ')}>

        </section>
    )
}

export default memo(Loader);