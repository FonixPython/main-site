import "./footer.css"

export function Footer() {
    let date = new Date()
    return (
        <div className="footer">
            @{date.getFullYear()} Source code: <a href="https://github.com/FonixPython/main-site">main-site</a>
        </div>
    )
}