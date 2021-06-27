//estado é uma informação mantida por um componente do react
//Estudar sobre o conceito de imutabilidade;
import '../styles/button.scss'
import { ButtonHTMLAttributes } from "react"

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};

export function Button({isOutlined = false, ...props} : buttonProps){
    return (
        //{} para colocar o texto
        //
        <button 
            className={`button ${isOutlined? 'outlined' : ''}`} 
            {... props}>
            
        </button>
    )
} 