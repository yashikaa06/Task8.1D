import React, { useState } from 'react';
import { db, storage } from '../utils/firebase'; 
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Button, Input, TextArea } from 'semantic-ui-react';
import '../styles/AddQuestion.css';

const AddQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  
  const handleImageUpload = async () => {
    if (!image) return null;

    try {
      const imageRef = ref(storage, `questions/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      console.log('Image uploaded successfully', snapshot);
      
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL: ', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  
      const imageUrl = await handleImageUpload();
      console.log('Image URL received: ', imageUrl);

     
      const newQuestion = {
        title,
        description,
        tag,
        date: new Date(),
        imageUrl: imageUrl || '', 
      };

      await addDoc(collection(db, 'questions'), newQuestion);
      console.log('Question added successfully');
      
      // Navigate back to the questions page
      navigate('/find-questions');
    } catch (error) {
      console.error('Error adding question: ', error);
      alert('Failed to add question: ' + error.message);
    }
  };

  return (
    <div className="add-question">
      <h2>Add a New Question</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <Input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button type="submit" color="blue">Submit</Button>
      </form>
    </div>
  );
};

export default AddQuestion;
