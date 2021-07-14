import React, { useEffect, useMemo, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from '../assets/lottie/llama.json';
import Button from "monday-ui-react-core/dist/Button.js"
import Llama from '../assets/img/llama-state-2.svg';
export const PingNowPage = ({ onSendPing, users, isSending, isSent }) => {

    const [isStopped, setIsStopped] = useState(true)
    const [isAnimationComplete, setIsAnimationComplete] = useState(false)

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const eventListeners = [
        {
            eventName: 'complete',
            callback: () => setIsAnimationComplete(true),
        },
    ]

    useEffect(() => {
        if (isAnimationComplete) {
            onSendPing()
        }
    }, [isAnimationComplete])

    const usersToPingStr = useMemo(() => {
        let str = ''
        if (!users) {
            str = `Ping`
        } else if (users.length > 1) {
            str = `Ping ${users[0].name} and ${users.length - 1} more!`
        } else {
            str = `Ping ${users[0].name}!`
        }
        return str
    }, [users])

    const pingedStr = useMemo(() => {
        let str = ''
        if (!users) {
            str = `was Pinged!`
        } else if (users.length > 1) {
            str = `${users[0].name} and ${users.length - 1} more were Pinged!`
        } else {
            str = `${users[0].name} was Pinged!`
        }
        return str
    }, [users])


    return <div className="ping-now-page-wrapper">
        <h2>{isSent ? pingedStr : usersToPingStr}</h2>

        {isSent ? <p>We sent your Ping successfully. <br /> Hopefully, soon you'll see the status update.</p>
            : <p>Your team members forgot to update a task status? Ping them now.
                We’ll send a notification reminding them to update it.</p>}
        {isSent ? <img src={Llama} alt="Llama" className="llama" />
            : <Lottie
                options={defaultOptions}
                height={300}
                width={400}
                isClickToPauseDisabled={true}
                isStopped={isStopped}
                eventListeners={eventListeners}
            />}

        {!isSent && <Button className="ping-btn" onClick={() => setIsStopped(false)}>Ping now</Button>}
    </div>

}
