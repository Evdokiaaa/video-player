const container = document.querySelector('.container')
const video = document.querySelector('video');
const playPause_btn = document.querySelector('.play');
const progressBar = document.querySelector('.progress__bar')

//skips time

const skipForward = document.querySelector('.skip__forward')
const skipBackward = document.querySelector('.skip__backward')


//audio

const volumeBtn = document.querySelector('.volume')
const volumeSlider = document.querySelector('input')

//fullscreen

const fullscreenBtn = document.querySelector('.expand__window')

//video timeline

const videoTimeline = document.querySelector('.video__timeline')

//video time

const currentVideoTime = document.querySelector('.current__time')
const videoDuration = document.querySelector('.video__duration')

//controsl

let timer;

const controlsMenu = () =>{
    if(video.paused) return;  // if paused return
    timer = setTimeout(() =>{
        container.classList.remove('show__controls')
    },1500)
}

controlsMenu()

container.addEventListener('mousemove',()=>{
    container.classList.add('show__controls')
    clearTimeout(timer)
    controlsMenu()
})


videoTimeline.addEventListener('click',(event)=>{
    let timelineWidth = videoTimeline.clientWidth; //Показывается цифры куда кликнули

    video.currentTime=(event.offsetX / timelineWidth) * video.duration

})

const draggableProgression = (e) =>{
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`
    video.currentTime=(e.offsetX / timelineWidth) * video.duration      //за плавное перетаскивание, мб пофиксить в буд
    currentVideoTime.innerTextf=formatTime(video.currentTime)
}

videoTimeline.addEventListener('mousedown',()=>{
    videoTimeline.addEventListener('mousemove',draggableProgression) //за плавное перетаскивание, мб пофиксить в буд


})

container.addEventListener('mouseup',()=>{
    videoTimeline.removeEventListener('mousemove',draggableProgression)
})

videoTimeline.addEventListener('mousemove',e=>{
    const progresstime = videoTimeline.querySelector('span')
    let offsetx = e.offsetX;
    progresstime.style.left = `${offsetx}px`
    let timelineWidth = videoTimeline.clientWidth;
    let percent = (e.offsetX / timelineWidth) * video.duration
    progresstime.innerText=formatTime(percent)

})

volumeBtn.addEventListener('click',function (){
    if(volumeBtn.childNodes.item(1).src.endsWith('volume.png')) { // src = ... - перезапись
        video.volume=0.0;
        volumeBtn.childNodes.item(1).src = 'volume_off.png';
        // volume.childNodes.item(1).src = 'volume_off.png'

    } else{
        volumeBtn.childNodes.item(1).src = 'volume.png';
        video.volume=0.5;
    }
    volumeSlider.value = video.volume

})


volumeSlider.addEventListener('input',function(event){
    video.volume = event.target.value
    if(video.volume==0){
        volumeBtn.childNodes.item(1).src = 'volume_off.png';

    } else{
        volumeBtn.childNodes.item(1).src = 'volume.png';
    }

})

fullscreenBtn.addEventListener('click',function(){
    container.classList.toggle('fullscreen')
    if(document.fullscreen){
        return document.exitFullscreen() //exit from fullscreen

    }
    container.requestFullscreen() // go to fullscreen
})

video.addEventListener('timeupdate',function(e){
    let {currentTime,duration} = e.target //Надо в объект обернуть бтв ( бив эти штуки есть по дефолту)
    let percent = (currentTime/duration)*100 //getting percent to fill line
    progressBar.style.width = `${percent}%`
    currentVideoTime.innerText=formatTime(currentTime)
})

video.addEventListener('loadeddata',(e)=>{
    videoDuration.innerText = formatTime(e.target.duration) //Добавляем в видеодюрейшен наша время видео
})

playPause_btn.addEventListener('click',()=>{
    playPauseVideo()
})

skipForward.addEventListener('click',function(){
    video.currentTime +=5
})

skipBackward.addEventListener('click',function(){
    video.currentTime -=5
})

window.addEventListener('keyup',function(event){
    if(event.code==='Space'){
        playPauseVideo()
    }



})
video.addEventListener('play',()=>{ // if played - change play btn to stop

    playPause_btn.childNodes.item(1).src = 'pause.png'

})

video.addEventListener('pause',()=>{ //if stopped - change btn to play
    playPause_btn.childNodes.item(1).src ='play_mini.png'


})

function playPauseVideo(){
    video.paused?video.play():video.pause()
}

function formatTime(currentTime){
    let seconds = Math.floor(currentTime%60)
    let minutes = Math.floor(currentTime/60)%60;
    let hours = Math.floor(currentTime/3600)

    seconds = seconds < 10? `0${seconds}` : seconds;
    minutes = minutes < 10? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;


    if(hours==0){
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`

}

//ФИКСАНУТЬ VOLUME OFF -> поменять на белую