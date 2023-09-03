import style from "./Button.module.css";

interface ButtonProps {
    className?: string,
    onClick?: () => void,

    children?: any,
}

function Button(props: ButtonProps) {
    return (
        <button className={[style.button, props.className].join(' ')} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default Button;