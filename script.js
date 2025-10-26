let currentsong= new Audio();
let songs;
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

async function getsongs() {
    let a =await fetch("http://127.0.0.1:3000/songs/");
    let response= await a.text();
    let div= document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("%5Csongs%5C")[1]);
        } 
    }
    return(songs)
}

const playMusic = (track, pause=false)=> {
    // let audio= new Audio("/songs/"+track)
    currentsong.src= "/songs/" + track
    if(!pause){
        currentsong.play()
        play.src="svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
    
}

async function main(){
    //get all the songs
    let songs= await getsongs();
    playMusic(songs[0], true)

    //show all the songs in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0];
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
        console.log(index)
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
}

main()