import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const{t,i18n} = useTranslation()
      const currentLanguage = i18n.language; 
        useEffect(()=>{
          window.document.dir = i18n.dir();
        },[currentLanguage])
  return (
    <div className='PrivacyPolicy'>
    <div className="heroCenter">
      <h1>{t('Privacy')}</h1>
    </div>
    <div className="bottomprivacy">
        <h2> {t('Introduction')} </h2>
        <p> {t('p1')} </p>

        <h2> {t('h2')} </h2>
        <p> {t('p2')} </p>

        <h2> {t('h21')} </h2>
        <p> {t('p3')} </p>

        <h2> {t('h22')} </h2>
        <p>{t('p4')}</p>

        <h2> {t('h23')} </h2>
        <p> {t('p5')} </p>

        <h2> {t('h24')} </h2>
        <p> {t('p6')} </p>

        <h2> {t('h25')} </h2>
        <p> {t('p7')} </p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
