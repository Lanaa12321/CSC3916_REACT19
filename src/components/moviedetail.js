import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();

  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);

  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
  dispatch(fetchMovie(movieId));
}, [dispatch, movieId]);

  const handleSubmitReview = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setSubmitMessage('You must be logged in to submit a review.');
      return;
    }

    if (!review.trim() || rating === '') {
      setSubmitMessage('Please enter both a rating and a review.');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      },
      body: JSON.stringify({
        movieId: movieId,
        review: review,
        rating: Number(rating)
      })
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Failed to submit review');
          });
        }
        return response.json();
      })
      .then(() => {
        setSubmitMessage('Review submitted successfully.');
        setReview('');
        setRating('');
        dispatch(fetchMovie(movieId));
      })
      .catch((err) => {
        setSubmitMessage(err.message || 'Could not be saved.');
      });
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div>No movie data available.</div>;
  }

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>

      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>

      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>

        <ListGroupItem>
          {(selectedMovie.actors || []).map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>

        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating || 0}
          </h4>
        </ListGroupItem>
      </ListGroup>

      <Card.Body className="card-body bg-white">
        <h5>Add a Review</h5>

        <Form onSubmit={handleSubmitReview}>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Review
          </Button>
        </Form>

        {submitMessage && <p style={{ marginTop: '10px' }}>{submitMessage}</p>}

        <hr />

        <h5>Reviews</h5>
        {(selectedMovie.reviews || []).map((reviewItem, i) => (
          <p key={i}>
            <b>{reviewItem.username}</b>&nbsp; {reviewItem.review} &nbsp; <BsStarFill />{' '}
            {reviewItem.rating}
          </p>
        ))}
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;