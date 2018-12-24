class MovieRating {
    constructor(film) {
        this.film = film;
    }

    domUpdater(response) {
        console.log(response);
        this.film.outerHTML = this.film.outerHTML + ' ' + this.button(response.imdbRating, response.imdbID);
    }

    button(rating, imdbId) {
        return "<a href='https://www.imdb.com/title/"+imdbId+"/' style='"+this.style()+"'>" + rating + "</a>"
    }

    style() {
        return "font-weight: bold;text-decoration: none;background: #f2f52d;padding: 1px 10px;border-radius: 5px;display: inline-block;border: none;font-size: 12px;color: #000;"
    }
}

var filmList2 = document.querySelectorAll("a.PreviewTooltip");
for (var filmKey in filmList2) {

    if (!isNaN(parseInt(filmKey))) {

        var film = filmList2[filmKey];
        var findChar = film.text.indexOf("(");
        var nameWithoutYeah = film.text.substring(0, findChar);
        var res = nameWithoutYeah.split("/");

        var enFilmName = res[res.length - 1];

        let url = 'https://www.omdbapi.com/?t=' + enFilmName + '&apikey=7ab179b0';
        let user = new MovieRating(film);

        var request = new Request(url, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                "Content-Type": "application/json; charset=utf-8",
            })
        });

        fetch(request)
            .then(res => res.json())
            .then(
                response => user.domUpdater(response)
            )
            .catch(err => {
                console.log("sorry, there are no results for your search")
            });
    }

}