import React, { useState, useEffect, useRef } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

const FileSearch = (params: { title: string; onFileSearch: any }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  const {keyPressed:enterPressed} = useKeyPress(13)
  const {event:escEvent, keyPressed:escPressed} = useKeyPress(27)
  const {title, onFileSearch} = params
  const node:React.LegacyRef<HTMLInputElement> | null = useRef(null)
  const closeSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
    e.preventDefault()
    setInputActive(false)
    setValue('')
  }

  useEffect(() => {
    if(enterPressed && inputActive) {
      onFileSearch(value)
    }
    if(escPressed && inputActive) {
      closeSearch(escEvent)
    }
  })

  useEffect(()=> {
    if(node.current && inputActive) {
      node.current.focus()
    }
  }, [inputActive])
  
  return <div className="alert alert-primary d-flex justify-content-between align-items-center">
    {
      !inputActive && 
      <>
        <span>{title}</span>
        <button 
          type="button" 
          className="icon-button" 
          onClick={()=> setInputActive(true)}
        >
          <FontAwesomeIcon 
            icon={faSearch}
            title="搜索"
            size="lg"
          />
        </button>
      </>
    }
    {
      inputActive && 
      <>
        <input 
          className="form-control col-10" 
          value={value} 
          ref={node}
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
  </div>;
};

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch