import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Aside from '../component/Aside';
import DisplayAllCours from '../component/DisplayCours/DisplayAllCours';
import DisplayCoursbyCategory from '../component/DisplayCours/DisplayCoursbyCategory';
const Cours = () => {
          const{t,i18n} = useTranslation()
          const currentLanguage = i18n.language; 
            useEffect(()=>{
              window.document.dir = i18n.dir();
            },[currentLanguage])
          const [selectedCategory, setSelectedCategory] = useState("ALL");
          const [selectedLevel, setSelectedLevel] = useState('');
          const [selectedclasse, setSelectedclasse] = useState('');
          const [selectedPrice,setSelectedPrice] = useState({ minPrice: 0, maxPrice: Infinity });
  return (
    <>
    <div className='Cours' style={{ display: 'flex',gap:"0px"}}>
      <Aside setSelectedCategory={setSelectedCategory}
        setSelectedLevel={setSelectedLevel}
        setSelectedPrice={setSelectedPrice}
        setSelectedclasse={setSelectedclasse}
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
        selectedPrice={selectedPrice}
        selectedclasse={selectedclasse}
        />
      {selectedCategory === "ALL" ? <DisplayAllCours /> : <DisplayCoursbyCategory category={selectedCategory} levels={selectedLevel} classe={selectedclasse} minPrice={selectedPrice.minPrice} maxPrice={selectedPrice.maxPrice} /> }
      
    </div>
    
    </>
  )
}

export default Cours
