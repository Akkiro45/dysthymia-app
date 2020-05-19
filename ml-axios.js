import axios from 'axios';

const baseURLLocal = 'http://192.168.43.45:4001';
const baseURLHeroku = 'https://whispering-lake-27196.herokuapp.com'

const instance = axios.create({
  baseURL: baseURLHeroku
});

export default instance;