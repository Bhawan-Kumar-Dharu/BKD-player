console.log("Hellow World!");
let currentSong = new Audio();
let songs;
let currFolder;
let songFolder;
let songUL;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    } else {
        const Minutes = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        const formattedMinutes = String(Minutes).padStart(2, "0")
        const formattedSeconds = String(sec).padStart(2, "0")

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`https://raw.githubusercontent.com/Bhawan-Kumar-Dharu/BKD-player/main/songs/${folder}/`);
    let text = await a.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1].trim());
        }
    }


    let songUl = document.querySelector("#songUL");
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <div>
            <span class="dancingBars"><img src="images/genres.png" alt="" width="24"></span>
            <div class="info">
            <marquee scrolldelay="200" direction="left">${song.replaceAll("%20", " ").replaceAll("%", " ")}</marquee>
                <span>Artist name 1</span>
            </div>
        </div>
    </li>`
    }


    Array.from(document.getElementById("songUL").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        })
    })

    return songs;

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {

        currentSong.play();
        play.src = "images/pause.png"
    } else {

    }


    document.getElementsByClassName("nav")[0].firstElementChild.innerHTML = `<marquee  scrolldelay="200" direction="left">${track.replaceAll("%20", " ")}</marquee>`;
}



async function displayAlbums() {
    let a = await fetch(`https://raw.githubusercontent.com/Bhawan-Kumar-Dharu/BKD-player/main/songs/`);
    let text = await a.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`https://github.com/Bhawan-Kumar-Dharu/BKD-player/tree/main/songs/${folder}/info.json`);
            let text = await a.json();

            albums.innerHTML = albums.innerHTML + `<div data-folder="${folder}" class="card">
            <div>
                <img src="songs/${folder}/cover.jpg" alt="">
            </div>
            <div>
                <h3>${text.title}</h3>
                <span>${text.description}</span>
            </div>

        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}

async function main() {
    let a = await fetch(`https://raw.githubusercontent.com/Bhawan-Kumar-Dharu/BKD-player/main/songs/`);
    let text = await a.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");



    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            currFolder = e.href.split("/").slice(-1)[0];
        }
    }


    // here it is getting the folders to show the songs in the playlist
    await getSongs(`songs/${currFolder}`);
    playMusic(songs[0], true);

    // Dsiplay all the albums
    displayAlbums();

    // if a song is playing then it will changes src play or pause icons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.png"
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        } else {
            currentSong.pause();
            play.src = "images/play.png"
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        }
    })

    songName.innerHTML = `<marquee  scrolldelay="200" direction="left">${songs[0].replaceAll("%20", "").replaceAll("%", "").trim()}</marquee>`;

    // this will updates the time duration according to the song time
    currentSong.addEventListener("timeupdate", () => {
        songTime.innerHTML = secondsToMinutesSeconds(currentSong.currentTime) + " / " + secondsToMinutesSeconds(currentSong.duration);
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // here seekbar is updating when a songs is playing according timeupdate
    document.getElementsByClassName("bar")[0].addEventListener("click", (e) => {
        let offsetX = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        circle.style.left = offsetX + "%";
        currentSong.currentTime = (currentSong.duration / 100) * offsetX;
    })

    // Previous button's script is written here
    prev.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) > 0) {
            playMusic(songs[index - 1]);
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        } else {
            playMusic(songs[0]);
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        }
    })

    // Next button's script is written here
    next.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].trim());
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        } else {
            playMusic(songs[0]);
            cSongsrc = currentSong.src
            opacityChanging(cSongsrc)
        }
    })


    // setting hamburger
    hamburger.addEventListener("click", e => {
        container1.style.left = "0%"
    })
    document.getElementById("close").addEventListener("click", e => {
        container1.style.left = "-100%"
    })

    // setting the volume at max
    currentSong.volume = volumeRange.value / 100;

    // agar volume 0 ho to icon mute hojayega
    volIcon2.addEventListener("click", e => {
        currentSong.volume = 0;
        document.querySelector("#volumeRange").value = 0;
        console.log(currentSong.volume);
        volIcon1.src = "images/mute.png"
        volIcon2.src = "images/mute.png"
    })

    // agar volume 0 se kam hoga to volume icon half mute ayega aur agar volume 0.5 se zyada hoga to volume icon aur agar volume 0 hoga to mute wala icon se change hoajyega 
    document.querySelector("#volumeRange").addEventListener("input", e => {
        console.log(e);
        let volume = e.target.value / 100;
        currentSong.volume = volume;
        if (currentSong.volume < 0.5 && currentSong.volume > 0) {
            volIcon1.src = "images/mute (2).png"
            volIcon2.src = "images/mute (2).png"

        } else if (currentSong.volume > 0.5) {
            volIcon1.src = "images/notmute.png"
            volIcon2.src = "images/notmute.png"

        } else if (currentSong.volume == 0) {
            volIcon1.src = "images/mute.png"
            volIcon2.src = "images/mute.png"
        }
    })



    // Setting the position of range for click Event listener on volume icon 
    volIcon1.addEventListener("click", e => {
        if (volRange_volIcon.style.right == "") {
            volRange_volIcon.style.right = "-8%";
        } else if (volRange_volIcon.style.right == "-8%") {
            volRange_volIcon.style.right = "-100%"

        } else {
            volRange_volIcon.style.right = "-8%";
        }
    })


}


// this is a function that will called when a song is playing it will changes the icon to a gif of a song in the playlist 
function opacityChanging(cSongsrc) {
    Array.from(document.getElementsByTagName("li")).forEach(e => {
        Array.from(e.getElementsByTagName("marquee")).forEach(element => {
            cSongsrc = cSongsrc.split("/").slice(-1)[0].replaceAll("%20", " ");
            if (element.innerHTML == cSongsrc) {
                if (currentSong.paused) {
                    element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].getElementsByTagName("img")[0].src = "images/genres.png";
                    element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].style.backgroundColor = "#fff"
                } else {
                    element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].getElementsByTagName("img")[0].src = "images/musicplaybars.gif";
                    element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].style.backgroundColor = "rgb(139 139 139 / 16%)"
                }
            } else {
                element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].getElementsByTagName("img")[0].src = "images/genres.png";
                element.parentElement.parentElement.getElementsByClassName("dancingBars")[0].style.backgroundColor = "#fff"
            }
        });
    })
}

main(); 
