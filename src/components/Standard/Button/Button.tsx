import style from "./Button.module.css";

interface ButtonProps {
    className?: string,
    disabled?: boolean,
    onClick?: () => void,

    children?: any,
}

function Button(props: ButtonProps) {
    return (
        <button className={[style.button, props.className].join(' ')} disabled={props.disabled} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default Button;