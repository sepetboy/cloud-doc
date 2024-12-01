import React, { useState, useEffect, useRef } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faMarkdown} from '@fortawesome/free-brands-svg-icons'
import { FileType } from "../types";

const FileList = (params: {
    files: FileType[],
    onFileClick: Function,
    onFileEdit: Function,
    onFileDelete: Function
})=> {
    let node:any = useRef(null)
    const { files, onFileClick, onFileEdit, onFileDelete} = params
    const [editId, setEditId] = useState("")
    const [value, setValue] = useState('')
    const closeSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setEditId("")
        setValue("")
        const editItem = files.find((file:any) => file.id === editId)
        if(editItem?.isNew) {
            onFileDelete(editItem.id)
        }
    }
    useEffect(() => {
        const handleInputEvent = (event:any)=> {
          const editItem = files.find((file:any) => file.id === editId)
          const { keyCode } = event
          if(keyCode === 13 && editId && value.trim() !== '') {
            onFileEdit(editId, value, editItem?.isNew)
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
    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        if(newFile) {
            setEditId(newFile.id)
            setValue(newFile.title )
        }
    }, [files])
    useEffect(()=> {
        if(editId) {
            node.current.focus()
        }
    },[editId])
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map((file:any) => (
                    <li 
                        className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
                        key={file.id}
                    >
                        { (file.id !== editId && !file.isNew) &&
                        <>
                        <span className="col-2">
                            <FontAwesomeIcon 
                                icon={faMarkdown}
                                size="lg"
                            />
                        </span>
                        <span 
                            className="col-6 c-link"
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
                        {(file.id === editId || file.isNew) &&
                        <>
                            <input 
                                className="form-control col-10" 
                                ref={node}
                                value={value} 
                                placeholder="请输入文件名称"
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

export default FileList