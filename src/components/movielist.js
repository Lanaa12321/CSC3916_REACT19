import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Carousel, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

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

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);

    const memoizedMovies = useMemo(() => movies || [], [movies]);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    if (!memoizedMovies || memoizedMovies.length === 0) {
        return <div className="text-light p-4">Loading movies...</div>;
    }

    return (
        <div className="bg-dark text-light p-4 rounded text-center">
            <Carousel interval={null}>
                {memoizedMovies.map((movie) => (
                    <Carousel.Item key={movie._id}>
                        <img
                            src={movie.imageUrl || makePoster(movie.title)}
                            alt={movie.title}
                            style={{
                                width: "320px",
                                height: "480px",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }}
                            onError={(e) => {
                                e.target.src = makePoster(movie.title);
                            }}
                        />

                        <div className="mt-3">
                            <h2>{movie.title}</h2>
                            <p>
                                <BsStarFill /> {movie.avgRating || 0} &nbsp; | &nbsp;
                                {movie.releaseDate || "No release date"}
                            </p>

                            <Button
                                as={Link}
                                to={`/movie/${movie._id}`}
                                onClick={() => handleClick(movie)}
                                variant="primary"
                            >
                                Write Review
                            </Button>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default MovieList;