import { monday } from "../mondaySdk";

export const mondayApiService = {
    getLoggedInUser,
    getUsers,
    getUser,
    sendNotifications,
    getCurrentItem
}

async function getLoggedInUser() {
    try {
        const res = await monday.api(
            `query{
                me{
                  id
                  name
                }
              }`
        )
        return res.data.me
    } catch (err) {
        throw new Error('Couldn\'t fetch logged in user' + err)
    }
}

async function getUsers(userIds) {
    try {
        const res = await Promise.all(userIds.map(async (userId) => {
            const res = await monday.api(
                `query{
                    users(ids:${userId}){
                      name,
                      id
                    }
                  }`
            )
            return res.data
        }))
        return res.map(userArr => userArr["users"][0])
    } catch (err) {
        throw new Error('Couldn\'t fetch users' + err)
    }
}

async function getUser(userId) {
    const res = await monday.api(
        `query{
            users(ids:${userId}){
              name,
              id
            }
          }`
    )
    return res.data["users"][0]
}

async function sendNotifications(originItemId, userIds, notificationBody = "This is a notification") {
    if (userIds.length) {
        try {
            const createdNotifications = await Promise.all(userIds.map(async (userId) => {
                const mutationStr = `mutation {
                create_notification(
                user_id: ${userId},
                target_id: ${originItemId}, 
                text: "${notificationBody}", 
                target_type: Project
                ) {
                    text
                  }
                }`
                const res = await monday.api(mutationStr)
                return res
            }))
            return createdNotifications
        } catch (err) {
            throw new Error('Failed to create notifications ' + err)
        }
    }
}

async function getCurrentItem(itemId) {
    const item = await monday.api(`
        query {
          items(ids: ${itemId}) {
            name
            column_values {
              id
              value
              additional_info
              type
            }
          }
        }
      `)
    return item
}