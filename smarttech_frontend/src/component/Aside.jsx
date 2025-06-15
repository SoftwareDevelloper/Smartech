import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import '../i18n';

const Aside = ({ setSelectedCategory, setSelectedLevel,setSelectedclasse,setSelectedPrice, selectedCategory, selectedLevel,selectedclasse,selectedPrice}) => {
           const{t,i18n} = useTranslation()
          const currentLanguage = i18n.language; 
          const [openGroup, setOpenGroup] = useState(null);
          const [visibleGroups, setVisibleGroups] = useState([]);

          const handleGroupCheckbox = (groupName) => {
            setVisibleGroups(prev => 
              prev.includes(groupName) 
                ? prev.filter(name => name !== groupName) 
                : [...prev, groupName]
            );
          };
            useEffect(()=>{
              window.document.dir = i18n.dir();
            },[currentLanguage])
            const categories = [
              { id: "ALL", label: t("ALL") },
              { id: "LANGUAGES", label: t("LANGUAGES") },
              { id: "SCIENCE", label: t("SCIENCE") },
              { id: "MATEMATIQUES", label: t("MATHEMATICS") },
              { id: "TECHNOLOGIES", label: t("TECHNOLOGIES") }
            ];
            const level = [
              { id: "Primary", label: t("Primary") },
              { id: "Secondary", label: t("Secondary") },
              {id:"HighSchool",label: t("HighSchool")}
            ];
            const groupedCourseLevels = {
              "Primary": [1,2,3,4,5,6].map(n => ({
                id: `${n}Primary`,
                label: t(n === 1 ? "1ère" : `${n}ème`)
              })),
              "HighSchool": [7,8,9].map(n => ({
                id: `${n}HS`,
                label: t(`${n}ème`)
              })),
              "Secondary": [
                // 2ème
                { id: "2Lettre", label: t("2Lettre") },
                { id: "2Eco", label: t("2Eco") },
                { id: "2Sci", label: t("2Sci") },
                { id: "2Math", label: t("2Math") },
                { id: "2Tech", label: t("2Tech") },
                { id: "2Info", label: t("2Info") },
                // 3ème
                { id: "3Lettre", label: t("3Lettre") },
                { id: "3Eco", label: t("3Eco") },
                { id: "3Sci", label: t("3Sci") },
                { id: "3Math", label: t("3Math") },
                { id: "3Tech", label: t("3Tech") },
                { id: "3Info", label: t("3Info") },
                // Bac
                { id: "BLettre", label: t("BacLettre") },
                { id: "BEco", label: t("BacEco") },
                { id: "BSci", label: t("BacSci") },
                { id: "BMath", label: t("BacMath") },
                { id: "BTech", label: t("BacTech") },
                { id: "BInfo", label: t("BacInfo") }
              ]
            };
          
                    
            
            const price =  [('0-50'),('50 - 100'),('100 - 150'),('Over 150')]

  const handleCategoryChange = (category) => {
    setSelectedCategory(prev => prev === category ? 'ALL' : category);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(prev => prev === level ? '' : level);
  };
  const handlePriceChange = (price) => {
    let minPrice, maxPrice;
    if (price === '0-50') {
        minPrice = 0;
        maxPrice = 50;
    } else if (price === '50 - 100') {
        minPrice = 50;
        maxPrice = 100;
    } else if (price === '100 - 150') {
        minPrice = 100;
        maxPrice = 150;
    } else if (price === 'Over 150') {
        minPrice = 150;
        maxPrice = 999999;
    } else {
        minPrice = 0;
        maxPrice = 999999;
    }
    setSelectedPrice({ minPrice, maxPrice });
};
  // Handlers
 

  const handleClassSelect = (classId) => {
    setSelectedclasse(classId === selectedclasse ? '' : classId);
  };

  return (
        <div className="w-72 p-6 h-screen" style={{ marginLeft: "5%", marginTop: "5%",fontFamily:"Montserrat,sans-serif" }}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-blue-500 mb-6">{t('ALLCOURSE')}</h3>
                  <ul className="space-y-6">
                  {categories.map(({ id, label }) => (

                      <li key={id} className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id={id}
                          name={id}
                          checked={selectedCategory === id}
                          onChange={() => handleCategoryChange(id)}
                          className="checkbox-custom w-6 h-6 border-2 border-gray-300  checked:bg-blue-500  focus:ring-2 focus:ring-blue-500 transition-all duration-500 transform hover:scale-110"
                        />
                        <label htmlFor={id} className="text-lg font-semibold text-gray-500 cursor-pointer hover:text-gray-800 transition-all duration-200 ease-in-out">
                          {label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-blue-500 mb-6 mt-8">{t('LEVELS')}</h3>
                  <ul className="space-y-6">
                    {level.map(({ id, label }) => (
                      <li key={id}>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedLevel === id}
                            onChange={() => handleLevelChange(id)}
                            className="checkbox-custom w-6 h-6 border-2 border-gray-300 checked:bg-blue-500 focus:ring-2 focus:ring-blue-500"
                          />
                          <label className="text-lg font-semibold text-gray-500 cursor-pointer hover:text-gray-800">
                            {label}
                          </label>
                        </div>
                          {/* Show classes when level is selected */}
                          {selectedLevel === id && (
                            <ul className="space-y-3 ml-10 mt-3">
                              {groupedCourseLevels[id]?.map(({ id: classId, label }) => (
                                <li key={classId} className="flex items-center space-x-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedclasse === classId}
                                    onChange={() => handleClassSelect(classId)}
                                    className="checkbox-custom w-5 h-5 border-2 border-gray-300 checked:bg-blue-500 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <label className="text-md font-semibold text-gray-500 cursor-pointer hover:text-gray-800">
                                    {label}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-blue-500 mb-6 mt-8">{t('PRICE')}</h3>
                    <ul className="space-y-6">
                        {price.map((priceOption) => (
                            <li key={priceOption} className="flex items-center space-x-4">
                                <input
                                    type="checkbox"
                                    id={priceOption}
                                    name={priceOption}
                                    checked={
                                      priceOption === ''
                                          ? selectedPrice.minPrice === 0 && selectedPrice.maxPrice === 50
                                          : selectedPrice.minPrice === (priceOption === '0-50' ? 0 : priceOption === '50 - 100' ? 50 : priceOption === '100 - 150' ? 100 : 150)
                                  }
                                    onChange={() => handlePriceChange(priceOption)}
                                    className="checkbox-custom w-6 h-6 border-2 border-gray-300 checked:bg-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-400 transform hover:scale-110"
                                />
                                <label htmlFor={priceOption} className="text-lg font-semibold text-gray-500 cursor-pointer hover:text-gray-800 transition-all duration-200 ease-in-out">
                                    {priceOption} {" "}{" "}
                            {currentLanguage === 'fr'
                                    ?   "dt"
                                    : currentLanguage === 'ar'
                                    ?   "دينار"
                                    :   "dt"}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>



        </div>
);
};
export default Aside
