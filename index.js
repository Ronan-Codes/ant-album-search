const domSelectors = {
  content: document.getElementById("content"),
//   searchInput: document.getElementById("searchInput"),
  loader: document.querySelector(".loader-container"),
  searchForm: document.getElementById("searchForm"),
  loadMore: document.querySelector(".load-more-btn")
}

const subHeaderInnerHTML = {
    searchArtist: `<h2 class="loader-container__subheading">Search Albums by Artist Name:</h2>`,
    loaderHTML: `<div class="lds-dual-ring"></div>`,
}

const loaderTemplate = `<div id="loader" class="loader"></div>`

function fetchAlbum(artist) {
    return fetch(`https://itunes.apple.com/search?term=${artist}&media=music&entity=album&attribute=artistTerm&limit=200`)
        .then(res => res.json())
}

function createTemplateFromAlbumArr(albumArr){
    return albumArr.map(album => {
      return `<div class="item">
      <img src="${album.artworkUrl100}" class="item__img" aria-label="album image">
      <p><em>Album: ${album.collectionName}</em></p>
      <p><em>Artist: ${album.artistName}</em></p>
    </div>`
  }).join(" ")
}

function renderTemplate(element, albumArr, albumCount) {
    element.innerHTML = createTemplateFromAlbumArr(albumArr)
}

function searchEvent() {
    // inputOnChange()
    formOnSubmit()
}

// function inputOnChange(){
//     domSelectors.searchInput.addEventListener('change', (event) => {
//         event.preventDefault()
    
//         displayLoading()
    
//         fetchAlbum(getInputValue()).then(albumJson => {
//             const albums = albumJson.results
//             const albumCount = albumJson.resultCount

//             renderTemplate(domSelectors.content, createTemplateFromAlbumArr(albums, albumCount))
//         })
//         .then(hideLoading())
//     });
// }

// function getInputValue() {
//     const reformattedArtistName = domSelectors.searchInput.value.replaceAll(' ', '+')
//     return reformattedArtistName
// }

function formOnSubmit() {
    domSelectors.searchForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let inputValue = getChildInputValue(event.target)
        let artistName = inputValue? inputValue : null
    
        if (!artistName) {
            alert("Please enter an artist and try again!")
        } else {
            displayLoading()

            fetchAlbum(artistName).then(albumJson => {
            let albums = albumJson.results
            let albumCount = albumJson.resultCount
            let nameArtist = albumJson.results[0].artistName
            console.log(albumJson)
            let arrLength = 4

            if (!albumCount) {
                alert("No albums found. Please try a different artist.")
            }
            renderTemplate(domSelectors.content, albums.slice(0,4), albumCount)

            hideLoading(albumCount, nameArtist)
            loadBtnVisible()

            // Load Four More Functionality 
            domSelectors.loadMore.addEventListener('click', (e) => {
                e.preventDefault()

                fourMoreAlbums = albums.slice(0, arrLength+4)
                arrLength = arrLength+4
                
                renderTemplate(domSelectors.content, fourMoreAlbums, albumCount)
        
            })
            // Load Four More End 
            })
            .catch((error) => {
                alert(`${error}`);
            })
        }
    });
}

function getChildInputValue(parentElement){
    // let artistName = parentElement.firstChild.nextSibling.value
    let reformattedArtistName  = parentElement.firstChild.nextSibling.value.replaceAll(' ', '+')
    parentElement.firstChild.nextSibling.value = ""
    return reformattedArtistName
}

function displayLoading() {
    domSelectors.loader.innerHTML = subHeaderInnerHTML.loaderHTML
}

function hideLoading(albumCount, artistName) {
    domSelectors.loader.innerHTML = `<h2 class="loader-container__subheading">${albumCount} results for "${artistName}"</h2>`
}

function loadBtnVisible() {
    domSelectors.loadMore.classList.add("display")
}

searchEvent()
