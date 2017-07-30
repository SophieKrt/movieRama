import ".././scss/styles.scss";
import 'jquery';
import 'tether';
import 'bootstrap';
import 'slick-carousel';
import Handlebars from 'handlebars';
import * as functions from './functions';

var currentPage = 1;
var totalpages = 0;
var moviesInTheaters = [];
var previewsTemplate, detailsTemplate;
var scrolledToBottom = false;
var searchMode = false;
/* used for loading more movies when reaching bottom*/

$(document).ready(() => {

    let getMoviePrevs = getMoviePreviews;
    $.ajax({
        url: "/js/templates/moviePreview.tpl.handlebars",
        cache: true,
        success: function (templateScript) {

            previewsTemplate = Handlebars.compile(templateScript);
            getMoviePrevs(currentPage);
        }
    });

    $.ajax({
        url: "/js/templates/movieDetails.tpl.handlebars",
        cache: true,
        success: function (templateScript) {
            detailsTemplate = Handlebars.compile(templateScript);
        }
    });


});


const getMoviePreviews = (page) => {
    searchMode = false;
    functions.getMoviesNowData(page, (resultArray, totalpgs) => {

        if (page === 1) {
            totalpages = totalpgs;
            $('.content-placeholder').html("");
        }

        moviesInTheaters = resultArray;

        let theCompiledHtml = previewsTemplate(resultArray);
        $('.content-placeholder').append(theCompiledHtml);
        scrolledToBottom = false;
        $('.loader').addClass('hidden');

        setEventListeners();
    });
}

const getSearchMovies = (page) => {
    let currentValue = $('#searchInput').val();
    if (currentValue != ""){
        functions.searchForMovie(currentValue, page, (resultArray, totalpgs) =>{
            if (page === 1) {
                totalpages = totalpgs;
                $('.content-placeholder').html("");
            }
            if (resultArray.length == 0){
                $('.content-placeholder').html("No results matched your search.");
            }else{
                moviesInTheaters = resultArray;

                let theCompiledHtml = previewsTemplate(resultArray);
                $('.content-placeholder').append(theCompiledHtml);
                scrolledToBottom = false;
                $('.loader').addClass('hidden');

                setEventListeners();
            }

        });
    }
}


const setEventListeners = () => {

    let moviePreviewHeight = $('.movie-item').height();
    let getMoviesFunc = searchMode ? getSearchMovies : getMoviePreviews;


    $('.see-more-link').on('click', function (e) {
        let id = $(e.target).attr("id").split("-")[1];
        expandMovie(id);
    });

    $('.close-collapse').on('click', function(e) {
       let movieid = $(e.target).parent('.movie-item').attr("id");
        collapseMovie();
        // $('html, body').animate({
        //     scrollTop: $(movieid).offset().top
        // }, 500);
    });

    $(window).scroll(function () {
        if (($(window).scrollTop() + $(window).height() > $(document).height() - moviePreviewHeight) && !scrolledToBottom) {
            $('.loader').removeClass('hidden');
            scrolledToBottom = true;
            currentPage++;
            if (totalpages >= currentPage){
                getMoviesFunc(currentPage);
            }

            else{
                $('.loader').addClass('hidden');
                console.log("End of results");
            }
        }
    });
}


const expandMovie = (id) => {
    let movieDiv = $('#movie_' + id);
    if (!movieDiv.hasClass("expanded")) {
        collapseMovie();

        movieDiv.addClass("expanded");
        movieDiv.find('.collapse').collapse('show');
        functions.getMovieDetails(id).then(result => {
            let moviewanted = moviesInTheaters.filter(movie => movie.id == id);

            if (moviewanted.length > 0) moviewanted = moviewanted[0];
            moviewanted.details = result;
            let compiledHtml = detailsTemplate(moviewanted);
            let movieid = '#movie_' + id;
            $(movieid).find('.card').html(compiledHtml);


            $('#carousel-' + id).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 8,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 720,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

            $('html, body').animate({
                scrollTop: $(movieid).offset().top
            }, 500);
        });
    }
}

const collapseMovie = () => {
    if ($('.expanded').length > 0) {
        let id = $('.expanded').attr("id").split("_")[1];
        let movieDiv = $('#movie_' + id);
        movieDiv.find('.collapse').collapse('hide');
        movieDiv.removeClass("expanded");
    }

}

$('#searchInput').on('input', function() {
    currentPage = 1;
    searchMode = true;
    $('#in-theaters').removeClass('selected');
    getSearchMovies(currentPage);
});

$('#search-button').on('click', function(){
    currentPage = 1;
    searchMode = true;
    $('#in-theaters').removeClass('selected');
    getSearchMovies(currentPage);
})

$('#in-theaters').on('click', function(){
    if (!$(this).hasClass('selected')){
        searchMode = false;
        currentPage = 1;
        $(this).addClass('selected');
        getMoviePreviews(currentPage);
    }
})