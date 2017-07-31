import {
    getMoviesPlayingNow,
    getGenres,
    getMoviebyId,
    getMovieVideos,
    getMovieSimilar,
    getMoviesReviews,
    searchMovie
} from './apiCalls';
import Rx from 'rxjs';


const urlForImages = "https://image.tmdb.org/t/p/w500";
var genresArray = [];

/* returns an array of the processed data from the api call that returnes the movies in theaters*/
export const getMoviesNowData = (page, cb) => {
    let moviesInTheatersPromise = getMoviesPlayingNow(page);
    let moviesArray = [];
    let totalpages = 0;

    if (genresArray.length == 0) {
        getGenres().then(result => {
            if (result.status === 200) {
                genresArray = result.data.genres;

                transformPromiseToMovies(moviesInTheatersPromise, (results, pg) => {
                    cb(results, pg);
                })
            }
        })
            .catch(err => {
                alert("Please check your network connection.")
            });
    }else{
        transformPromiseToMovies(moviesInTheatersPromise, (results, pg) => {
            cb(results, pg);
        })
    }


}


export const getMovieDetails = (id) => {
    let details = {
        video: [],
        similar: [],
        reviews: []
    };
    let videosArray, similarsArray, reviewsArray;

    return new Promise((resolve, reject) => {
        return getMoviebyId(id)
            .then(result => {
                if (result.status === 200) {
                    details = {
                        video: !result.data.video ? [] : result.data.video,
                    };

                    videosArray = [];

                    if (details.video != null && details.video.length > 0) {
                        videosArray.push({site: details.video});
                    }
                    /* get videos */

                    let promise = getMovieVideos(id);

                    Rx.Observable.fromPromise(promise)
                        .mergeMap(videos => Rx.Observable.from(videos.data.results))
                        .map(video => {
                            return video;
                        })
                        .filter(video => video.type === 'Trailer')
                        .map(video => {
                            if (video && video.site === 'YouTube')
                                return {site: "https://youtube.com/embed/" + video.key};
                            else return {site: video.site + "|" + video.key}
                        })
                        .subscribe(
                            next => videosArray.push(next),
                            error => reject(error),
                            () => {
                                details.video = videosArray;

                                /* get similars */
                                similarsArray = [];
                                let promiseFromSimilar = getMovieSimilar(id);
                                Rx.Observable.fromPromise(promiseFromSimilar)
                                    .mergeMap(similar => similar.data.results)
                                    .map(similar => {
                                        return {
                                            imagepath: urlForImages + similar.poster_path,
                                            title: similar.title,
                                            id: similar.id
                                        }
                                    })
                                    .subscribe(
                                        next => similarsArray.push(next),
                                        err => reject(err),
                                        () => {
                                            /* get reviews */
                                            let promiseFromReviews = getMoviesReviews(id);
                                            reviewsArray = [];

                                            promiseFromReviews.then(result => {
                                                if (result.status == 200) {
                                                    Rx.Observable.fromPromise(promiseFromReviews)
                                                        .mergeMap(reviews => Rx.Observable.from(reviews.data.results))
                                                        .map(review => {
                                                            let linkOfReview = null;
                                                            let linkOfReviewArray = review.content.split("Read the full review here:");
                                                            if (linkOfReviewArray.length > 0) {
                                                                linkOfReview = linkOfReviewArray[1];
                                                            }
                                                            return {
                                                                id: review.id,
                                                                author: review.author,
                                                                content: linkOfReviewArray[0],
                                                                link: linkOfReview,
                                                                url: review.url
                                                            };
                                                        })
                                                        .subscribe(
                                                            next => {

                                                                reviewsArray.push(next);
                                                            },
                                                            err => reject(err),
                                                            () => {
                                                                if (reviewsArray.length > 2)
                                                                    reviewsArray = reviewsArray.slice(0, 2);

                                                                /* final object */
                                                                details.similar = similarsArray;
                                                                details.reviews = reviewsArray;
                                                                resolve(details);
                                                            }
                                                        )
                                                }
                                            })
                                        }
                                    )
                            }
                        );
                } else {
                    reject("Error");
                }
            })
    })

}


export const searchForMovie = (query, page, cb) => {
    let searchPromise = searchMovie(query, page);

    transformPromiseToMovies(searchPromise, (array, totalpg) => {
        cb(array, totalpg);
    })

}


const transformPromiseToMovies = (promise, cb) => {
    let moviesArray = [];
    let totalpages = 0;

    Rx.Observable.fromPromise(promise)
        .map(movieData => {
            totalpages = movieData.data.total_pages;
            return movieData.data.results;
        })
        .mergeMap(data => Rx.Observable.from(data))
        .map(movieItem => {
            movieItem = {
                id: movieItem.id,
                title: movieItem.title,
                imagepath: urlForImages + movieItem.poster_path,
                backdropPath: urlForImages + movieItem.backdrop_path,
                originalTitle: movieItem.original_title,
                description: movieItem.overview,
                date: new Date(movieItem.release_date).getFullYear(),
                release_date: movieItem.release_date,
                genreIds: movieItem.genre_ids,
                language: movieItem.original_language,
                popularity: movieItem.popularity,
                vote: movieItem.vote_average,
                vote_count: movieItem.vote_count,
                video: movieItem.video, /* true or false */
                adult: movieItem.adult,
                details: {
                    videos: null,
                    reviews: null,
                    similar: null
                }
            };
            return movieItem;
        })
        .map(movieItem => {

            let genrArrNames = movieItem.genreIds.map(genreId => {
                return genresArray.filter(genreObj => genreObj.id == genreId)
                    .map(genre => {
                        return (typeof(genre.name ) == 'string' ? genre.name : "")
                    });

            });

            movieItem.genrenames = genrArrNames;
            return movieItem;
        })
        .subscribe(
            next => moviesArray.push(next),
            error => console.log(error),
            () => {
                cb(moviesArray, totalpages);
            }
        );
}


