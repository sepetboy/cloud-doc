import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/bottomBtn';
import {defaultFiles} from './mocks/files'


function App() {
  return (
    <div className="App container-fluid px-0">
      <div className='row no-gutters'>
        <div className='col-3 left-panel'>
          <FileSearch 
            title="我的云文档" 
            onFileSearch={(value: string)=>{console.log(value)}}
          />
          <FileList 
            files={defaultFiles}
            onFileClick={(id:string)=>{console.log(id)}}
            onFileEdit={(id:string, newValue)=>{console.log("edit",id,newValue)}}
            onFileDelete={(id:string)=>{console.log("delete",id)}}
           />
           <div className='row no-gutters'>
            <div className='col'>
              <BottomBtn 
                text='新建'
                colorClass='btn-primary'
                icon={faPlus}
                onBtnClick={()=>{}}
              />
            </div>
            <div className='col'>
              <BottomBtn 
                text='导入'
                colorClass='btn-success'
                icon={faFileImport}
                onBtnClick={()=>{}}
              />
            </div>
           </div>
        </div>
        <div className='col-9 bg-primary right-panel'>
          <h1>this is the right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
