import React, { useEffect, useMemo, useState } from "react";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import Loader from "monday-ui-react-core/dist/Loader.js"
import { mondayApiService } from "../services/mondayApiService";
import { useMondaySdkListeners } from "../custom-hooks/use-monday-sdk-listeners";
import { pingDataService } from "../services/pingDataService";
import { ASSIGNEE_COLUMN, NOT_PINGED, PINGED, SUBJECT_COLUMN, UPDATED } from "../helpers/constants";
import { PingNowPage } from "./PingNowPage";
import { NoColumnsPage } from "./NoColumnsPage";
import { PingedPage } from "./PingedPage";
import { StatusUpdatedPage } from "./StatusUpdatedPage";

export const MainPage = () => {
    const [assigneeColumn, setAssigneeColumn] = useState(null)
    const [subjectColumn, setSubjectColumn] = useState(null)
    const [users, setUsers] = useState(null)
    const [pingData, setPingData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const { context, settings } = useMondaySdkListeners(sdkListeners => sdkListeners)

    useEffect(() => {
        (async () => {
            if (context && settings) {
                await fetchPingData()
                const item = await mondayApiService.getCurrentItem(context.itemId)
                const assignee = getColumn(item, ASSIGNEE_COLUMN)
                const subject = getColumn(item, SUBJECT_COLUMN)
                if (assignee) setAssigneeColumn(assignee)
                if (subject) setSubjectColumn(subject)
                if (assignee && subject) {
                    await fetchUsers(assignee)
                } else {
                    setIsLoading(false)
                }
            }
        })()
    }, [context, settings])

    useEffect(() => {
        if (users) {
            setIsLoading(false)
        }
    }, [users])


    const fetchPingData = async () => {
        const pingData = await pingDataService.getPingData(context.itemId)
        if (pingData) {
            setPingData(pingData)
        }
    }

    const fetchUsers = async (assignee) => {
        const userIds = assignee.value.personsAndTeams.map(user => user.id)
        const users = await mondayApiService.getUsers(userIds)
        setUsers(users)
    }

    const getColumn = (item, type) => {
        if (!settings[type]) return
        const [columnId] = Object.keys(settings[type])
        const column = item.data.items[0].column_values.find(columnValue => columnValue.id === columnId)
        if (column && column.value) {
            const value = JSON.parse(column.value)
            const additionalInfo = JSON.parse(column.additional_info)
            const formattedColumn = {
                id: columnId,
                value,
                additionalInfo
            }
            return formattedColumn
        }
    }

    const onSendPing = async () => {
        const userIds = users.map(user => user.id)
        try {
            setIsSending(true)
            const createdNotifications = await mondayApiService.sendNotifications(context.itemId, userIds, "You've been Pinged! Please update item's status 🧐 🧐 🧐")
            if (createdNotifications) {
                setIsSending(false)
                setIsSent(true)
            }
            const ping = pingDataService.createPing(context.user.id, subjectColumn)
            pingDataService.setPingData(context.itemId, ping)
        } catch (err) {
            console.log(err);
            setIsSending(false)
        }
    }

    const isSender = useMemo(() => {
        if (context && pingData) {
            return pingData.pingSenderId === context.user.id
        } else {
            return false
        }
    }, [pingData])

    const wasChanged = useMemo(() => {
        if (pingData && subjectColumn) {
            console.log(pingData, subjectColumn);
            return pingData.columnToTrack.value.changed_at < subjectColumn.value.changed_at
        } else return false
    }, [pingData, subjectColumn])

    const pingPhase = useMemo(() => {
        if (!pingData) {
            return NOT_PINGED
        } else if (pingData && !wasChanged) {
            return PINGED
        } else {
            return UPDATED
        }
    }, [pingData, wasChanged])


    if (isLoading) return <Loader />

    return !isLoading && <main className={`main-container ${context ? context.theme === 'dark' ? 'dark' : 'light' : ''}`}>
        {!users ?
            <NoColumnsPage
                assigneeColumn={assigneeColumn}
                subjectColumn={subjectColumn}
            />
            :
            pingPhase === NOT_PINGED ?
                <PingNowPage
                    onSendPing={onSendPing}
                    users={users}
                    isSent={isSent}
                    isSending={isSending}
                />
                :
                pingPhase === PINGED ?
                    <PingedPage
                        pingData={pingData}
                    />
                    :
                    <StatusUpdatedPage
                        subjectColumn={subjectColumn}
                    />}
    </main>

}

