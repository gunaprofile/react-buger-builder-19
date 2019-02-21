import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-buger-3dcbb.firebaseio.com/'
});

export default instance;