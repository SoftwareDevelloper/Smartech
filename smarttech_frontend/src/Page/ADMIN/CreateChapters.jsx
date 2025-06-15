import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Upload from '../../assest/upload_image.png';
import i18n from '../../i18n';
import './CSS/createChapters.css';
const CreateChapters = () => {
  const currentLanguage = i18n.language;
  const { t } = useTranslation();

  useEffect(() => {
    document.dir = i18n.dir();
  }, [currentLanguage]);

  const [formations, setFormations] = useState([]);
  const [video,setvideo] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState('');
  const [pdfCoursFile, setPdfCoursFile] = useState(null);
  const [pdfTDFile, setPdfTDFile] = useState(null);
  const pdfCoursHandler = (e) => setPdfCoursFile(e.target.files[0]);
  const pdfTDHandler = (e) => setPdfTDFile(e.target.files[0]);
  const [newChapter, setNewChapter] = useState({
    titleEn: '',
    titleFr: '',
    titleAr: '',
    descriptionEn: '',
    descriptionFr: '',
    descriptionAr: '',
    price: '',
    videoUrl: '',
    pdfCours: '',
    pdfTD: '',
  });

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch('https://smartech-production-1020.up.railway.app/api/GetAllFormations');
        const data = await response.json();
        setFormations(data);
        if (data.length > 0) setSelectedFormationId(data[0].id);
      } catch (error) {
        console.error('Error fetching formations:', error);
        toast.error('Failed to load formations');
      }
    };
    fetchFormations();
  }, []);
  const videoHandler =(e) =>{
    setvideo(e.target.files[0]);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChapter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormationChange = (e) => {
    setSelectedFormationId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the selected formation
      const selectedFormation = formations.find(f => f.id === selectedFormationId);
      if (!selectedFormation) {
        throw new Error('Please select a formation');
      }
  
      // Prepare chapter data
      let chapterData = { 
        ...newChapter, 
        formation_id: selectedFormation.id, // Make sure this matches the backend DTO field name
        price: parseFloat(newChapter.price) || 0 // Ensure price is a number
      };
      
      // Upload video if exists
      if (video) {
        let formDataForVideos = new FormData();
        formDataForVideos.append('video', video);
        const videoUploadResponse = await fetch('https://smartech-production-1020.up.railway.app/api/chapters/upload_video', {
          method: 'POST',
          body: formDataForVideos,
        });
        
        if (!videoUploadResponse.ok) {
          throw new Error('Failed to upload video');
        }  
        
        const videoUploadData = await videoUploadResponse.json();
        chapterData.videoUrl = videoUploadData.videoUrl;
      }
  
      // Upload course PDF if exists
      if (pdfCoursFile) {
        const coursFormData = new FormData();
        coursFormData.append('pdf', pdfCoursFile);
        const coursResponse = await fetch('https://smartech-production-1020.up.railway.app/api/chapters/upload_files', {
          method: 'POST',
          body: coursFormData,
        });
  
        if (!coursResponse.ok) throw new Error('Failed to upload course PDF');
        
        const coursData = await coursResponse.json();
        chapterData.pdfCours = coursData.savedFileName;
      }
  
      // Upload TD PDF if exists
      if (pdfTDFile) {
        const tdFormData = new FormData();
        tdFormData.append('pdf', pdfTDFile);
        const tdResponse = await fetch('https://smartech-production-1020.up.railway.app/api/chapters/upload_files', {
          method: 'POST',
          body: tdFormData,
        });
  
        if (!tdResponse.ok) throw new Error('Failed to upload TD PDF');
        
        const tdData = await tdResponse.json();
        chapterData.pdfTD = tdData.savedFileName;
      }
      
      // Send the chapter data to create endpoint
      const response = await fetch("https://smartech-production-1020.up.railway.app/api/chapters/create", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chapterData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create chapter');
      }
  
      const responseData = await response.json();
      toast.success('Chapter created successfully');
      
      // Reset form
      setNewChapter({
        titleEn: '',
        titleFr: '',
        titleAr: '',
        descriptionEn: '',
        descriptionFr: '',
        descriptionAr: '',
        price: '',
        videoUrl: '',
        pdfCours: '',
        pdfTD: '',
      });
      setvideo(null);
      setPdfCoursFile(null);
      setPdfTDFile(null);
  
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error(error.message || 'An error occurred while creating the chapter');
    }
  };

  return (
    <div className='p-4 bg-white sm:ml-64'>
    <div className="create-chapters-container">
        <ToastContainer/>
      <div className="chapter-form-wrapper">
        <h2 className="text-lg font-bold mb-4">{t('addChapter')}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="form-group" >
            <Autocomplete
              options={formations} 
              getOptionLabel={(chapter) => chapter.titleEn}
              onChange={(event, newValue) => setSelectedFormationId(newValue?.id || '')}
              renderInput={(params) => (
                <TextField {...params} label="Select Formation:" variant="outlined" />
              )}
            />


          </div>
          <div className="form-group">
          <input name="titleEn" value={newChapter.titleEn} onChange={handleChange} placeholder="Title (EN)" required />
          </div>
          <div className="form-group">
          <input name="titleFr" value={newChapter.titleFr} onChange={handleChange} placeholder="Title (FR)" />
          </div>
          <div className="form-group">
          <input name="titleAr" value={newChapter.titleAr} onChange={handleChange} placeholder="Title (AR)" />
          </div>
          <div className="form-group">
          <input name="descriptionEn" value={newChapter.descriptionEn} onChange={handleChange} placeholder="Description (EN)" />
          </div>
          <div className="form-group">
          <input name="descriptionFr" value={newChapter.descriptionFr} onChange={handleChange} placeholder="Description (FR)" />
          </div>
          <div className="form-group">
          <input name="descriptionAr" value={newChapter.descriptionAr} onChange={handleChange} placeholder="Description (AR)" />
          </div>
          <div className="form-group">
          <input name="price" value={newChapter.price} onChange={handleChange} placeholder="Price" type="number" />
          </div>
          <div className="form-group">
            <div className="file-upload-wrapper">
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
            <br />
            <div className="form-group">
            <input onChange={pdfCoursHandler} type="file"  accept="application/pdf"   name="pdfCours" placeholder='Type here' />
            </div>
            <div className="form-group">
            <input  onChange={pdfTDHandler} accept="application/pdf" type="file" name="pdfTD" placeholder='Type here' />
            </div>
          </div>



          <button type="submit" className="submit-btn">
            Add Chapter
          </button>
        </form>
      </div>
    </div>
    <svg className="form-illustration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#4299e1" d="M42.6,-70.8C55.6,-62.3,66.7,-51.4,75.3,-37.4C83.9,-23.5,89.9,-6.5,89.4,11.2C88.9,28.9,81.8,47.3,70.3,59.7C58.8,72.1,42.8,78.5,26.9,79.1C11,79.8,-5,74.7,-20.4,69.4C-35.8,64.1,-50.8,58.6,-62.7,48.7C-74.6,38.8,-83.5,24.5,-84.8,9.7C-86.1,-5.1,-79.9,-20.4,-71.1,-33.1C-62.3,-45.7,-51,-55.7,-38,-64.3C-25,-72.8,-10.4,-79.8,4.3,-86.2C18.9,-92.6,37.8,-98.3,42.6,-70.8Z" transform="translate(100 100)" />
</svg>
    </div>
  );
};

export default CreateChapters;
