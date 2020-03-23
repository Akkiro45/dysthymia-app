import axios from 'axios';

const baseURLLocal = 'http://192.168.43.45:4000';
const baseURLHeroku = 'https://desolate-springs-80998.herokuapp.com'

const instance = axios.create({
  baseURL: baseURLLocal,
  timeout: 30000,
});

export default instance;