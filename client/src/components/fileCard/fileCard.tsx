import "./fileCard.css"

export function FileCard(props) {
    async function deleteUpload() {
        const result = await fetch("/api/deleteUpload", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: props.file.id })
        })
        if ((result.status == 200) && props.deletionCallback) {
            props.deletionCallback()
        }
    }

    return (
        <div className="fileCard">
            <p><a href={"/api/uploads/" + props.file.id}>/api/uploads/{props.file.id}</a></p>
            <p>{props.file.filename}</p>
            <button onClick={deleteUpload}>Delete</button>
        </div>
    )
}