import React, { useState, useEffect, Fragment } from "react"
import { Navbar, GeneralMixins } from "../Components"
import { getGlobalState, useGlobalState } from '../store'
import axios from "axios"

import '../assets/css/components/info.css'

function Info() {
    // const [Info] = useGlobalState("Info")
    const [Info, setInfo] = useState({})
    const [SubInfo, setSubInfo] = useState({})
    const [Load, setLoad] = useState(true)

    useEffect(() => {
        setInterval(() => {
            var apiURL = getGlobalState("apiURL")
            axios.get(
                `${apiURL}/status`
            ).then(function (response) {
                setInfo(response.data)
            })

            apiURL = getGlobalState("ko2apiURL")
            axios.get(
                `${apiURL}/status`
            ).then(function (response) {
                setSubInfo(response.data)
            })
            setLoad(false)
        }, 2000);
    }, [])

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                {!Load && 
                <div className="info-container">
                    <div className="info-Single">
                        <ul className="info-page">
                            <li>
                                <h3>Threads Count</h3>
                                <p>{Info.CpuThreadCount}</p>
                            </li>
                            <li>
                                <h3>Running Goroutine Count</h3>
                                <p>{GeneralMixins.addCommas(String(Info.RunningGoroutineCount))}</p>
                            </li>
                            <li>
                                <h3>Api Count</h3>
                                <p>{GeneralMixins.addCommas(String(Info.apiCount))}</p>
                            </li>
                            <li>
                                <h3><i className="fa-solid fa-database"></i> Storage</h3>
                                <p>{GeneralMixins.addCommas(String(Info.fileCount))} files ({Info.fileSize})</p>
                            </li>
                        </ul>
                        <a href="https://stats.uptimerobot.com/MA71nc2rxK">Main API Server</a>
                    </div>
                    
                    <div className="info-Single">
                        <ul className="info-page">
                            <li>
                                <h3>Threads Count</h3>
                                <p>{SubInfo.CpuThreadCount}</p>
                            </li>
                            <li>
                                <h3>Running Goroutine Count</h3>
                                <p>{GeneralMixins.addCommas(String(SubInfo.RunningGoroutineCount))}</p>
                            </li>
                            <li>
                                <h3>Api Count</h3>
                                <p>{GeneralMixins.addCommas(String(SubInfo.apiCount))}</p>
                            </li>
                            <li>
                                <h3><i className="fa-solid fa-database"></i> Storage</h3>
                                <p>{GeneralMixins.addCommas(String(SubInfo.fileCount))} files ({SubInfo.fileSize})</p>
                            </li>
                        </ul>
                        <a href="https://stats.uptimerobot.com/MA71nc2rxK">Ko2 API Server</a>
                    </div>
                </div>
                }
            </div>
        </Fragment>
    )
}

export default Info
