import React, { useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import { Navbar, Footer, Beatmap, GeneralMixins, MusicPlayer, Filter, Devbar } from "../Components"
import { getGlobalState, useGlobalState, setGlobalState } from '../store'
import { Modal } from 'antd' 
import { useTranslation } from "react-i18next"

import '../assets/css/components/beatmap.css'

function Beatmaps({ dev }) {
    const { t } = useTranslation()
    const [filterMobile] = useGlobalState("filterMobile")
    const [filterOpen] = useGlobalState("filterOpen")
    const [apiResult] = useGlobalState("apiResult")
    const [noResult] = useGlobalState("noResult")
    const [loading] = useGlobalState("loading")
    const [explicitWarningHandle] = useGlobalState("explicitWarningHandle")
    const [searchParams] = useSearchParams()

    function scrollHandler() {
        const documentData = document.documentElement
        // console.log(documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading') && !getGlobalState('firstLoad') )
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading') && !getGlobalState('firstLoad')) {
            // BeatmapListCreator(true)
            GeneralMixins.getApiData()
        }
        if (documentData.scrollTop >= 1) {
            document.getElementById("filter-area").style.top = 0;
            document.getElementById("filter-area").style.height = "calc(100vh - var(--footer-height))";
        } else {
            document.getElementById("filter-area").style.top = "70px";
            document.getElementById("filter-area").style.height = "calc(100vh - 70px - var(--footer-height))";
        }
    }

    function resizeHandler() {
        if (window.innerWidth <= 1024) {
            if (!filterMobile)
                setGlobalState("filterMobile", true)
                setGlobalState("filterOpen", false)
        }
        else {
            setGlobalState("filterMobile", false)
            setGlobalState("filterOpen", true)
        }
    }

    let renderBeatmaps = []
    apiResult.forEach((bmap, index) => {
        if (bmap.beatmaps.length > 0)
            renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
        else
            console.log(`Null Beatmaps Detected. -> ${bmap.id} ${bmap.artist} - ${bmap.title} Mapped by ${bmap.creator}`)
    })
    setGlobalState('currentExpandedData', apiResult[0])

    const portalCloseEventController = () => {
        document.body.addEventListener("click" , (e) => {
            if (!document.querySelector("#portal").contains(e.target) || !document.getElementsByClassName("ant-dropdown").contains(e.target)) {
                if (document.getElementById("beatmap-portal"))
                    document.getElementById("beatmap-portal").style.animation = "close forwards 200ms"
                
                //for animation
                setTimeout(() => {
                    setGlobalState('currentExpandedID', 0)
                }, 200)
            }
            if (getGlobalState("filterMobile")) {
                if (!document.querySelector("#filter-area").contains(e.target)) {
                    console.log('gd')
                    setGlobalState("filterOpen", false)
                }
            }
        })
    }

    useEffect(() => {
        if (window.innerWidth <= 1024) {
            if (!filterMobile)
                setGlobalState("filterMobile", true)
                setGlobalState("filterOpen", false)
        }
        else {
            setGlobalState("filterMobile", false)
            setGlobalState("filterOpen", true)
        }
        GeneralMixins.getUserRequestParams(searchParams)
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        window.addEventListener("resize", resizeHandler)
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
          window.removeEventListener("resize", resizeHandler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        portalCloseEventController()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                {/* Change API URL For dev */}
                {
                    dev &&
                    <Devbar/>
                }

                {/* Explicit Warning Modal */}
                <Modal
                    open={explicitWarningHandle}
                    centered={true}
                    closable={false}
                    title=""
                    footer={
                        [
                            <div className="explicit-warning-footer">
                                <button className="btn explicit-warning-button blue" onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setGlobalState("explicitWarningHandle", false)
                                    return GeneralMixins.downloadBeatmap()
                                }}>
                                    <p>{t("explicit_warning_button_download")}</p>
                                </button>
                                <button className="btn explicit-warning-button blue" onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setGlobalState("explicitWarningHandle", false)
                                    GeneralMixins.setCookie("skip_explict_warning", true)
                                    return GeneralMixins.downloadBeatmap()
                                }}>
                                    <p>{t("explicit_warning_button_disable_warning")}</p>
                                </button>
                                <button className="btn explicit-warning-button red cancel" onClick={(e) => {
                                    setGlobalState("explicitWarningHandle", false)
                                    return
                                }}>
                                    <p>{t("explicit_warning_button_cancel")}</p>
                                </button>
                            </div>
                        ]
                    }
                >
                    <div className="explicit-warning">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <strong>{t("explicit_warning_title")}</strong>
                        <p>{t("explicit_warning_content1")}</p>
                        <p>{t("explicit_warning_content2")}</p>
                    </div>
                </Modal>

                <div className="two-side">
                    <div className="left">
                        <button className="filter-btn" data-show={filterMobile} onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            if (filterOpen) setGlobalState("filterOpen", false)
                            else setGlobalState("filterOpen", true)
                        }}>
                            <i className="fa-solid fa-filter"></i>
                        </button>
                        <Filter />
                    </div>

                    <div className="right">
                        {/* Beatmap List */}
                        <ul className="beatmap-list">
                            {noResult &&
                                <li className="notfound">
                                    <p>
                                        {t("oops")} <br/>
                                        {t("search_results_do_not_exist")}
                                    </p>
                                </li>
                            }
                            {!noResult &&
                                renderBeatmaps
                            }
                        </ul>
                    </div>
                </div>

                {/* Back to top */}
                <p href="#top" className="backToTop" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.scrollTo({top: 0, behavior: 'smooth'})
                }}>
                    <i className="fa-solid fa-circle-arrow-up"></i>
                </p>
                <MusicPlayer />
            </div>
            
            <Footer />
        </Fragment>
    )
}

export default Beatmaps
