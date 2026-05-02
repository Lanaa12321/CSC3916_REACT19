import React, { useEffect, useState, useCallback } from 'react';
import { Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "https://csci3916-hw4-gmx8.onrender.com";

function makePoster(title) {
    const safeTitle = title || "Movie";
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600">
            <rect width="100%" height="100%" fill="#343a40"/>
            <text x="50%" y="45%" text-anchor="middle" fill="white" font-size="36" font-family="Arial">${safeTitle}</text>
            <text x="50%" y="55%" text-anchor="middle" fill="#cccccc" font-size="24" font-family="Arial">Movie Poster</text>
        </svg>
    `)}`;
}

const MovieDetail = () => {
    const { movieId } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    //
    const loadMovie = useCallback(() => {
        const token = localStorage.getItem('token');

        fetch(`${API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        })
        .then(res => res.json())
        .then(data => {
            setMovie(data.movie || data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [movieId]);

    // ✅ no warning now
    useEffect(() => {
        loadMovie();
    }, [loadMovie]);

    const handleSubmitReview = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setSubmitMessage('You must be logged in.');
            return;
        }

        if (!rating || !review.trim()) {
            setSubmitMessage('Please enter a rating and review.');
            return;
        }

        fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify({
                movieId: movieId,
                rating: Number(rating),
                review: review
            })
        })
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || data.message || 'Review failed.');
            }

            return data;
        })
        .then(() => {
            setSubmitMessage('✅ Review submitted successfully!');
            setReview('');
            setRating('');

            // 🔥 refresh movie after review
            loadMovie();
        })
        .catch(err => {
            setSubmitMessage(err.message || 'Review could not be saved.');
        });
    };

    if (loading) return <div className="text-light p-4">Loading...</div>;
    if (!movie) return <div className="text-light p-4">Movie not found.</div>;

    return (
        <Card className="bg-dark text-light p-4 rounded">

            <Card.Header>
                <h2>{movie.title}</h2>
            </Card.Header>

            <Card.Body className="text-center">
                <img
                    src={movie.imageUrl || makePoster(movie.title)}
                    alt={movie.title}
                    style={{
                        width: "280px",
                        height: "420px",
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                    onError={(e) => {
                        e.target.src = makePoster(movie.title);
                    }}
                />
            </Card.Body>

            <ListGroup className="bg-white text-dark">
                <ListGroupItem className="text-dark">
                    <b>Movie:</b> {movie.title}
                </ListGroupItem>

                <ListGroupItem className="text-dark">
                    <b>Average Rating:</b> <BsStarFill /> {movie.avgRating || 0}
                </ListGroupItem>

                <ListGroupItem className="text-dark">
                    <b>Release Date:</b> {movie.releaseDate || "No release date"}
                </ListGroupItem>
            </ListGroup>

            <Card.Body className="bg-white text-dark mt-3 rounded">
                <h4>Write a Review</h4>

                <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="">Select rating</option>
                            <option value="1">1 star</option>
                            <option value="2">2 stars</option>
                            <option value="3">3 stars</option>
                            <option value="4">4 stars</option>
                            <option value="5">5 stars</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review here..."
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Submit Review
                    </Button>
                </Form>

                {submitMessage && (
                    <p className="mt-3"><b>{submitMessage}</b></p>
                )}

                <hr />

                <h4>Reviews</h4>
                {(movie.reviews || []).length === 0 && <p>No reviews yet.</p>}

                {(movie.reviews || []).map((r, i) => (
                    <p key={i}>
                        <b>{r.username || "User"}:</b> {r.review} <BsStarFill /> {r.rating}
                    </p>
                ))}
            </Card.Body>

        </Card>
    );
};

export default MovieDetail;