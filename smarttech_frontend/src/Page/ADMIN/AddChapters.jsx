import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Upload from '../../assest/upload_image.png';
import i18n from '../../i18n';

import './CSS/admin.css';
const AddChapters = () => {
    const currentLanguage = i18n.language; 
  const{t} = useTranslation()
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])
    const [image,setimage] = useState(false);
    const [video,setvideo] = useState(false);
    const location = useLocation();
    const [pdfCoursFile, setPdfCoursFile] = useState(null);
    const [pdfTDFile, setPdfTDFile] = useState(null);
    const formationId = location.state?.formationId;
    const pdfCoursHandler = (e) => setPdfCoursFile(e.target.files[0]);
    const pdfTDHandler = (e) => setPdfTDFile(e.target.files[0]);
    const navigate = useNavigate();
    const [formData,SetFormData] = useState({
      titleEn:"",
      titleFr:"",
      titleAr:"",
      descriptionEn:"",
      descriptionFr:"",
      descriptionAr:"",
      price:"",
      videoUrl:"",
      pdfCours:"",
      pdfTD:"",
    })
    const videoHandler =(e) =>{
      setvideo(e.target.files[0]);
    }
    const changeHandler = (e) =>{
      SetFormData({...formData, [e.target.name]:e.target.value});
    } 


    const AddChapter = async (e) => {
      try {
          let chapter = { ...formData }; 
          if(video){
            let formDataforvideos = new FormData();
            formDataforvideos.append('video',video);
            const videoUploadResponse = await fetch('http://localhost:9000/api/chapters/upload_video', {
              method: 'POST',
              body: formDataforvideos,
            });
          if (!videoUploadResponse.ok) {
            throw new Error('Failed to upload video');
          }  
          const videoUploadData = await videoUploadResponse.json();
          console.log("video upload response:", videoUploadData);  
          if (videoUploadResponse.ok) {
            chapter.videoUrl = videoUploadData.videoUrl; 
          } else {
            throw new Error('Failed to upload image');
          }}
           // Upload course PDF if exists
          if (pdfCoursFile) {
            const coursFormData = new FormData();
            coursFormData.append('pdf', pdfCoursFile);
            const coursResponse = await fetch('http://localhost:9000/api/chapters/upload_files', {
              method: 'POST',
              body: coursFormData,
            });

            if (!coursResponse.ok) throw new Error('Failed to upload course PDF');
            
            const coursData = await coursResponse.json();
            chapter.pdfCours = coursData.savedFileName; // Use correct field from response
          }

          // Upload TD PDF if exists
          if (pdfTDFile) {
            const tdFormData = new FormData();
            tdFormData.append('pdf', pdfTDFile);
            const tdResponse = await fetch('http://localhost:9000/api/chapters/upload_files', {
              method: 'POST',
              body: tdFormData,
            });

            if (!tdResponse.ok) throw new Error('Failed to upload TD PDF');
            
            const tdData = await tdResponse.json();
            chapter.pdfTD = tdData.savedFileName; // Use correct field from response
          }
          
          const courseResponse = await fetch(`http://localhost:9000/api/chapters/Addchapters/${formationId}`, {
            
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapter),
          });
          console.log(chapter); 
          if (!courseResponse.ok) {
               throw new Error('Failed to add course');
            }
            console.log(chapter); 
            const courseData = await courseResponse.json();            
            toast.success('Chapter added successfully with captions');
            console.log(chapter); 
            if (courseData.success) {
            toast.success('CHapter added to course successfully');
            setTimeout(() => {
                navigate('/coursManagement');
            },50);
        } else {
            toast.success('Chapter added to course added successfully');
            setTimeout(() => {
                navigate('/coursManagement');
            },50);}
        } catch (error) {
                console.error('Error adding chapter:', error);
                toast.error('An error occurred while adding the course');
            }
        };
  return (
    <div class="p-4  bg-white sm:ml-64">
      <ToastContainer/>
      <div class="p-4 bg-white   rounded-lg ">
      <div class="grid grid-cols-12 grid-row-12 gap-4 mb-4">
          <div className='addProduct'>
           <h1 className='addCourse_title'>{t('addChapter')}</h1>
           <hr  className='add_course_hr'/>
            <div className="addproduct-itemfield">
             <p>Chapter Title(EN)</p>
             <input value={formData.titleEn} onChange={changeHandler} type="text" name='titleEn' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
              <p>Chapter Title (AR)</p>
              <input value={formData.titleAr} onChange={changeHandler} type="text" name='titleAr' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
              <p>Chapter Title (FR)</p>
              <input value={formData.titleFr} onChange={changeHandler} type="text" name='titleFr' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
              <p>Chapter description(EN)</p>
              <input value={formData.descriptionEn} onChange={changeHandler} type="text" name='descriptionEn' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
              <p>Chapter description(AR)</p>
              <input value={formData.descriptionAr} onChange={changeHandler} type="text" name='descriptionAr' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
              <p>Chapter description(FR)</p>
              <input value={formData.descriptionFr} onChange={changeHandler} type="text" name='descriptionFr' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
                  <p>Video</p>
                  <label htmlFor="video-input">
                    {video ? (
                      <video width="100%" controls>
                        <source src={video ? URL.createObjectURL(video) : Upload} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={Upload} alt="Upload Video" />
                    )}
                  </label>
                  <input
                    onChange={videoHandler}
                    type="file"
                    name="videoUrl"
                    id="video-input"
                    accept="video/*"
                    hidden
                  />
          </div>
          <div className="addproduct-itemfield">
            <p>Cours(PDF)</p>
            <input onChange={pdfCoursHandler} type="file"  accept="application/pdf"   name="pdfCours" placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
            <p>TD(PDF)</p>
            <input  onChange={pdfTDHandler} accept="application/pdf" type="file" name="pdfTD" placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={formData.price} onChange={changeHandler} type="text" name="price" placeholder='Type here' />
        </div>




      <button onClick={()=>{AddChapter()}} className='addproduct-btn'>Add Chapter</button>
    </div>
    </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default AddChapters
