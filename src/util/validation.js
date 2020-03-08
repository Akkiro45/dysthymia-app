export const validateAuth = (field, value) => {
  let error = null;
  let type = null;
  if(field === 'username') {
    type = 'usernameError';
    if(value.length <2 || value.length > 20 ) {
      error = 'Username must be between 2 & 20!';
    }
  }
  if(field === 'password') {
    type = 'passwordError';
    if(value.length <8 || value.length > 60 ) {
      error = 'Password must be between 8 & 60!';
    } 
  }
  return {
    error,
    type
  }
}