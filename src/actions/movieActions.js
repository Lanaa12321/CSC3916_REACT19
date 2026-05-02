import actionTypes from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL || "https://csci3916-hw4-gmx8.onrender.com";

function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    };
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    };
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    };
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    };
}

export function fetchMovie(movieId) {
    return dispatch => {
        return fetch(`${API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('token')
            },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(res => {
            dispatch(movieFetched(res.movie || res));
        })
        .catch(e => console.log(e));
    };
}

export function fetchMovies() {
    return dispatch => {
        return fetch(`${API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('token')
            },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(res => {
            dispatch(moviesFetched(res.movies || res));
        })
        .catch(e => console.log(e));
    };
}