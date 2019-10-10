import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://burger-builder-3e92a.firebaseio.com/'
})

export default instance