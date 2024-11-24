import React, { useState, useEffect, useRef } from "react";

const FileSearch = (params: { title: string; onFileSearch: any }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  const {title, onFileSearch} = params
  const node:React.LegacyRef<HTMLInputElement> | null = useRef(null)
  const closeSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
    e.preventDefault()
    setInputActive(false)
    setValue('')
  }

  useEffect(() => {
    const handleInputEvent = (event:any)=> {
      const { keyCode } = event
      if(keyCode === 13 && inputActive) {
        onFileSearch(value)
      } else if(keyCode === 27 && inputActive) {
        closeSearch(event)
      }
    }
    document.addEventListener('keyup', handleInputEvent)
    return () => {
      document.removeEventListener('keyup', handleInputEvent)
    }
  },)

  useEffect(()=> {
    if(node.current && inputActive) {
      node.current.focus()
    }
  }, [inputActive])
  
  return <div className="alert alert-primary">
    {
      !inputActive && 
      <div className="d-flex justify-content-between align-items-center">
        <span>{title}</span>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={()=> setInputActive(true)}
        >搜索</button>
      </div>
    }
    {
      inputActive && 
      <div className="d-flex row">
        <input 
          className="form-control col-8" 
          value={value} 
          ref={node}
          onChange={(e)=> {setValue(e.target.value)}}
        />
        <button 
          type="button" 
          className="btn btn-primary col-4" 
          onClick={closeSearch}
        >关闭</button>
      </div>
    }
  </div>;
};

export default FileSearch