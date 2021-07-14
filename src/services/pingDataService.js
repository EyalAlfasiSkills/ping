import { monday } from "../mondaySdk";

const BASE_STORAGE_KEY = 'PING_DATA_DB';

export const pingDataService = {
    getPingData,
    setPingData,
    createPing
}

async function getPingData(itemId) {
    const res = await monday.storage.instance.getItem(BASE_STORAGE_KEY + itemId)
    return JSON.parse(res.data.value)
}

async function setPingData(itemId, pingData) {
    const res = await monday.storage.instance.setItem(BASE_STORAGE_KEY + itemId, JSON.stringify(pingData))
    return res.data
}

function createPing(loggedInUserId, columnToTrack) {
    return {
        pingSenderId: loggedInUserId,
        pingDate: new Date().toISOString(),
        columnToTrack
    }
}