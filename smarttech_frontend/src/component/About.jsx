import { motion } from "framer-motion";
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import icon1 from '../assest/24-hours-support.png';
import prix from '../assest/affordable.png';
import interview from '../assest/interview.png';
import whiteboard from '../assest/whiteboard.png';
import '../component/css/About.css';
import '../i18n';

const About = () => {
    const {t, i18n} = useTranslation();
    const [darkMode, setDarkMode] = React.useState(false);
        useEffect(() => {
            // Vérifie si le dark mode est activé dans le localStorage
            const isDark = localStorage.getItem('darkMode') === 'true';
            setDarkMode(isDark);
        }, []);


    return (
        <div className={`about-section dark-bg`} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "250px",
            marginTop: "3%"
        }}>
            <section id='about' className='py-16 px-6 md:px-12 lg:px-24' style={{marginTop: "5%"}}>
                <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12'>
                    <div id="allcards" className='w-full md:w-1/2 space-y-6'>
                        <h2 id="titleh2" className='text-xl font-semibold text-center tracking-wider dark-text' style={{
                            marginTop: "2%",
                            color: "#fdc401",
                            fontFamily: "Baloo 2, sans-serif"
                        }}>{t('aboutfirst')}</h2>
                        
                        <p id="cardsp" className='text-3xl text-center font-semibold dark-text' style={{
                            color: "#03619f",
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: "uppercase"
                        }}>
                            {t('aboutsecond')}
                        </p>
                        
                        <div id="carddsss" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 place-items-center">
                            {[
                                {
                                    icon: interview,
                                    title: t('aboutfirstcard'),
                                    text: t('cardp1'),
                                    animation: {x: -100}
                                },
                                {
                                    icon: icon1,
                                    title: t('aboutsecondcard'),
                                    text: t('cardp2'),
                                    animation: {x: -75}
                                },
                                {
                                    icon: whiteboard,
                                    title: t('aboutthirdcard'),
                                    text: t('cardp3'),
                                    animation: {x: -50}
                                },
                                {
                                    icon: prix,
                                    title: t('aboutfourthcard'),
                                    text: t('cardp4'),
                                    animation: {x: -25}
                                }
                            ].map((card, index) => (
                                <motion.div 
                                    key={index}
                                    animate={{ y: [0, -50, 0] }}
                                    initial={{ opacity: 0, ...card.animation }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1.2, ease: index % 2 === 0 ? "easeIn" : "easeOut" }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className={`p-6 rounded-lg shadow-lg ${darkMode ? 'dark-card' : 'bg-white'}`}
                                    style={{
                                        width: "300px",
                                        height: "180px",
                                        boxShadow: darkMode ? "10px 5px 6px #002147" : "10px 5px 6px rgb(234, 234, 234)"
                                    }}
                                >
                                    <img 
                                        src={card.icon} 
                                        alt="" 
                                        width={"25px"} 
                                        className={darkMode ? 'dark-icon' : ''}
                                    />
                                    <h4 className='text-md font-semibold mb-4 dark-text' style={{
                                        marginTop: "2%",
                                        color: darkMode ? "#7db8ff" : "#02538AFF",
                                        fontFamily: "Montserrat, sans-serif"
                                    }}>
                                        {card.title}
                                    </h4>
                                    <div className='space-y-3 text-sm'>
                                        <p className='flex items-center gap-2 dark-text-secondary' style={{
                                            fontFamily: "Quicksand, sans-serif"
                                        }}>
                                            {card.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;