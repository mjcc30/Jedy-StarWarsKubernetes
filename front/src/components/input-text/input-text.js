import React from "react";

const InputText = ({id, label, value, ...props}) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input type="text" id={id} className="form-control" value={value} {...props}/>
        </div>
    )
}

export default InputText;