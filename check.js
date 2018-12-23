
class User {
    constructor(film) {
        this.film = film;
    }

    domUpdater(response) {
    	console.log(response, response.imdbRating, this.film);
    	console.log('');
    	this.film.innerHTML = this.film.innerHTML + ' | ' + response.imdbRating;
    }
}

var filmList2 = document.querySelectorAll("a.PreviewTooltip");
for (var filmKey in filmList2) {

    if (parseInt(filmKey)) {



        var film = filmList2[filmKey];
        var findChar = film.text.indexOf("(");
        var nameWithoutYeah = film.text.substring(0, findChar);
        var res = nameWithoutYeah.split("/");

        var enFilmName = res[res.length - 1];

        var link = 'https://www.omdbapi.com/?t=' + enFilmName + '&apikey=7ab179b0';
		let user = new User(film);

		// var request = new Request(link, {
		// 	method: 'GET', 
		// 	mode: 'cors', 
		// 	redirect: 'follow',
		// 	headers: new Headers({
		// 		"Content-Type": "application/json; charset=utf-8"
		// 	})
		// });

		// // Now use it!
		// fetch(request).then(User.test);

        fetch(link, { headers: { "Content-Type": "application/json; charset=utf-8" } })
            .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
            .then(
response => user.domUpdater(response)
            	)
            .catch(err => {

                console.log("sorry, there are no results for your search")
            });

        // fetch(link, { headers: { "Content-Type": "application/json; charset=utf-8" } })
        //     .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
        //     .then(response => {

        //         film.innerHTML = film.innerHTML + response.imdbRating;
        //         console.log(film.innerHTML, response.imdbRating);
        //     }, film)
        //     .catch(err => {

        //         console.log("sorry, there are no results for your search")
        //     });
    }

}