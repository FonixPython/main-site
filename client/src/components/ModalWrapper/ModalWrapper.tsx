import { Close } from "pixelarticons/react"
import "./ModalWrapper.css"

interface ModalWrapperProps extends React.PropsWithChildren {
    title: string,
    isopen: boolean,
    setOpen: CallableFunction
}

export function ModalWrapper({ title, isopen, setOpen, children }: ModalWrapperProps) {
    if (isopen) {
        return (
            <div className="screenCover" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpen(false)
                }
            }}>
                <div className="modalWrapper" style={{ zIndex: 9999 }} onClick={() => { }}>
                    <div className="titleBar">
                        <p>{title || ""}</p>
                        <button className="closeButton" onClick={() => { setOpen(false) }}><Close /></button>
                    </div>
                    <hr />
                    <div className="contentWrapper">
                        {children}
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}