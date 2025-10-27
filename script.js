let currentsong= new Audio();
let songs;
let currFolder;
function secondsToMinutes(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    const minutes= Math.floor(seconds/60);
    const remainingSeconds=Math.floor(seconds%60);
    
    const newMinutes=String(minutes).padStart(2,'0');
    const newSeconds=String(remainingSeconds).padStart(2,'0');
    return`${newMinutes}:${newSeconds}`;
}

async function getsongs(folder) {
    currFolder=folder;
    let cf=folder.split("/")[1];
    // console.log(ca)
    // let cf= "songs%5Cncs"; 
    let a =await fetch(`/${currFolder}/`);
    let response= await a.text();
    let div= document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){  
            songs.push(element.href.split(`%5Csongs%5C${cf}%5C`)[1]);
        } 
    }

    //show all the songs in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li><img width="20px" class="invert hand" src="svg/music.svg" alt="">
                                                <div class="info">
                                                    <div>${song.replaceAll("%20", " ")} </div>
                                                    <div>mai hu</div>
                                                </div>
                                                <div class="playnow flex">
                                                    <span>Play Now</span>
                                                    <img width="20px" class="invert" src="svg/play.svg" alt="">
                                                </div></li>`;
    }

    //attach eventlistener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    return songs;

}

const playMusic = (track, pause=false)=> {
    // let audio= new Audio("/songs/"+track)
    currentsong.src= `/${currFolder}/` + track
    if(!pause){
        currentsong.play()
        play.src="svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
    
}

async function displayAlbums(){
    let a =await fetch(`/spotifyy/songs/`);
    let response= await a.text();
    let div= document.createElement("div")
    div.innerHTML=response
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("%5Csongs%5C") && !e.href.includes(".htaccess")){
            let folder= e.href.split("%5C").slice(-2)[1]
            let a =await fetch(`/songs/${folder}/info.json`)
            let response= await a.json()
            cardcontainer.innerHTML= cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <img width="17px" height="17px" src="svg/playbutton.png" alt=""/>
              </div>
              <img src="/songs/${folder}/cover.jpeg" alt="" />
              <h3>${response.title}</h3>
              <p>${response.description}</p>
            </div>`
        }
    };

    //load playlist on clicking the card
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =  await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })

    })
}

async function main(){
    //get all the songs'
    await getsongs("songs/cs");
    playMusic(songs[0], true)

    //displaying all the albums
    displayAlbums();

    //play-pause svg change
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src= "svg/pause.svg"
        }
        else{
            currentsong.pause()
            play.src= "svg/play.svg"
        }
    })

    //timeupdate 
    currentsong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left= (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    //add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent + "%";
        currentsong.currentTime = (currentsong.duration*percent)/100;
    })

    //add eventlistener on hamburger
    document.querySelector(".burger").addEventListener("click", e=>{
        document.querySelector(".left").style.left= "0";
    })
    //add eventlistener on close
    document.querySelector(".close").addEventListener("click", e=>{
        document.querySelector(".left").style.left= "-120%";
    })

    previous.addEventListener("click",e=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        } 
        else playMusic(songs[songs.length-1])
    })

    next.addEventListener("click",e=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        } 
        else{
            playMusic(songs[0])
            index=0
        }
    })

    //for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=>{
        currentsong.volume= parseInt(e.target.value)/100;
    })

    //for mute volume
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=0.5
            document.querySelector(".range").getElementsByTagName("input")[0].value=50
        }
    })
}

main()
