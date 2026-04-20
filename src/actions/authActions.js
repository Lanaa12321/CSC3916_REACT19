import actionTypes from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL || "https://csci3916-hw3.onrender.com";

function userLoggedIn(username) {
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    };
}

function logout() {
    return {
        type: actionTypes.USER_LOGOUT
    };
}

export function submitLogin(data) {
    return dispatch => {
        return fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((res) => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', res.token);

            dispatch(userLoggedIn(data.username));
        })
        .catch((e) => console.log(e));
    };
}

export function submitRegister(data) {
    return dispatch => {
        return fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(() => {
            dispatch(submitLogin(data));
        })
        .catch((e) => console.log(e));
    };
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logout());
    };
}