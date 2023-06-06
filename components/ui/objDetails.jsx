const ObjectDetails = (props) => {
    return (
        <div>
            <h3>Object Details</h3>
            <p>Object ID: {props.id}</p>
            <p>Position: {props.data.p[0]}, {props.data.p[1]}, {props.data.p[2]}</p>
            <p>Size: {props.data.s[0]}, {props.data.s[1]}, {props.data.s[2]}</p>
        </div>
    )
}

export default ObjectDetails;