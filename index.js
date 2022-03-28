const gap = 250;

const domSelectors = {
  carousel: document.getElementById("carousel"),
  content: document.getElementById("content"),
  next: document.getElementById("next"),
  prev: document.getElementById("prev"),
  searchInput: document.getElementById("searchInput"),
//   searchBtn: document.getElementById("searchBtn"),
  loader: document.querySelector(".loader-container"),
  searchForm: document.getElementById("searchForm")
}

const loaderTemplate = `<div id="loader" class="loader"></div>`

let width = domSelectors.carousel.offsetWidth;
// window.addEventListener("resize", e => (width = domSelectors.carousel.offsetWidth));

function scrollEvents() {
    domSelectors.next.addEventListener("click", e => {
      domSelectors.carousel.scrollBy(width + gap, 0);
      if (domSelectors.carousel.scrollWidth !== 0) {
        domSelectors.prev.style.display = "flex";
      }
      if (domSelectors.content.scrollWidth - domSelectors.carousel.scrollLeft <= 1000) {
        domSelectors.next.style.display = "none";
      }
    
      console.log("scrollWidth",domSelectors.content.scrollWidth)
      console.log("scrollLeft",domSelectors.carousel.scrollLeft)
    });
  

  
    domSelectors.prev.addEventListener("click", e => {
      domSelectors.carousel.scrollBy(-(width + gap), 0);
      if (domSelectors.carousel.scrollLeft - width - gap <= 0) {
        domSelectors.prev.style.display = "none";
      }
      if (!domSelectors.content.scrollWidth - width - gap <= domSelectors.carousel.scrollLeft + width) {
        domSelectors.next.style.display = "flex";
      }
    });
}

// 

function fetchAlbum(artist) {
//     return fetchJsonp('https://itunes.apple.com/lookup?id=979458609&entity=album')
    return fetch(`https://itunes.apple.com/search?term=${artist}&media=music&entity=album&attribute=artistTerm&limit=200`)
        .then(res => res.json())
            // .then(json => console.log(json.results));
}



function createTemplateFromAlbumArr(albumArr, count){
    return albumArr.map(album => {
      return `<div class="item">
      <img src="${album.artworkUrl100}" class="item__img" aria-label="album image">
      <p><em>Album: ${album.collectionName}</em></p>
      <p><em>Artist: ${album.artistName}</em></p>
    </div>`
  }).join(" ")
}

function renderTemplate(element, template) {
  element.innerHTML = template
}



scrollEvents()

// onchange event for input (Utilize later and replace onSubmit)
function searchEvent() {
    
    domSelectors.searchInput.addEventListener('change', (event) => {
        event.preventDefault()
    
        const artistName = domSelectors.searchInput.value
        const reformattedName = artistName.replaceAll(' ', '+')
        console.log(reformattedName)
    
        // domSelectors.loader.classList.add("display")
        displayLoading()
        // domSelectors.loader.style.display = "inline"
    
        fetchAlbum(reformattedName).then(albumJson => {
            const albums = albumJson.results
            const albumCount = albumJson.resultCount
            console.log(albums, albumCount)
            renderTemplate(domSelectors.content, createTemplateFromAlbumArr(albums, albumCount))
        })
        .then(result => hideLoading())
    
        // domSelectors.loader.classList.remove("display")
    });
}
searchEvent()


// Optimize later with on change.. AND event delegation
domSelectors.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const artistName = domSelectors.searchInput.value
    const reformattedName = artistName.replaceAll(' ', '+')
    console.log(reformattedName)

    displayLoading()
    console.log(domSelectors.loader.classList)

    fetchAlbum(reformattedName).then(albumJson => {
        const albums = albumJson.results
        const albumCount = albumJson.resultCount
        console.log(albums, albumCount)
        renderTemplate(domSelectors.content, createTemplateFromAlbumArr(albums, albumCount))
    })
    .then(result => hideLoading())

    // domSelectors.loader.classList.remove("display")
});

// make function to show count 

function displayLoading() {
    domSelectors.loader.classList.add("display");
}

function hideLoading() {
    domSelectors.loader.classList.remove("display");
}
