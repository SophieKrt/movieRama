export const styles = () => {
    $('.see-more-link').on('click' , function(e){
        let id = $(e.target).attr("id").split("-")[1];
        getMovieDetails(id);
    });
}

// <div id="carousel-{{this.id}}" class="carousel slide" data-ride="carousel">
//
//     <!-- Wrapper for slides -->
//                      <div class="carousel-inner row" role="listbox">
//     {{#each this.details.similar}}
// <div id="similar-{{this.id}}" class="carousel-item {{#if @first}}active{{/if}} col-2">
//     <img src="{{this.imagepath}}" alt="Los Angeles">
//     <span class="similar-title">{{this.title}}</span>
// </div>
// {{/each}}
// </div>
//
// <!-- Left and right controls -->
// <a class="left carousel-control carousel-control-prev" href="#carousel-{{this.id}}" data-slide="prev" role="button">
//     <span class="glyphicon glyphicon-chevron-left"></span>
//     <span class="sr-only">Previous</span>
//     </a>
//     <a class="right carousel-control carousel-control-next" role="button" href="#carousel-{{this.id}}" data-slide="next">
//     <span class="glyphicon glyphicon-chevron-right"></span>
//     <span class="sr-only">Next</span>
//     </a>
//     </div>