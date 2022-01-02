export const getRequest = url => {
  const user = JSON.parse(localStorage.getItem('star-wars-user'))
  const headers = {
    "content-type": "application/json"
  }
  if (user) {
    headers.Authorization = "Bearer " + user.token
  }
  return fetch(url, {
    headers
  });
}
