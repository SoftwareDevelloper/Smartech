import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";
import banner from '../assest/banner_hero_home.svg';
import About from '../component/About';
import Contact from '../component/Contact';
import SubjectSection from "../component/SubjectSection";
import Teachers from "../component/Teachers/Teachers";
import '../i18n';
import './home.css';
const Home = () => {
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(true); 
  const{t,i18n} = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])


      useEffect(() => {
        fetch(`https://smartech-production-1020.up.railway.app/event/GetEvent?lang=${currentLanguage}`)
          .then(response => response.json())
          .then(data => {
            console.log('Fetched course:', data);
            if (Array.isArray(data)) {
              setEvent(data);
            } else {
              console.error("Fetched data is not an array:", data);
              setEvent([]);
            }
          })
          .catch(error => {
            console.error("Error fetching course:", error);
            setEvent([]); 
          })
      }, [currentLanguage]);
  return (
   
    <div className="home">
      {showModal && event?.length > 0 && (
        <motion.div 
          className="event-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {event.map((ev, index) => (
            <motion.div
              key={index}
              className="event-card"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 15
              }}
            >
            <div className="event-glow"></div>
            <div className="event-badge">
              <FaChalkboardTeacher className="event-icon" />
              <span className="pulse-dot"></span>
            </div>
            
            <div className="event-content">
              <h3 className="event-title">
                {currentLanguage === "fr" ? ev.eventTitleFr : 
                currentLanguage === "ar" ? ev.eventTitleAr : 
                ev.eventTitleEn}
              </h3>
              
              <p className="event-desc">
                {currentLanguage === "fr" ? ev.eventDescriptionFr : 
                currentLanguage === "ar" ? ev.eventDescriptionAr : 
                ev.eventDescriptionEn}
              </p>
              
              <div className="event-timeline">
                <div className="timeline-item">
                  <span className="timeline-label">{t('BeginAt')}:</span>
                  <span className="timeline-date">
                    {new Date(ev.eventFirstDate).toLocaleDateString()}
                    <span className="timeline-time">
                      {new Date(ev.eventFirstDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </span>
                </div>
                
                <div className="timeline-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">➔</div>
                </div>
                
                <div className="timeline-item">
                  <span className="timeline-label">{t('Endsat')}:</span>
                  <span className="timeline-date">
                    {new Date(ev.eventEndDate).toLocaleDateString()}
                    <span className="timeline-time">
                      {new Date(ev.eventEndDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="event-cta">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="register-btn"
                >
                  <Link to={'/SignUp'}>{t('RegisterNow')}</Link>
                </motion.button>
                <div className="countdown">
                  <span className="countdown-text">{t('StartsIn')}:</span>
                  <span className="countdown-time">24H 35M</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )}

        <section className='banner dark-bg' >
        <div class="heroRight" style={{display:"flex",flexDirection:"column"
        }} >
        <motion.h1
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: "easeIn" }} 
          viewport={{ once: true, amount: 0.5 }} 
        >
            {t('textBanner1')} <br /><span>{t('textBanner2')}</span>
           
            </motion.h1>
            <motion.div
              initial={{ opacity: 0.2, x: -100 }} 
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeIn" }} 
              viewport={{ once: true, amount: 0.5 }} 
              >
            </motion.div>
            <motion.p
              initial={{ opacity: 0.2, x: 100 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }} 
              >
           {t('slogan')}
            </motion.p>
            <Link to={'/Cours'}>
              <div className="exploreBtn">
                <button className="exploreNow">
                 {t('Explorenow')}
                  <span className="arrow"> {t('➔')} </span>
                </button>
              </div>
            </Link>


        </div>
        <motion.div
          initial={{ opacity: 0.2, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }} 
          viewport={{ once: true, amount: 0.5 }} 
          className="heroleft">
           
            <img src={banner} alt=""  />
         </motion.div>
       </section>

    <br />
    <div id='about'>
      <About/>
    </div>
    <div id="Subjects">
      <SubjectSection/>
    </div>

    <div id="Teachers">
      <Teachers/>
    </div>
    <div id='contact'>
    <Contact/>
    </div>




  </div>
  )
}

export default Home
