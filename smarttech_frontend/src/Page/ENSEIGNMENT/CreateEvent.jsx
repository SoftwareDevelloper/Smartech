import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import i18n from '../../i18n';
const CreateEvent = () => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  
  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);

  const [event, setEvent] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    eventTitleEn: "",
    eventTitleFr: "",
    eventTitleAr: "",
    eventDescriptionEn: "",
    eventDescriptionFr: "",
    eventDescriptionAr: "",
    eventFirstDate: "",
    eventEndDate: "",
  });

  // Fetch events
  useEffect(() => {
    fetch(`http://localhost:9000/event/GetEvent?lang=${currentLanguage}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvent(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setEvent([]);
        }
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setEvent([]);
      });
  }, [currentLanguage]);

  // Format date without external library
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(currentLanguage, options);
  };

  // Check if date has events
  const hasEvent = (date) => {
    return event.some(event => {
      const eventStart = new Date(event.eventFirstDate);
      const eventEnd = new Date(event.eventEndDate);
      const checkDate = new Date(date);
      
      // Normalize times for comparison
      checkDate.setHours(0, 0, 0, 0);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return event.filter(event => {
      const eventStart = new Date(event.eventFirstDate);
      const eventEnd = new Date(event.eventEndDate);
      const checkDate = new Date(date);
      
      checkDate.setHours(0, 0, 0, 0);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Apply custom styles to calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      if (hasEvent(date)) {
        return checkDate < today ? 'past-event' : 'upcoming-event';
      }
      
      if (checkDate.getTime() === today.getTime()) {
        return 'current-day';
      }
    }
    return '';
  };

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const AddEvent = async (e) => {
    e.preventDefault();
    if (!formData.eventTitleEn || !formData.eventTitleFr || !formData.eventTitleAr || 
        !formData.eventDescriptionEn || !formData.eventDescriptionFr || !formData.eventDescriptionAr || 
        !formData.eventFirstDate || !formData.eventEndDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:9000/event/createEvent', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': "application/json"
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      if (response.ok) {
        toast.success('Event created successfully');
        setEvent(prev => [...prev, responseData]);
        setFormData({
          eventTitleEn: "",
          eventTitleFr: "",
          eventTitleAr: "",
          eventDescriptionEn: "",
          eventDescriptionFr: "",
          eventDescriptionAr: "",
          eventFirstDate: "",
          eventEndDate: "",
        });
      } else {
        toast.error(responseData.errors || 'Creation failed');
      }
    } catch(error) {
      console.error('Error during creation:', error);
      toast.error('Please try again');
    }
  };

  const RemoveEvent = async(id) => {
    setEvent(prev => prev.filter(event => event.id !== id));
    if (localStorage.getItem("auth-token")) {
      fetch(`http://localhost:9000/event/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({event: id})
      })
      .then(response => response.json())
      .then(() => toast.success('Event deleted successfully'))
      .catch(error => console.error('Error deleting event', error));
    } else {
      toast.info("Only admin can remove events");
    }
  };

  return (
    <div className="p-4 sm:ml-64 font-[Montserrat] bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Calendar Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('EventCalendar')}</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            className="w-full border-none"
          />
          
          {/* Events for selected date */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {t('Eventson')} {formatDate(selectedDate)}
            </h3>
            <div className="max-h-60 overflow-y-auto">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="font-semibold">
                      {currentLanguage === 'fr'
                        ? event.eventTitleFr
                        : currentLanguage === 'ar'
                        ? event.eventTitleAr
                        : event.eventTitleEn}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(event.eventFirstDate)} - {formatDate(event.eventEndDate)}
                    </div>
                    <button
                      onClick={() => RemoveEvent(event.id)}
                      className="mt-1 text-white bg-red-500 hover:bg-red-600 transition px-2 py-1 rounded-full text-xs"
                    >
                      🗑 {t('Delete')}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{t('NoEvent')}</p>
              )}
            </div>
          </div>
        </div>


        
        {/* Event Creation Form */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <form className="grid grid-cols-1 gap-4" onSubmit={AddEvent}>
            {[
              { label: 'Title (EN)', name: 'eventTitleEn' },
              { label: 'Title (FR)', name: 'eventTitleFr' },
              { label: 'Title (AR)', name: 'eventTitleAr' },
              { label: 'Description (EN)', name: 'eventDescriptionEn' },
              { label: 'Description (FR)', name: 'eventDescriptionFr' },
              { label: 'Description (AR)', name: 'eventDescriptionAr' },
              { label: 'Start Date', name: 'eventFirstDate', type: 'date' },
              { label: 'End Date', name: 'eventEndDate', type: 'date' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 text-sm text-gray-600">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={changeHandler}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition"
            >
              ➕ {t('CreateEvent')}
            </button>
          </form>
        </div>


        <div className="bg-white shadow-md rounded-lg p-4 w-full overflow-hidden" style={{width:"200%"}}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800">{t('Event List')}</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {event.length} {t('events')}
            </span>
          </div>
          <div className='overflow-x-auto'>
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Event')}
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Description')}
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Dates')}
                </th>
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {event.length > 0 ? (
                event.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="font-medium text-gray-900 text-sm">
                          {currentLanguage === 'fr' ? evt.eventTitleFr :
                          currentLanguage === 'ar' ? evt.eventTitleAr : evt.eventTitleEn}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {currentLanguage === 'fr' ? evt.eventDescriptionFr :
                        currentLanguage === 'ar' ? evt.eventDescriptionAr : evt.eventDescriptionEn}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-gray-600 text-sm">
                        <div>{formatDate(evt.eventFirstDate)}</div>
                        <div className="text-xs text-gray-400">to</div>
                        <div>{formatDate(evt.eventEndDate)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => RemoveEvent(evt.id)}
                        className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('Delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-500">{t('NoEvent')}</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};
export default CreateEvent
