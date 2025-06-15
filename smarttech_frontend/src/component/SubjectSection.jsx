import { motion } from "framer-motion";
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import '../component/css/SubjectSection.css';
import '../i18n';

const SubjectSection = () => {
  const {t, i18n} = useTranslation();
  const [darkMode, setDarkMode] = React.useState(false);
  useEffect(() => {
    // Vérifie si le dark mode est activé dans le localStorage
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  // Liste des sujets
  const subjects = [
    'Matematique',
    'Scientifique',
    'Technologies',
    'Social Studies',
    'Language Arts',
    'Foreign Languages'
  ];

  return (
    <section 
      id='Subject' 
      className={`py-16 px-6 md:px-12 lg:px-24 dark-bg`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "250px",
        marginTop: "15%"
      }}
    >
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12'>
        <div id="Sections" className='w-full md:w-1/2 space-y-6'>
          <h2 
            id="titleSection" 
            className='text-xl font-semibold text-center tracking-wider dark-text'
            style={{
              marginTop: "2%",
              color: "#fdc401",
              fontFamily: "Baloo 2, sans-serif"
            }}
          >
            {t('tutorSubject')}
          </h2>
          
          <p 
            id="titleSlogan"  
            className='text-3xl text-center font-semibold dark-text'
            style={{
              color: "#03619f",
              fontFamily: "Montserrat, sans-serif",
              textTransform: "uppercase"
            }}
          >
            {t('tutorSubjectSlogan')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subject, index) => (
              <motion.div 
                key={subject}
                initial={{ opacity: 0, x: -100 + (index * 25) }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: index * 0.1
                }} 
                viewport={{ once: true, amount: 0.5 }} 
                className={`subject-card p-6 rounded-lg shadow-lg ${darkMode ? 'dark-card' : 'bg-white'}`}
                style={{
                  width: "250px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #fdc401",
                  boxShadow: "5px 2px 2px #fdc401"
                }}
              >
                <h2 
                  className='text-lg mb-4 dark-text'
                  style={{
                    marginTop: "2%",
                    color: darkMode ? "#c9d7f7" : "#02538AFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "500"
                  }}
                >
                  {t(subject)}
                </h2>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectSection;