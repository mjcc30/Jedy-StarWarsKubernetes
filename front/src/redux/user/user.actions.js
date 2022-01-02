import UserActionsTypes from './user.types';

export const signInStart = () => ({
  type: UserActionsTypes.SIGN_IN_START
});

export const signInSuccess = user => ({
  type: UserActionsTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = error => ({
  type: UserActionsTypes.SIGN_IN_FAILURE,
  payload: error
});

export const signUpStart = () => ({
  type: UserActionsTypes.SIGN_UP_START
});

export const signUpFailure = error => ({
  type: UserActionsTypes.SIGN_UP_FAILURE,
  payload: error
});

export const logout = () => ({
  type: UserActionsTypes.LOGOUT
});

export const checkUserSession = () => {
  return dispatch => {
    const user = localStorage.getItem('star-wars-user');
    if (!user) {
      return dispatch(signInFailure(null))
    }
    dispatch(signInSuccess(user))
  }
}

export const signInStartAsync = ({email, password}) => {
  return dispatch => {
    dispatch(signInStart());
    fetch(`${process.env.REACT_APP_API_ENTRYPOINT}/login`, {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({email, password})
    })
        .then(async response => {
          if (!response.ok) {
            dispatch(signInFailure('Identifiants invalides'))
            return Promise.reject()
          }
          return response.json()
        })
        .then(user => {
          localStorage.setItem("star-wars-user", JSON.stringify(user));
          dispatch(signInSuccess(user));
        });
  }
}

export const signUpStartAsync = ({email, password}) => {
  return dispatch => {
    dispatch(signUpStart());
    fetch(`${process.env.REACT_APP_API_ENTRYPOINT}/users`, {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({email, password})
    })
        .then(async response => {
          if (!response.ok) {
            const data = await response.json()
            dispatch(signUpFailure(data.errors[0].message))
            return Promise.reject()
          }
          return response.json()
        })
        .then(() => dispatch(signInStartAsync({email, password})))
  }
}
