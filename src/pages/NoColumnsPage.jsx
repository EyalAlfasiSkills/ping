import React, { useMemo } from 'react'

export const NoColumnsPage = ({ assigneeColumn, subjectColumn }) => {
    const instructions = useMemo(() => {
        if (!assigneeColumn && subjectColumn) {
            return <>
                <h2>Oops... We couldn't find any users to Ping.</h2>
                <h3>Your users column might be empty, <br /> or you need to create a new one.</h3>
            </>
        } else if (assigneeColumn && !subjectColumn) {
            return <>
                <h2>Oops... We couldn't find any status column to Ping about.</h2>
                <h3>please select a status column from settings or create a new one.</h3>
            </>
        } else if (!assigneeColumn && !subjectColumn) {
            return <>
                <h2>Oops... We couldn't find any users and status columns to Ping about.</h2>
                <h3>please select users and status columns from settings or create new ones.</h3>
            </>
        }
    }, [])

    return (
        <div className="no-columns-page-wrapper">
            {instructions}
        </div>
    )
}
