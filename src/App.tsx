import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css"; //https://github.com/RIP21/react-simplemde-editor
import SimpleMDE from 'react-simplemde-editor'
import {v4 as uuidv4} from 'uuid'
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import {defaultFiles} from './mocks/files'
import { FileType } from './types';

function App() {
  const [files, setFiles] = useState(defaultFiles as FileType[])
  const [activeFileID, setActiveFiledID] = useState('')
  const [openedFileIDs, setOpenedFileIDS] = useState([] as string[])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([] as string[])
  const [searchedFiles, setSearchedFiles] = useState([] as FileType[])
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID) || { 
      id: openID,
      title: '',
      body: '',
      createdAt: new Date().getTime()
    }
  })
  const activeFile = files.find(file => file.id === activeFileID)
  const fileListArr = (searchedFiles.length > 0 ? searchedFiles : files)
  const fileClick = (fileID:string) => {
    setActiveFiledID(fileID)
    if(!openedFileIDs.includes(fileID)) {
      setOpenedFileIDS([...openedFileIDs, fileID])
    }
  }
  const tabClick = (fileID: string) => {
    setActiveFiledID(fileID)
  }
  const tabClose = (fileID:string)=> {
    const tabsWithout = openedFileIDs.filter(id => id !== fileID)
    setOpenedFileIDS(tabsWithout)
    if(tabsWithout.length > 0) {
      setActiveFiledID(tabsWithout[tabsWithout.length-1])
    } else {
      setActiveFiledID('')
    }
  }

  const fileChange = (id: string, value: string) => {
    const newFiles = files.map(file => {
      if(file.id === id) {
        file.body = value
      }
      return file
    })
    setFiles(newFiles)
    if(!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id])
    }
  }

  const deleteFile = (id:string) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    tabClose(id)
  }

  const updateFileName = (id:string, title:string) => {
    const newFiles = files.map(file => {
      if(file.id === id) {
        file.title = title
        file.isNew = false
      }
      return file
    })
    setFiles(newFiles)
  }

  const fileSearch = (keyword: string) => {
    const newFiles = files.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const createNewFile = ()=> {
    const newID = uuidv4()
    const newFiles = [
      ...files,
      {
        id: newID,
        title: '',
        body: "## 请输入 Markdown",
        createdAt: new Date().getTime(),
        isNew: true
      }
    ]
    setFiles(newFiles)
  }
  return (
    <div className="App container-fluid px-0">
      <div className='row no-gutters'>
        <div className='col-6 left-panel'>
          <FileSearch 
            title="我的云文档" 
            onFileSearch={fileSearch}
          />
          <FileList 
            files={fileListArr}
            onFileClick={fileClick}
            onFileEdit={updateFileName}
            onFileDelete={deleteFile}
           />
           <div className='row no-gutters button-group'>
            <div className='col-6'>
              <BottomBtn 
                text='新建'
                colorClass='btn-primary'
                icon={faPlus}
                onBtnClick={createNewFile}
              />
            </div>
            <div className='col-6'>
              <BottomBtn 
                text='导入'
                colorClass='btn-success'
                icon={faFileImport}
                onBtnClick={()=>{}}
              />
            </div>
           </div>
        </div>
        <div className='col-6 right-panel'>
          {
            !activeFile && 
            <div className='start-page'>
              选择或者创建新的 Markdown 文档
            </div>
          }
          {
            activeFile && 
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value)=> {fileChange(activeFile.id,value)}}
                options={{
                  minHeight: '515px'
                }}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
