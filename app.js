const input = document.querySelector(".input")
const btn = document.querySelector(".btn")
const movieSpacePlaceholder = document.querySelector(".movie-space-placeholder")
const movieOptionSpace = document.querySelector(".movie-option-space")
let movieHtml= []

function getMoviesArray(){
    return localStorage.getItem("movies") ? JSON.parse(localStorage.getItem("movies")) : []
}

btn.addEventListener("click", function(e){
    e.preventDefault()
    const value = input.value
    const element = document.createElement("div")
    element.classList.add("flex", "flex-col", "items-center")
    if (value) {
        fetch(`http://www.omdbapi.com/?s=${value}&apikey=4ccd412e`)
        .then(res=> res.json())
        .then(data=> {
            for(let item of data.Search){ 
                fetch(`http://www.omdbapi.com/?i=${item.imdbID}&apikey=4ccd412e`)
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
                                                <button data-id="${imdbID}" class="flex add-btn hover:text-sky-400 items-center space-x-1 text-[10px]">
                                                    <i class="fa-solid fa-circle-plus"></i>
                                                    <p class="hover:text-sky-400">
                                                        Watchlist
                                                    </p>
                                                </button>
                                            </div>
                                            <p class="text-zinc-400 leading-3 text-[10px] md:text-sm">
                                                ${Plot}
                                            </p>
                                        </div>
                                    </div>`)
                            element.innerHTML = movieHtml.join("")
                            element.querySelectorAll(".add-btn")
                             document.querySelectorAll(".add-btn").forEach((addB)=>{
                                addB.addEventListener("click", (e)=>{
                                let watchlistBtn = e.currentTarget
                                let mainId = watchlistBtn.dataset.id
                                watchlistBtn.textContent = "Added"
                                watchlistBtn.style.color = "green"
                                watchlistBtn.disabled = true
                                addToLocalStorage(mainId)
                            }) 
                        })                
                })
            }
        })
        movieOptionSpace.appendChild(element)
        const firstDiv = movieOptionSpace.firstElementChild
        movieOptionSpace.removeChild(firstDiv)
    }
    else{
        movieOptionSpace.innerHTML = `<p class="absolute top-[50%] translate-y-[-50%] text-xl text-center text-neutral-200">
                                        Unable to find what you're looking for. Please try another search
                                        </p>`
    }
    input.value = ""
})

function addToLocalStorage(a){
    let arr = getMoviesArray()
    let movieItems = {firstItem: a}
    arr.push(movieItems)
    localStorage.setItem("movies", JSON.stringify(arr))
}
