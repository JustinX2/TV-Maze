const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

async function getShowsByTerm(term) {
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`)
  return res.data.map(function(show){
    return {
      id: show.show.id, /*show.show.id but not show.id because show.id key is a child element of the show object*/
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing"
    };
  });
}

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>`
    );
    $showsList.append($show);
  }
}

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)

  return res.data.map(function(episodes){
    return {
      id: episodes.id,
      name: episodes.name,
      season: episodes.season,
      number: episodes.number
    };
  });
}

// function populateEpisodes(episodes) { }

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes){
    const $episode = $(
      `<li>
        ${episode.name} (season ${episode.season}, number ${episode.number})
      </li>`
    );
    $episodesList.append($episode);
  }
  $episodesArea.show();
}

$showsList.on("click", ".Show-getEpisodes", async function(event){
  const showID = $(event.target).closest(".Show").data("show-id");
  const episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
})
