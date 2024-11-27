import React, { useState, useEffect, useRef } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faMarkdown} from '@fortawesome/free-brands-svg-icons'
import PropTypes from "prop-types";

const FileList = (params: {
    files: any,
    onFileClick: any,
    onFileEdit: any,
    onFileDelete: any
})=> {
    const { files, onFileClick, onFileEdit, onFileDelete} = params
    const [editId, setEditId] = useState("")
    const [value, setValue] = useState('')
    const closeSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setEditId("")
        setValue('')
    }
    useEffect(() => {
        const handleInputEvent = (event:any)=> {
          const { keyCode } = event
          if(keyCode === 13 && editId) {
            // const editItem = files.find((file:any) => file.id === editId)
            onFileEdit(editId,value)
            setEditId("")
            setValue('')
          } else if(keyCode === 27 && editId) {
            closeSearch(event)
          }
        }
        document.addEventListener('keyup', handleInputEvent)
        return () => {
          document.removeEventListener('keyup', handleInputEvent)
        }
      },)
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map((file:any) => (
                    <li 
                        className="list-group-item bg-light row d-flex align-items-center file-item"
                        key={file.id}
                    >
                        { (file.id !== editId) &&
                        <>
                        <span className="col-2">
                            <FontAwesomeIcon 
                                icon={faMarkdown}
                                size="lg"
                            />
                        </span>
                        <span 
                            className="col-7 c-link"
                            onClick={()=> {onFileClick(file.id)}}
                        >{file.title}</span>
                        <button 
                            type="button" 
                            className="icon-button col-1 c-link" 
                            onClick={()=>{ 
                                setEditId(file.id)
                                setValue(file.title)
                             }}
                            >
                            <FontAwesomeIcon 
                                icon={faEdit}
                                title="编辑"
                                size="lg"
                            />
                        </button>
                        <button 
                            type="button" 
                            className="icon-button col-1 c-link" 
                            onClick={()=>{onFileDelete(file.id)}}
                            >
                            <FontAwesomeIcon 
                                icon={faTrash}
                                title="删除"
                                size="lg"
                            />
                        </button>
                        </>}
                        {(file.id === editId) &&
                        <>
                            <input 
                            className="form-control col-10" 
                            value={value} 
                            onChange={(e)=> {setValue(e.target.value)}}
                            />
                            <button 
                            type="button" 
                            className="icon-button col-2" 
                            onClick={closeSearch}
                            >
                            <FontAwesomeIcon 
                                icon={faTimes}
                                title="关闭"
                                size="lg"
                            />
                            </button>
                        </>
                        }
                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileEdit: PropTypes.func,
    onFileDelete: PropTypes.func,
}

export default FileList