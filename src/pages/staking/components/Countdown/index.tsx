import React, { FC, useEffect, useState } from "react";

const CountDown: FC<{
    finishAt: number
}> = ({ finishAt }) => {
    var [v, setV] = useState(finishAt - new Date().getTime())
    useEffect(() => {
        let id = setInterval(() => {
            setV(finishAt - new Date().getTime())
        }, 1000)

        // return () => clearInterval(id)
    }, [finishAt])
    var s = Math.round(v / 1000)
    var d = v < 0 ? 0 : Math.floor(s / (60 * 60 * 24))
    
    s = s - d * 24 * 60 * 60
    var h = v < 0 ? 0 : Math.floor(s / (60 * 60))
    
    s = s - h * 60 * 60
    var m = v < 0 ? 0 : Math.floor(s / 60)

    s = s - m * 60

    s = v < 0 ? 0 : s

    if (d > 0) return <span>{d}d : {h}h : {m}m : {s}s</span>
    if (h > 0) return <span>{h}h : {m}m : {s}s</span>
    return <span>{m}m : {s}s</span>
}

export default CountDown