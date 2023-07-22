const pointAudioBlob = new Blob([require("../assets/point.wav")], { type: "audio/wav" });
const pointAudio = new Audio(URL.createObjectURL(pointAudioBlob));

const loserAudioBlob = new Blob([require("../assets/loser.wav")], { type: "audio/wav" });
const loserAudio = new Audio(URL.createObjectURL(loserAudioBlob));


export const playPoint = () => {
    pointAudio.play();
}

export const playLoser = () => {
    loserAudio.play();
}

let isMuted = false;
const muteButton = document.querySelector('.btn--mute');

// Define o volume inicial para 50% do volume máximo (0.5)
const initialVolume = 0.5;
pointAudio.volume = initialVolume;
loserAudio.volume = initialVolume;

muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        pointAudio.volume = 0;
        loserAudio.volume = 0;
        muteButton.innerHTML = '<span class="material-symbols-outlined font-size">volume_off</span>';
    } else {
        pointAudio.volume = initialVolume;
        loserAudio.volume = initialVolume;
        muteButton.innerHTML = '<span class="material-symbols-outlined font-size">volume_up</span>';
    }
});