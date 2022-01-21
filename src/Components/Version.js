import React, { Fragment } from "react"
import { Tooltip } from 'antd'
import { ReactComponent as TotalLength } from '../assets/images/total_length.svg'
import { ReactComponent as SliderCount } from '../assets/images/count_sliders.svg'
import { ReactComponent as CircleCount } from '../assets/images/count_circles.svg'
import { ReactComponent as BPM } from '../assets/images/bpm.svg'
import { GeneralMixins } from '../Components'

function Version({ mode, ver }) {
    var iconWidth, iconHeight = '20px'
    
    return (
        <Fragment>
            <Tooltip placement="top" title={
                <div className="beatmap-version-tooltip-single">
                    <div className="beatmap-version-tooltip-info-header">
                        {GeneralMixins.modeToicon(mode)}
                        <span><i className="fas fa-star"/>{GeneralMixins.addCommas(ver.difficulty_rating.toFixed(2))}</span>
                        <span>{ver.version}</span>
                    </div>
                    <ul>
                        <Tooltip placement="top" title={"Total length"}>
                            <li>
                                <TotalLength width={iconWidth} height={iconHeight}/><span>{GeneralMixins.secondsToTime(ver.total_length)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"BPM"}>
                            <li>
                                <BPM width={iconWidth} height={iconHeight}/><span>{parseFloat(ver.bpm)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Circle count"}>
                            <li>
                                <CircleCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_circles)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Slider count"}>
                            <li>
                                <SliderCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_sliders)}</span>
                            </li>
                        </Tooltip>
                    </ul>
                </div>
            }>
                <div className="beatmap-version-single" style={{ '--color': GeneralMixins.getDiffColor(ver.difficulty_rating)}}></div>
            </Tooltip>
            {/* {ver.version} | {isCollapse ? 'collapse' : 'expand'} */}
        </Fragment>
    )
}

export default Version