import constants from '../constants/actionTypes';

const initialState = {
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.FETCH_MOVIES:
            return {
                ...state,
                movies: Array.isArray(action.movies) ? action.movies : [],
                loading: false,
                error: null
            };

        case constants.SET_MOVIE:
            return {
                ...state,
                selectedMovie: action.selectedMovie
            };

        case constants.FETCH_MOVIE:
            return {
                ...state,
                selectedMovie: action.selectedMovie,
                loading: false,
                error: null
            };

        default:
            return state;
    }
};

export default movieReducer;