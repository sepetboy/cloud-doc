import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const BottomBtn = (params: { text:string, colorClass:string, icon:IconProp, onBtnClick: React.MouseEventHandler<HTMLButtonElement>})=> {
    const { text = "新建" , colorClass, icon, onBtnClick} = params
    return (
        <button
            type="button"
            className={`btn btn-block no-broder ${colorClass}`}
            onClick={onBtnClick}
        >
            <FontAwesomeIcon 
                className="mr-2"
                icon={icon}
                size="lg"
            />
            {text}
        </button>
    )
}

export default BottomBtn
