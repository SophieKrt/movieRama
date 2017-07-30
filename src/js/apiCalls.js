import axios from 'axios';
import * as urls from '../utilities/constants';

/* all the api calls used by the site */
export const getMoviesPlayingNow = (page = 1) => {
    return new Promise((resolve, reject) => {
        return axios.get(urls.getMoviesNow + "?api_key=" + urls.API_KEY
            + "&language=en-US&page=" + page)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    })
}

export const getGenres = () => {
    return new Promise((resolve, reject) => {
        return axios.get(urls.getGenres+"?api_key="+urls.API_KEY+"&language=en-US")
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.log(JSON.stringify(err))
                reject(err);
            });
    })
}

export const getMoviebyId = (id) =>{
    return new Promise((resolve, reject) =>{
        return axios.get(urls.getMovieById+id+"?api_key="+urls.API_KEY+"&language=en-US")
            .then(result =>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })

    })

}

export const getMovieVideos = (id) =>{
    let url = urls.getMovieVideos(id)+"?api_key="+urls.API_KEY+"&language=en-US";
    return new Promise((resolve, reject) =>{
        return axios.get(url)
            .then(result =>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })

    })

}


export const getMovieSimilar = (id) =>{
    let url = urls.getMovieSimilar(id)+"?api_key="+urls.API_KEY+"&language=en-US";
    return new Promise((resolve, reject) =>{
        return axios.get(url)
            .then(result =>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })

    })

}

export const getMoviesReviews = (id) =>{
    let url = urls.getMovieReviews(id)+"?api_key="+urls.API_KEY+"&language=en-US";
    return new Promise((resolve, reject) =>{
        return axios.get(url)
            .then(result =>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })

    })

}