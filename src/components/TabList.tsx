import React from "react";
import classNames from 'classnames'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTimes} from '@fortawesome/free-solid-svg-icons'
import "../styles/TabList.scss"
import { FileType } from "../types";

const TabList = (params: {
    files: (FileType)[],
    activeId?:string,
    unsaveIds?:string[],
    onTabClick?:Function,
    onCloseTab?:Function
})=> {
    const { files, activeId, unsaveIds, onTabClick, onCloseTab} = params

    return(
        <ul className="nav nav-pills tablist-component">
            {
                files.map((file:FileType) => {
                    const withUnsavedMark = unsaveIds?.includes(file.id)
                    const fClassName = classNames({
                        'nav-link': true,
                        'active': file.id === activeId,
                        'with-unsaved': withUnsavedMark
                    })
                    return (
                        <li className="nav-item" key={file.id}>
                            <a
                                href="#"
                                className={fClassName}
                                onClick={(e)=> {
                                    e.preventDefault()
                                    onTabClick && onTabClick(file.id)
                                }}
                            >
                                {file.title}
                                <span 
                                    className="ml-10 close-icon" 
                                    onClick={(e)=> {
                                        e.stopPropagation()
                                        onCloseTab && onCloseTab(file.id)
                                }}>
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                    />
                                </span>
                                {withUnsavedMark && <span className="rounded-circle unsaved-icon ml-2"></span>}
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

TabList.defaultProps = {
    unsaveIds: []
}

export default TabList