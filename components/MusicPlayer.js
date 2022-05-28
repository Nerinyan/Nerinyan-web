import React from "react"
import { setGlobalState, useGlobalState } from '../store'
import { Slider } from 'antd'

// eslint-disable-next-line no-unused-vars


export default function MusicPlayer() {
    const { useState, useEffect } = React
    
    var test = 0
    var test2 = 0
    var timer
    var timer2
    
    const [playingPercent, setPlayingPercent] = useState(0)
    const [isSkip, setIsSkip] = useState(false)
    const [volume, setVolume] = useState(0)
    const [isPlaying] = useGlobalState("musicPlayerIsPlaying")
    const [isPaused] = useGlobalState("musicPlayerIsPaused")
    const [beatmap] = useGlobalState("musicPlayerBeatmap")

    timer2 = setTimeout(function () {
        if (isPaused === true && isPlaying === false) {
            document.getElementById("musicPlayerAudio").pause()
            setIsSkip(true)
        }
    })

    function volumeHandler(value) {
        const player = document.getElementById("musicPlayerAudio")
        localStorage.setItem("musicPlayerVolume", (value / 100))
        player.volume = value / 100
    }

    function playerToggleHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        const player = document.getElementById("musicPlayerAudio")
        if (!isPaused) {
            setGlobalState("musicPlayerIsPaused", true)
            player.pause()
        } else {
            setGlobalState("musicPlayerIsPaused", false)
            setGlobalState("musicPlayerIsPlaying", true)
            player.play()
        }
    }

    function progressbarControlHandler(value) { 
        const player = document.getElementById("musicPlayerAudio")
        var current = value / 10
        setPlayingPercent(current)
        test = current
        player.currentTime = current
        timer = null
    }

    function progressbarHandler() {
        const player = document.getElementById("musicPlayerAudio")
        var increment = 10 / player.duration
        setPlayingPercent(Math.min(increment * player.currentTime * 10, 100))
        test = Math.min(increment * player.currentTime * 10, 100)
        Timer()
    }

    function Timer() { 
        if (playingPercent < 100) {
            timer = setTimeout(function () {progressbarHandler()})
        }
    }

    function getVolumeOnLocalStroage() {
        if (localStorage.getItem("musicPlayerVolume") !== null) {
            test2 = localStorage.getItem("musicPlayerVolume") * 100
            return setVolume(localStorage.getItem("musicPlayerVolume") * 100)
        }
        else {
            test2 = 25
            return setVolume(25)
        }
    }

    useEffect(() => {
        getVolumeOnLocalStroage()
        const player = document.getElementById("musicPlayerAudio")
        player.onerror = function() {
            player.pause()
            setGlobalState("musicPlayerIsPaused", true)
            setGlobalState("musicPlayerIsPlaying", false)
        }
        player.onended = function() {
            player.pause()
            setGlobalState("musicPlayerIsPaused", true)
            setGlobalState("musicPlayerIsPlaying", false)
        }
        player.onplaying = function() {
            setIsSkip(false)
            setGlobalState("musicPlayerIsPaused", false)
            progressbarHandler()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="music-player-block" style={beatmap.title !== undefined ? {display: 'block'} : {display: 'none'}} data-musicplayer-skip={isSkip} data-musicplayer-isplaying={isPlaying ? true : false}>
            <audio preload="metadata" src={"https://b.ppy.sh/preview/0.mp3"} id="musicPlayerAudio"></audio>
            <div className="music-player-head" style={{ "--bg": "center / cover no-repeat url(https://assets.ppy.sh/beatmaps/"+beatmap.id+"/covers/cover@2x.jpg?1622784772)" }}>
                <img alt="" src={"https://assets.ppy.sh/beatmaps/"+beatmap.id+"/covers/list@2x.jpg?1622784772"}></img>
                <div className="music-player-info">
                    <span className="title">{beatmap.title}</span>
                    <span className="artist">{beatmap.artist}</span>
                </div>
            </div>
            <div className="music-player-body">
                <div className="music-player-controller">
                    <Slider className={"music-player-progress"} trackStyle={{height: "10px", transition: "width 10ms ease"}} handleStyle={{display: 'none'}} value={test} tipFormatter={null} defaultValue={0} onChange={progressbarControlHandler} />
                    <button onClick={(e) => {playerToggleHandler(e)}}>
                        <i className={"fa-duotone fa-" + (!isPaused ? "pause" : "play")}></i>
                    </button>
                    <div className="music-player-volume-controller">
                        <i className="fa-solid fa-volume-low"></i>
                        {/* <Slider trackStyle={{height: "7.5px"}} handleStyle={{display: 'none'}} tipFormatter={null} defaultValue={test2} onChange={volumeHandler} /> */}
                        <Slider trackStyle={{height: "7.5px"}} handleStyle={{display: 'none'}} tipFormatter={null} defaultValue={20} />
                        <i className="fa-solid fa-volume-high"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}