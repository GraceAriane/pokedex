const searchInput = document.querySelector('.recherche-poke input')

let allPokemon =[]
let tableauFin =[]
const listPoke = document.querySelector('.liste-poke')
const chargement = document.querySelector('.loader')

const types ={
    grass: '#78c850',
    ground:'#e2bf65',
    dragon:'#6f35fc',
    fire:'#f58271',
    electric:'#f7d02c',
    fairy:'#d685ad',
    poison:'#966da3',
    bug:'#b3f594',
    water:'#6390f0',
    normal:'#d9d5d8',
    psychic:'#f95587',
    flying:'#a98ff3',
    fighting:'#c25956',
    rock:'#b6a136',
    ghost:'#735797',
    ice: '#96d9d6'
}

function fetchPokemonBase(){

    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then(reponse => reponse.json())
    .then((allPoke)=>{
        // console.log(allPoke)
        allPoke.results.forEach(pokemon => {
            fetchPokemonComplet(pokemon)
        });
    })
    .catch(err=>{
        console.log("une erreur est survenu", err)
    })

}

fetchPokemonBase()

function fetchPokemonComplet(pokemon){
    
    let objPokemonFull = {}
    let url = pokemon.url
    let nameP = pokemon.name

    fetch(url)
    .then(reponse => reponse.json())
    .then(pokeData =>{
        // console.log(pokeData)

        objPokemonFull.pic = pokeData.sprites.front_default
        objPokemonFull.type = pokeData.types[0].type.name
        objPokemonFull.id = pokeData.id

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(reponse => reponse.json())
        .then(pokeData =>{
            // console.log(pokeData)

            objPokemonFull.name = pokeData.names[4].name

            allPokemon.push(objPokemonFull)

            if(allPokemon.length === 151){
                // console.log(allPokemon)

                tableauFin = allPokemon.sort((a,b)=>{
                    return a.id - b.id
                    //on calcule comme ca pour savoir dans quel ordre classer les éléments
                    //a-b<0 => a vient avant b
                    //a-b>0 => b vient avant a
                    //a-b=0 => ils restent dans le même ordre
                    
                }).slice(0,21)
                // console.log(tableauFin)

                createCard(tableauFin)
            }

        })
    })

    chargement.style.display = 'none'

}

//Création de cartes

function createCard(arr){
    for(let i=0; i<arr.length; i++){
        const carte = document.createElement('li')
        let couleur = types[arr[i].type]
        carte.style.background = couleur
        const txtCarte = document.createElement('h5')
        txtCarte.innerText = arr[i].name
        const idCarte = document.createElement('p')
        idCarte.innerText = `ID#${arr[i].id}`
        const imgCarte = document.createElement('img')
        imgCarte.src = arr[i].pic

        carte.appendChild(imgCarte)
        carte.appendChild(txtCarte)
        carte.appendChild(idCarte)

        listPoke.appendChild(carte)

    }
}

//Scroll Infini

window.addEventListener('scroll', ()=>{

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    //scrolltop c'est ce qu'on a scrollé depuis le debut(top)
    //scrollHeight la haute totale du site
    //clientHeight la hauteur visible ie de la fenetre
    
    if(clientHeight + scrollTop > scrollHeight-20){
        addPoke(6)
    }

})

let index = 21

function addPoke(nb){
    if(index >151){
        return
    }
    const arrToAdd = allPokemon.slice(index, index + nb)
    createCard(arrToAdd)
    index += nb
}

//Recherche

searchInput.addEventListener('keyup', recherche)

// const formRecherche = document.querySelector('form')
// formRecherche.addEventListener('submit', e=>{
//     e.preventDefault()
//     recherche()
// })



function recherche(){
    if(index<151){
        addPoke(130)
        /* on fait ca parce que pour rechercher il faut que tous les pokémons soient la
        donc comme a deja 21 affichées par defaut, on va ajouter les 130 autres */
    }
    let filter, allLi, titleValue, allTitles
    filter = searchInput.value.toUpperCase()
    allLi = document.querySelectorAll('li')
    allTitles = document.querySelectorAll('li > h5')

    for(i=0;i<allLi.length;i++){
        titleValue = allTitles[i].innerText

        if(titleValue.toUpperCase().indexOf(filter)>-1){
            allLi[i].style.display = "flex"

        }else{
            allLi[i].style.display = "none"
        }

    }

}



//Animation input
searchInput.addEventlistener("input", e=>{

    if(e.target.value !==''){
        e.target.parentNode.classList.add('active-input')
    }else if(e.target.value ===''){
        e.target.parentNode.classList.remove('active-input')
    }
})