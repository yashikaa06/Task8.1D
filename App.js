import React, { useState } from 'react';
import { db, storage } from './utils/firebase'; // Import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FindQuestion from '../src/components/FindQuestion'; // Import the FindQuestion component
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [postType, setPostType] = useState('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [abstract, setAbstract] = useState('');
  const [image, setImage] = useState(null); // State to track the image
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Error state for user feedback

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Upload the image if provided
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef); // Get the downloadable URL
      }

      // Add post data to Firestore
      await addDoc(collection(db, 'posts'), {
        title,
        description,
        tags,
        postType,
        abstract,
        imageUrl, // Save the image URL
        createdAt: new Date(), // Add created date
      });

      // Reset form after submission
      setTitle('');
      setDescription('');
      setTags('');
      setAbstract('');
      setImage(null); // Reset image
      setSubmitted(true);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrorMessage('Failed to submit the post. Please try again later.');
    }
  };

  return (
    <Router>
      <div className="App">
        <h1>New Post</h1>

        {submitted && (
          <div className="success-message">
            <p>Your post has been successfully submitted!</p>
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        <nav className="nav-bar">
          <Link to="/">Create Post</Link>
          <Link to="/find-question">Find Questions</Link>
        </nav>

        <Routes>
          <Route path="/find-question" element={<FindQuestion />} />
          <Route path="/" element={
            <form onSubmit={handleSubmit}>
              <div className="post-type">
                <label>Select Post Type: </label>
                <input
                  type="radio"
                  value="question"
                  checked={postType === 'question'}
                  onChange={handlePostTypeChange}
                />
                <label>Question</label>

                <input
                  type="radio"
                  value="article"
                  checked={postType === 'article'}
                  onChange={handlePostTypeChange}
                />
                <label>Article</label>
              </div>

              {postType === 'question' ? (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Start your question with how, what, why, etc."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe your problem"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Enter a descriptive title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Abstract</label>
                    <textarea
                      placeholder="Enter a 1-paragraph abstract"
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Article Text</label>
                    <textarea
                      placeholder="Enter the article text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="form-group">
                    <label>Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="Please add up to 3 tags to describe what your post is about e.g., Java"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Post</button>
            </form>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
