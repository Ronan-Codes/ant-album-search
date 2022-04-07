const domSelectors = {
  content: document.getElementById("content"),
}

// rQuery
class RQuery {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
    }
    on(eventType, cb) {
        this.elements.forEach(element => {
            element.addEventListener(eventType, cb)
        })
    }
    html(innerHTML) {
        this.elements.forEach(element => {
            element.innerHTML = innerHTML
        })
    }
    hide() {
        this.elements.forEach(element => {
            element.previousDisplay = element.style.display
            element.style.setProperty('display', 'none')
        })
    }
    show() {
        this.elements.forEach(element => {
            element.style.setProperty('display', element.previousDisplay)
        })
    }
}

const $$ = (selector) => {
    return new RQuery(selector)
}

$$.ajax = async ({url}) => {
    return fetch(url)
            .then(res => res.json())
}
// RQuery end

const subHeaderInnerHTML = {
    searchArtist: `<h2 class="loader-container__subheading">Search Albums by Artist Name:</h2>`,
    loaderHTML: `<div class="lds-dual-ring"></div>`,
}

const loaderTemplate = `<div id="loader" class="loader"></div>`

function fetchAlbum(artist) {
    return $$.ajax({
        url: `https://itunes.apple.com/search?term=${artist}&media=music&entity=album&attribute=artistTerm&limit=200`,
        success: function (result) {
            console.log(result)
        }
    })

    // return fetch(`https://itunes.apple.com/search?term=${artist}&media=music&entity=album&attribute=artistTerm&limit=200`)
    //     .then(res => res.json())
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
    $$('#searchForm').on('submit', event => {
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
            // console.log(albumJson)
            let arrLength = 4

            if (!albumCount) {
                alert("No albums found. Please try a different artist.")
            }
            renderTemplate(domSelectors.content, albums.slice(0,4), albumCount)

            hideLoading(albumCount, nameArtist)
            loadBtnVisible()

            // Load Four More Functionality 
            $$('.load-more-btn').on('click', function(e) {
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
    })

    
    
}

function getChildInputValue(parentElement){
    // let artistName = parentElement.firstChild.nextSibling.value
    let reformattedArtistName  = parentElement.firstChild.nextSibling.value.replaceAll(' ', '+')
    parentElement.firstChild.nextSibling.value = ""
    return reformattedArtistName
}

let loaderContainer = $$(".loader-container")
function displayLoading() {
    loaderContainer.html(subHeaderInnerHTML.loaderHTML)
}
function hideLoading(albumCount, artistName) {
    loaderContainer.html(`<h2 class="loader-container__subheading">${albumCount} results for "${artistName}"</h2>`)
}

$$(".load-more-btn").hide()
function loadBtnVisible() {
    $$(".load-more-btn").show()
}

searchEvent()
