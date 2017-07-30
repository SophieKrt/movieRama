/* URLS */

export const baseUrl = "https://api.themoviedb.org/3";
export const getMoviesNow = baseUrl + "/movie/now_playing";
export const getGenres = baseUrl + "/genre/movie/list";
export const getMovieById = baseUrl + "/movie/";
export const getMovieVideos = (id) => baseUrl + "/movie/"+id+"/videos";
export const getMovieReviews = (id) => baseUrl + "/movie/"+id+"/reviews";
export const getMovieSimilar = (id) => baseUrl + "/movie/"+id+"/similar";

/* credentials */
export const API_KEY = "bc50218d91157b1ba4f142ef7baaa6a0";