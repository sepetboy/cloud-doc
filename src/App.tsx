import React, { useMemo, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css"; //https://github.com/RIP21/react-simplemde-editor
import SimpleMDE from 'react-simplemde-editor'
import MDE_TYPE from "easymde";
import {v4 as uuidv4} from 'uuid'
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import {defaultFile} from './mocks/files'
import { FileObj, FileType } from './types';
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper';

// require node.js modules
const { join } = window.require('path')
// 获取主进程
const remote = window.require('@electron/remote')
const Store = window.require('electron-store');
const fileStore = new Store({'name': 'Files Data'})
const saveFilesToStore = (files: FileObj<FileType>) => {
  // isNew和body不存在在store里面
  const filesStoreObj = objToArr(files).reduce((result: FileObj<FileType>, file: FileType) => {
    const { id, path, title, createdAt} = file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFiledID] = useState('')
  const [openedFileIDs, setOpenedFileIDS] = useState([] as string[])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([] as string[])
  const [searchedFiles, setSearchedFiles] = useState([] as FileType[])
  const filesArr = objToArr<FileType>(files)
  const savedLocation = join(remote.app.getPath('documents'), '.electron-cache')
  console.log(remote.app.getPath('userData'))
  const openedFiles = openedFileIDs.map(openID => {
    return files[activeFileID] || {...defaultFile, id: openID}
  })
  const activeFile = files[activeFileID]
  const fileListArr = (searchedFiles.length > 0 ? searchedFiles : filesArr)
  console.log("fileListArr", fileListArr)
  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      minHeight: '515px'
    } as MDE_TYPE.Options;
  }, []);
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
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value}
      setFiles({...files, [id]: newFile})
      if(!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([...unsavedFileIDs, id])
      }
    }
  }

  const deleteFile = async (id:string) => {
    await fileHelper.deleteFile(files[id].path)
    delete files[id]
    setFiles(files)
    saveFilesToStore(files)
    tabClose(id)
  }

  const updateFileName = (id:string, title:string, isNew: boolean) => {
    const newPath = join(savedLocation, `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath}
    const newFiles = {...files, [id]: modifiedFile}
    if(isNew) {
      fileHelper.writeFile(newPath, files[id].body).then((data: any) => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`)
      fileHelper.renameFile(oldPath, newPath).then((data:any)=> {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
  }

  const fileSearch = (keyword: string) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const createNewFile = ()=> {
    const newID = uuidv4()
    const newFile = {
      id: newID,
      title: '',
      body: "## 请输入 Markdown",
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({...files, [newID]: newFile})
  }
  const saveCurrentFile = () => {
    fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFileID))
    })
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
                options={ autofocusNoSpellcheckerOptions }
              />
              <div className='col-6'>
                <BottomBtn 
                  text='保存'
                  colorClass='btn-success'
                  icon={faSave}
                  onBtnClick={saveCurrentFile}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
