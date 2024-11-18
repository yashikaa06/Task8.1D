
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../styles/FindQuestion.css';

const FindQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState({ title: '', tag: '' });

  const fetchQuestions = async () => {
    const questionsCollection = collection(db, 'posts'); 
    const questionSnapshot = await getDocs(questionsCollection);
    const questionsList = questionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setQuestions(questionsList);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(question => {
    return (
      (filter.title ? question.title.toLowerCase().includes(filter.title.toLowerCase()) : true) &&
      (filter.tag ? question.tags.toLowerCase().includes(filter.tag.toLowerCase()) : true)
    );
  });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    fetchQuestions(); 
  };

  const formatDate = (createdAt) => {
    if (createdAt && createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }
    return 'N/A'; 
  };

  return (
    <div className="find-question">
      <h2>Find Questions</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by title"
          value={filter.title}
          onChange={(e) => setFilter({ ...filter, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by tag"
          value={filter.tag}
          onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
        />
      </div>

      <div className="question-list">
        {filteredQuestions.map(question => (
          <div className="question-card" key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.description}</p>
            <p><strong>Tags:</strong> {question.tags}</p>
            <p><strong>Date:</strong> {formatDate(question.createdAt)}</p>
            <button onClick={() => handleDelete(question.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindQuestion;
