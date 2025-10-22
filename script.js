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
async function main(){
    
    var currentsong;

    //get all the songs
    let songs= await getsongs();

    //show all the songs in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li><img width="20px" class="invert hand" src="svg/music.svg" alt="">
                                                <div>
                                                    <div>${song.replaceAll("%20", " ")} </div>
                                                    <div>mai hu</div>
                                                </div>
                                                <div class="playnow flex">
                                                    <span>Play Now</span>
                                                    <img width="20px" class="invert" src="svg/play.svg" alt="">
                                                </div></li>`;
    }

    // var audio= new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration);
    // })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        console.log(e);
    })
}

main()