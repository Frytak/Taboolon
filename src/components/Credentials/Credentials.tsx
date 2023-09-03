import { memo } from "react";
import style from "./Credentials.module.css";

interface CredentialsProps {
    className?: string,
}

function Credentials(props: CredentialsProps) {
    return (
        <section className={[style.credentials, props.className].join(' ')}>
            <p>Creator: <a href="https://github.com/Frytak">Frytak</a></p>
            <p>Repository: <a href="https://github.com/Frytak/taboolon">Taboolon</a></p>
        </section>
    )
}

export default memo(Credentials);