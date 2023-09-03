import { memo } from "react";

interface InfoProps {
    className?: string,
}

function Info(props: InfoProps) {
    return (
        <section className={[props.className].join(' ')}>
            <p>Website converting images to tables of various sizes that later can be inserted into Excel. Watch out! If the image is of large size it may take a while to generate a table, lag while copying and use a lot of RAM. That&apos;s why there are compression options! 1x is going to be the original, 2x is going to have two times less pixels on the width and height. (I suggest not going above 400 x 400 pixels).</p>
        </section>
    )
}

export default memo(Info);