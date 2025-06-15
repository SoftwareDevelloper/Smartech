import React, { useEffect } from 'react'
import IA from '../../component/IA'
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const IAManage = () => {
    const currentLanguage = i18n.language; 
    const{t} = useTranslation()
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div className="p-4 bg-white sm:ml-64">
      <div className="p-4 bg-white rounded-lg">
        <div className="grid grid-cols-12 gap-4 mb-4 bg-white">
            <IA/>
        </div>
       </div>
       </div>
  )
}

export default IAManage
