import actionTypes from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL || "https://csci3916-hw4-gmx8.onrender.com";

function userLoggedIn(username) {
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    };
}

export function logoutUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');

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
            body: JSON.stringify(data)
        })
        .then(async (response) => {
            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.msg || 'Login failed');
            }

            return resData;
        })
        .then((res) => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', res.token);

            dispatch(userLoggedIn(data.username));
            alert('Login successful');
        })
        .catch((e) => {
            alert(e.message || 'Login failed');
        });
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
            body: JSON.stringify(data)
        })
        .then(async (response) => {
            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.msg || 'Signup failed');
            }

            return resData;
        })
        .then((res) => {
            alert(res.msg || 'Signup successful');
        })
        .catch((e) => {
            alert(e.message || 'Signup failed');
        });
    };
}