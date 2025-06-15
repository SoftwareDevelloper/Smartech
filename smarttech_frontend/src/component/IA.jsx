import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './css/IA.css';
const IA = () => {
    const [formations, setFormations] = useState([]);
    const [selectedFormationId, setSelectedFormationId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newQuestion, setNewQuestion] = useState({
        question: '',
        answers: ['', ''],
        correctAnswerIndex: 0
    });

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/GetAllFormations');
                const data = await response.json();
                setFormations(data);
                if (data.length > 0) {
                    setSelectedFormationId(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching formations:', error);
                toast.error('Failed to load formations');
            }
        };

        fetchFormations();
    }, []);

    useEffect(() => {
        if (selectedFormationId) {
            const fetchQuestions = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        `http://localhost:9000/questions/get/${selectedFormationId}`
                    );
                    const data = await response.json();
                    console.log("Fetched questions:", data);
                    if (Array.isArray(data)) {
                        setQuestions(data);
                    } else {
                        setQuestions([]);
                        console.error("Expected an array but got:", data);
                    }
                } catch (error) {
                    console.error('Error fetching questions:', error);
                    toast.error('Failed to load questions');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestions();
        }
    }, [selectedFormationId]);

    const handleFormationChange = (e) => {
        setSelectedFormationId(e.target.value);
    };

    const handleQuestionChange = (e) => {
        setNewQuestion({
            ...newQuestion,
            question: e.target.value
        });
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...newQuestion.answers];
        updatedAnswers[index] = value;
        setNewQuestion({
            ...newQuestion,
            answers: updatedAnswers
        });
    };

    const handleCorrectAnswerChange = (index) => {
        setNewQuestion({
            ...newQuestion,
            correctAnswerIndex: index
        });
    };

    const addAnswerField = () => {
        if (newQuestion.answers.length < 6) {
            setNewQuestion({
                ...newQuestion,
                answers: [...newQuestion.answers, '']
            });
        }
    };

    const removeAnswerField = (index) => {
        if (newQuestion.answers.length > 2) {
            const updatedAnswers = newQuestion.answers.filter((_, i) => i !== index);
            setNewQuestion({
                ...newQuestion,
                answers: updatedAnswers,
                correctAnswerIndex: updatedAnswers.length <= newQuestion.correctAnswerIndex
                    ? updatedAnswers.length - 1
                    : newQuestion.correctAnswerIndex
            });
        }
    };

    const submitQuestion = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:9000/questions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: newQuestion.question,
                    answers: newQuestion.answers,
                    correctAnswerIndex: newQuestion.correctAnswerIndex,
                    formationId: Number(selectedFormationId) // Send just the ID
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error(errorData.message || 'Failed to create question');
            }
    
            const savedQuestion = await response.json();
            setQuestions([...questions, savedQuestion]);
            setNewQuestion({
                question: '',
                answers: ['', ''],
                correctAnswerIndex: 0
            });
            toast.success('Question created successfully!');
        } catch (error) {
            console.error('Error creating question:', error);
            toast.error(error.message || 'Failed to create question');
        }
    };
    const deleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                const response = await fetch(`http://localhost:9000/questions/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const responseBody = await response.text();
                if (!response.ok) {
                    console.error('Backend error response:', responseBody);
                    throw new Error('Failed to delete question');
                }
                setQuestions(questions.filter(q => q.id !== id));
                toast.success('Question deleted successfully!');
            } catch (error) {
                console.error('Error deleting question:', error);
                toast.error('Failed to delete question');
            }
        }
    };

    return (
        <div className='AIControl'>
            <ToastContainer/>


            <div className="admin-panel">
                <div className="create-question-form">
                <div className="formation-selector">
                <label>Select Formation: </label>
                <select
                    value={selectedFormationId}
                    onChange={handleFormationChange}
                    disabled={loading || formations.length === 0}
                >
                    {formations.map(formation => (
                        <option key={formation.id} value={formation.id}>
                            {formation.titleEn}
                        </option>
                    ))}
                </select>
            </div>
                <form onSubmit={submitQuestion}>
                        <div className="form-group">
                            <input className='inputQuestion'
                            placeholder='Type the question here ...'
                                value={newQuestion.question}
                                onChange={handleQuestionChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            {newQuestion.answers.map((answer, index) => (
                                <div key={index} className="answer-row">
                                    <input className='inputAnswer'
                                    placeholder='Type the answers here ...'
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        required
                                    />
                                    <div className="answer-actions">
                                        <label>
                                            <input
                                            className='radio'
                                                type="radio"
                                                name="correctAnswer"
                                                checked={newQuestion.correctAnswerIndex === index}
                                                onChange={() => handleCorrectAnswerChange(index)}
                                                
                                            />
                                            Correct
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeAnswerField(index)}
                                            disabled={newQuestion.answers.length <= 2}
                                            className='BTN'
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAnswerField}
                                disabled={newQuestion.answers.length >= 6}
                                className='AddAnswer'
                            >
                                <p className='plus'>+</p>
                                ADD ANSWER 
                            </button>
                        </div>

                        <button type="submit" className="submit-btn">
                            ADD QUESTION
                        </button>
                    </form>
                </div>

                <div className="questions-table">
                    <h3>Existing Questions ({questions.length})</h3>
                    {loading ? (
                        <p>Loading questions...</p>
                    ) : questions.length === 0 ? (
                        <p>No questions found for this formation.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Answers</th>
                                    <th>Correct Answer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((question) => (
                                    <tr key={question.id}>
                                        <td>{question.question}</td>
                                        <td>
                                            <ol type="A">
                                                {question.answers.map((answer, index) => (
                                                    <li
                                                        key={index}
                                                        className={index === question.correctAnswerIndex ? 'correct' : ''}
                                                    >
                                                        {answer}
                                                    </li>
                                                ))}
                                            </ol>
                                        </td>
                                        <td>{String.fromCharCode(65 + question.correctAnswerIndex)}</td>
                                        <td>
                                            <button
                                                onClick={() => deleteQuestion(question.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IA;
