import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Llama from '../assets/img/llama-state-2.svg';
import { mondayApiService } from '../services/mondayApiService';
import { utilService } from '../services/utilService';
import Time from 'monday-ui-react-core/dist/icons/Time';
import Icon from "monday-ui-react-core/dist/Icon.js"

export const PingedPage = ({ pingData }) => {
    console.log(pingData);
    const [pingSender, setPingSender] = useState(null)

    useEffect(() => {
        fetchPingSender()
    }, [])

    const fetchPingSender = async () => {
        const sender = await mondayApiService.getUser(pingData.pingSenderId)
        setPingSender(sender)
    }

    return (
        pingData && <div className="pinged-page-wrapper">
            {pingSender && <div className="ping-sender-details-container">
                <div className="name-container">
                    <h6 className="initials">
                        {utilService.getNameInitials(pingSender.name)}
                    </h6>
                    <h5 className="name">{pingSender.name}</h5>
                </div>

                <div className="time-container">
                    <Icon iconType={Icon.type.SVG} icon={Time} iconLabel="clock time svg icon" iconSize={16} />
                    <h6>{moment(pingData.pingDate).from(Date.now())}</h6>
                </div>
            </div>}
            <h2>Pinged!</h2>
            <p>This task's status should be updated.</p>
            <img src={Llama} alt="Llama" className="llama" />
        </div>
    )
}
