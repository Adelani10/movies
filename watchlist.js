const watchlistPlaceholder = document.querySelector(".watchlist-placeholder")

let movieHtml= []
function getMoviesArray(){
    return localStorage.getItem("movies") ? JSON.parse(localStorage.getItem("movies")) : []
}

window.addEventListener("DOMContentLoaded", renderMovies)

function renderMovies(){
    const element = document.createElement("div")
    element.classList.add("flex", "flex-col", "items-center")
    const arrSaved = getMoviesArray()
    if (arrSaved.length > 0){
            for (let item of arrSaved){
            fetch(`http://www.omdbapi.com/?i=${item.firstItem}&apikey=4ccd412e`)
                .then(res => res.json())
                .then(data =>{
                    const {Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID} = data
                    movieHtml.unshift(`<div class="w-full p-2 border-b-2 space-x-3 flex items-center">
                                    <img src="${Poster}" class="w-1/4 max-h-full object-cover inline-block" alt="">

                                        <div class="p-3 max-w-[75%] space-y-2 md:space-y-5 text-sm">
                                            <div class=" flex items-center space-x-2">
                                                <h1 class="md:text-2xl text-lg font-bold">${Title}</h1>
                                                <p class="text-sm"><i class="fa-solid fa-star text-yellow-200"></i> ${imdbRating}</p>
                                            </div>
                                            <div class="flex space-x-3">
                                                <p class="time">${Runtime}</p>
                                                <p class="category text-[12px]">${Genre}</p>
                                                <button data-id="${imdbID}" class="flex remove-btn hover:text-sky-400 items-center space-x-1 text-[10px]">
                                                    <i class="fa-solid fa-circle-minus"></i> 
                                                    <p class="hover:text-sky-400">
                                                        Remove
                                                    </p>
                                                </button>
                                            </div>
                                            <p class="text-zinc-400 leading-3 text-[10px] md:text-sm">
                                                ${Plot}
                                            </p>
                                        </div>
                                    </div>`)

                            element.innerHTML = movieHtml.join("")
                            element.querySelectorAll(".remove-btn").forEach((removeB)=>{
                                removeB.addEventListener("click", (e)=>{
                                    let removeFromWAtchlistPageBtn = e.currentTarget
                                    let mainId = removeFromWAtchlistPageBtn.dataset.id
                                    const mainDiv = removeFromWAtchlistPageBtn.parentElement.parentElement.parentElement
                                    element.removeChild(mainDiv)
                                    removeFromLocalStorage(mainId)
                                })
                            })
            })
        }
        watchlistPlaceholder.appendChild(element)
    }
    else{
        watchlistPlaceholder.innerHTML = `<div class="flex flex-col items-center absolute top-[50%] 
                                        translate-y-[-50%]">
                                            <p class="text-sm text-neutral-200 tracking-widest">
                                            Your watchlist is looking a little empty
                                        </p>
                                        <a href="index.html" class="flex hover:text-sky-400 items-center space-x-2 text-[10px]">
                                            <i class="fa-solid fa-circle-plus"></i>
                                            <p class="hover:text-sky-400  text-neutral-200 tracking-widest">
                                                let's add some movies
                                            </p>
                                        </a>
                                        </div>`
    }
}

function removeFromLocalStorage(id){
    let arr = getMoviesArray()
    if (arr.length > 0){
        arr = arr.filter((item)=>{
            if (id !== item.firstItem){
                return item
            }
        })
    }
    localStorage.setItem("movies", JSON.stringify(arr))
}