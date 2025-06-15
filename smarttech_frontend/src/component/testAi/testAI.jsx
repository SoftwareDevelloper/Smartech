import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './testAi.css';
function Test() {
    const [testStartTime, setTestStartTime] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [predictionResult, setPredictionResult] = useState(null);
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
    const [predictionError, setPredictionError] = useState(null);
    const [currentProficiency, setCurrentProficiency] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeExpired, setTimeExpired] = useState(false);
    const [userId, setUserId] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // Pagination system :This keeps track of which question is currently being displayed.
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const navigate = useNavigate();

    useEffect(() => {
        window.document.dir = i18n.dir();
    }, [currentLanguage]);

    useEffect(() => {
        const storedUser = localStorage.getItem("auth-token");
        if (storedUser) {
            const decodedToken = jwtDecode(storedUser);
            setUserId(decodedToken.sub);
        }
    }, []);

    useEffect(() => {
        fetch(`https://smartech-production-1020.up.railway.app/questions/get/${id}?lang=${currentLanguage}`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setQuestions(data.map(q => ({ ...q, answers: q.answers })));
                    setSelectedAnswers(Array(data.length).fill({
                        index: null,
                        validated: false,
                        correct: false
                    }));
                }
            })
            .catch(console.error);
    }, [currentLanguage, id]);

    useEffect(() => {
        setTestStartTime(Date.now());
    }, []);

        useEffect(() => {
            const fetchProficiency = async () => {
                try {
                    if (userId) {
                        console.log("Fetching proficiency for user:", userId);
                        const res = await fetch(`https://smartech-production-1020.up.railway.app/api/predictLevel/getProficiencyLevel/${userId}`);
                        console.log("Response status:", res.status);
                        const data = await res.json();
                        console.log("Response data:", data);
                        setCurrentProficiency(data.proficiencyLevel || "Not assessed yet");
                    }
                } catch (error) {
                    console.error("Error fetching proficiency:", error);
                    setCurrentProficiency("Error loading level");
                }
            };
            fetchProficiency();
        }, [userId]);

    useEffect(() => {
        if (selectedAnswers.every(a => a?.validated)) {
            const predictionTimer = setTimeout(() => {
                calculateAndPredict();
            }, 10);
            return () => clearTimeout(predictionTimer);
        }
    }, [selectedAnswers]);

    const handleAnswerSelect = (aIndex) => {
        setSelectedAnswers(prev => prev.map((a, i) =>
            i === currentQuestionIndex ? { ...a, index: aIndex } : a
        ));
    };

    const handleValidation = async () => {
        const questionId = questions[currentQuestionIndex].id;
        const selectedIndex = selectedAnswers[currentQuestionIndex]?.index;

        if (typeof selectedIndex === 'undefined') return;

        try {
            const response = await fetch(`https://smartech-production-1020.up.railway.app/questions/validate/${questionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedIndex })
            });

            const result = await response.json();
            setSelectedAnswers(prev => prev.map((a, i) =>
                i === currentQuestionIndex ? { ...a, validated: true, correct: result.correct } : a
            ));

            // Move to next question or finish test , Modified the handleValidation function to automatically advance to the next question:
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const calculateAndPredict = async () => {
        setIsLoadingPrediction(true);
        setPredictionError(null);

        try {
            if (!userId) {
                throw new Error('Please log in to save your proficiency level');
            }

            const formationRes = await fetch(`https://smartech-production-1020.up.railway.app/api/GetFormationsById/${id}`);
            const formation = await formationRes.json();

            if (!formation || !formation.level) {
                throw new Error('Invalid formation data received.');
            }

            const numCorrect = selectedAnswers.filter(a => a.correct).length;
            const predictionRequest = {
                numCorrect: numCorrect,
                accuracy: numCorrect / questions.length,
                timeTaken: Math.floor((Date.now() - testStartTime) / 1000),
                schoolLevel: formation.level,
                subject: formation.titleEn,
                consecutiveCorrect: selectedAnswers.reduce((acc, a) => {
                    if (a.correct) {
                        acc.current++;
                        acc.max = Math.max(acc.max, acc.current);
                    } else {
                        acc.current = 0;
                    }
                    return acc;
                }, { current: 0, max: 0 }).max
            };

            const predictionRes = await fetch(`https://smartech-production-1020.up.railway.app/api/predictLevel/makePrediction/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(predictionRequest)
            });

            if (!predictionRes.ok) {
                const errorData = await predictionRes.json();
                throw new Error(errorData.details || 'Prediction failed');
            }

            const predictionData = await predictionRes.json();
            setPredictionResult({
                ...predictionData,
                score: numCorrect
            });

            if (predictionData.level) {
                toast.success(`Your proficiency level (${predictionData.level}) has been saved to your profile!`);
                setCurrentProficiency(predictionData.level);
            }

        } catch (error) {
            setPredictionError(error.message);
            console.error('Prediction error:', error);
        } finally {
            setIsLoadingPrediction(false);
        }
    };
const handleNextTestOrProfile = () => {
  const nextTests = JSON.parse(localStorage.getItem("remaining-tests") || "[]");

  if (nextTests.length > 0) {
    // Extraire le prochain test
    const nextTestId = nextTests[0];
    // Mettre à jour la liste dans le localStorage
    localStorage.setItem("remaining-tests", JSON.stringify(nextTests.slice(1)));
    // Rediriger vers le test suivant
    navigate(`/testAi/${nextTestId}`);
  } else {
    // Tous les tests sont terminés
    localStorage.removeItem("remaining-tests");
    navigate("/Profile");
  }
};

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100; //Calculates how far through the test the user is for the progress bar.

    return (
        <div className="test-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <h1 className="title-gradient">{t('assessmentTitle')}</h1>
            <hr className='hr_gradient'/>

      
            {currentProficiency && !predictionResult && (
                <div className="current-proficiency">
                    <p>Your current proficiency level: {currentProficiency}</p>
                </div>
            )}
            {/*Added this UI component that shows at the top:*/}
            {!predictionResult && questions.length > 0 && (
                <div className="test-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                </div>
            )}
            {/*Changed from displaying all questions to only showing the current one:*/}
            {!predictionResult && questions.length > 0 && (
                <div className="question-section">
                    <div key={questions[currentQuestionIndex].id} className="question-item">
                        <h3>{questions[currentQuestionIndex].question}</h3>
                        <div className="answer-options">
                            {questions[currentQuestionIndex].answers?.map((a, aIndex) => {
                                const selected = selectedAnswers[currentQuestionIndex];
                                return (
                                    <button
                                        key={aIndex}
                                        onClick={() => handleAnswerSelect(aIndex)}
                                        className={`answer-button ${selected?.index === aIndex ? 'selected' : ''} ${
                                            selected?.validated && (
                                                aIndex === questions[currentQuestionIndex].correctAnswerIndex ? 'correct'
                                                    : selected.index === aIndex ? 'incorrect' : ''
                                            )
                                        }`}
                                        disabled={selected?.validated}
                                    >
                                        {a}
                                        {selected?.validated && aIndex === questions[currentQuestionIndex].correctAnswerIndex && (
                                            <span className="correct-mark">✓</span>
                                        )}
                                        {selected?.validated && selected.index === aIndex && !selected.correct && (
                                            <span className="incorrect-mark">✗</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            className="validate-button"
                            onClick={handleValidation}
                            disabled={!selectedAnswers[currentQuestionIndex] || 
                                      selectedAnswers[currentQuestionIndex]?.validated || 
                                      selectedAnswers[currentQuestionIndex]?.index === null}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 
                                (selectedAnswers[currentQuestionIndex]?.validated ? 'Validated' : 'Finish Test') : 
                                (selectedAnswers[currentQuestionIndex]?.validated ? 'Validated' : 'Next')}
                        </button>
                    </div>

                </div>
            )}

            {isLoadingPrediction && (
                <div className="processing-overlay">
                    <div className="processing-message">
                        <div className="spinner"></div>
                        {t('processingResults')}
                    </div>
                </div>
            )}

         

            {predictionResult && (
                <div className="results-section">
                    <div className="prediction-result">
                        <h3>{t('Results')}</h3>
                        <div className="result-grid">
                            <div className="result-item">
                                <span>{t('Proficiency Level')}</span>
                                <span className="highlight">{predictionResult.level}</span>
                            </div>
                            <div className="result-item">
                                <span>{t('confidence')}</span>
                                <span className="highlight">{Math.round(predictionResult.confidence * 100)}%</span>
                            </div>
                            <div className="result-item">
                                <span>{t('score')}</span>
                                <span className="highlight">{predictionResult.score}/{questions.length}</span>
                            </div>
                        </div>
                    </div>
                    {/*Added a detailed review section that shows after all questions are answered:*/}
                    <div className="detailed-results">
                        <h3>Question Details</h3>
                        {questions.map((q, qIndex) => {
                            const selected = selectedAnswers[qIndex];
                            return (
                                <div key={q.id} className="question-review">
                                    <h4>Question {qIndex + 1}: {q.question}</h4>
                                    <div className="review-answers">
                                        {q.answers.map((a, aIndex) => (
                                            <div 
                                                key={aIndex}
                                                className={`review-answer ${
                                                    aIndex === q.correctAnswerIndex ? 'correct-answer' : 
                                                    selected?.index === aIndex ? 'user-answer' : ''
                                                }`}
                                            >
                                                {a}
                                                {aIndex === q.correctAnswerIndex && (
                                                    <span className="correct-mark">✓ Correct Answer</span>
                                                )}
                                                {selected?.index === aIndex && !selected.correct && (
                                                    <span className="incorrect-mark">✗ Your Answer</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {selected?.correct ? (
                                        <div className="answer-feedback correct-feedback">
                                            ✓ You answered correctly!
                                        </div>
                                    ) : (
                                        <div className="answer-feedback incorrect-feedback">
                                            ✗ Your answer was incorrect
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                     <button 
                        className="BackProfilBtn"
                         onClick={handleNextTestOrProfile}>
                        {t('Continue')}
                    </button>
                </div>
            )}

            <style jsx>{`
                .test-container {
                    max-width: 50%;
                    margin: 0 auto;
                    padding: 16px 48px;
                    position: relative;
                }

                .title-gradient {
                    background:#03619f; 
                    border-radius:50px;
                    color:white;
                    font-weight: 800;
                    font-size:40px;
                    text-align: center;
                    margin-bottom: 3rem;
                    font-family:"Montserrat",sans-serif;
                }
                .hr_gradient{
                    background:#EFEFEFFF;
                    border:none;
                    outline :none;
                    border-radius: 50px;
                    text-align: center;
                    width:740px ;
                    height:2px ; 
                    margin-left:0%;
                    margin-bottom: 2rem;      
                }
                .current-proficiency {
                    color: #fdc401;
                    font-weight: 700;
                    font-size:15px;
                    font-family:"Montserrat",sans-serif;
                    text-align: center;
                    margin-bottom: 5px;
                }
                .test-progress {
                    margin: 1.5rem 0;
                }
                .progress-bar {
                    height: 10px;
                    background: #e0e0e0;
                    border-radius: 5px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0072BD, #03619f);
                    transition: width 0.3s ease;
                }
                .progress-text {
                    text-align: center;
                    margin-top: 0.5rem;
                    font-size:12px;
                    color: #A8A6A6FF;
                    font-weight: 600;
                }
                .question-item {
                    margin: 2rem 0;
                    padding: 1.8rem;
                    background: #fff;
                    border-radius: 25px;
                    box-shadow: 5px 5px 6px rgba(0,0,0,0.1);
                    color: #686767FF;
                    font-weight:600;
                }
                .answer-options {
                    display: grid;
                    grid-template-columns: repeat(2,1fr);
                    gap: 1rem;
                    margin-Top: 1.3rem;
                    color: #9b9999;
                    
                }
                .answer-button {
                    padding: 15px 28px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    text-align: left;
                    background: white;
                    position: relative;
                    transition: all 0.2s ease;
                }
                .answer-button.selected {
                    border-color: #0072BD;
                    background: #f8faff;
                }
                .answer-button.correct {
                    border-color:  #03619f;
                    background: #B1DAF6FF;
                    color:white
                }
                .answer-button.incorrect {
                    border-color: #fdc401;
                    background: #FCEFBFFF;
                    color:white
                }
                .correct-mark, .incorrect-mark {
                    margin-left: 10px;
                    float: right;
                }
                .correct-mark {
                    color: #FFFFFFFF;
                }
                .incorrect-mark {
                    color: #FFFFFFFF;
                }
                .validate-button {
                    padding: 10px 48px;
                    background: #03619f;
                    font-size:15px
                    margin-left:5px;
                    color: white;
                     margin-top:1.5rem;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .validate-button:disabled {
                    background: #FFF;
                    color:#03619f;
                    border:2px solid #03619f;
                    cursor: not-allowed;
                    margin-top:1.5rem;
                    
                }
                .processing-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .processing-message {
                    text-align: center;
                    padding: 2rem;
                    background: #fff;
                    border-radius: 15px;
                    box-shadow: 5 5px 6px rgba(0,0,0,0.1);
                    font-weight: 700;
                    font-size:15px;
                    font-family:"Montserrat",sans-serif;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #0072BD;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                .error-message {
                    color: #FFD500FF;
                    background: rgba(247, 37, 133, 0.05);
                    padding: 1rem;
                    border-radius: 4px;
                    margin: 1rem 0;
                    text-align: center;
                }
                .results-section {
                    margin-top: 2rem;
                }
                .prediction-result {
                    padding: 2rem;
                    background: #fff;
                    border-radius: 25px;
                    box-shadow: 5px 5px 6px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                }
                .prediction-result h3 {
                    background: linear-gradient(45deg,#03619f,#F9EFCEFF);
                    background-clip: text;
                    color: transparent;
                    font-weight: 700;
                    letter-spacing:1px;
                    font-size:25px;
                    text-align: center;
                    margin-bottom: 5px;
                    font-family:"Montserrat",sans-serif;
                }
                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .result-item {
                    display: flex;
                    flex-direction: column;
                    justify-content:center;
                    align-items:center;
                    padding: 1rem;
                    background: linear-gradient(45deg,#03619f,#FFFFFFFF);
                    border-radius: 8px;
                    text-align: center;
                    color:white;
                }
                .result-item span {
                    font-weight: 700;
                    font-size:18px;
                    text-align: center;
                    margin-bottom: 5px;
                    font-family:"Montserrat",sans-serif;
                }
                .highlight {
                    color: #00497AFF;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    font-weight: 700;
                    font-size:20px;
                    text-align: center;
                    margin-bottom: 5px;
                    font-family:"Montserrat",sans-serif;
                }
                .detailed-results {
                    padding: 2rem;
                    background: #fff;
                    border-radius: 25px;
                    box-shadow: 5px 5px 6px rgba(0,0,0,0.1);
                }
                .detailed-results h3 {
                    background: linear-gradient(45deg,#03619f,#FFFFFFFF);
                    background-clip: text;
                    color: transparent;
                    font-weight: 700;
                    letter-spacing:1px;
                    font-size:25px;
                    text-align: center;
                    margin-bottom: 2rem;
                    font-family:"Montserrat",sans-serif;
                }
                .question-review {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: #FFFFFFFF;
                    border-radius: 20px;
                }
                .question-review h4 {
                    color: #03619f;
                    margin-bottom: 1rem;
                    font-family:"Montserrat",sans-serif;
                }
                .review-answers {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
                .review-answer {
                    padding: 1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 15px;
                    background: white;
                    position: relative;
                }
                .correct-answer {
                    border-color: #FFFFFFFF;
                    background: #03619f;
                    color: white;
                    font-family:"Montserrat",sans-serif;
                }
                .user-answer {
                    border-color: #FFFFFFFF;
                    background: #fdc401;
                    color: white;
                    font-family:"Montserrat",sans-serif;
                }
                .answer-feedback {
                    margin-top: 1rem;
                    padding: 0.5rem;
                    border-radius: 5px;
                    font-weight: 600;
                }
                .correct-feedback {
                    color: #03619f;
                    background: #e6f2ff;
                    font-family:"Montserrat",sans-serif;
                }
                .incorrect-feedback {
                    color: #FD0101FF;
                    background: #FFE6E6FF;
                    font-size:15px;
                    font-family:"Montserrat",sans-serif;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .test-container { padding: 1rem; }
                    .title-gradient { font-size: 1.5rem; }
                    .answer-options { grid-template-columns: 1fr; }
                    .result-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

export default Test;
