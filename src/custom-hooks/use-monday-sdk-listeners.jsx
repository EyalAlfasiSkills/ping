import { useEffect, useState } from 'react'
import { monday } from '../mondaySdk'


export const useMondaySdkListeners = (selector) => {
    const [context, setContext] = useState(null)
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        monday.listen("context", res => {
            setContext(res.data)
        })

        monday.listen("settings", (res) => {
            setSettings(res.data)
        })
    }, [])

    return selector(
        {
            context,
            settings
        }
    )
}
