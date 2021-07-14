import React from 'react'

export const StatusUpdatedPage = ({ subjectColumn }) => {
    console.log(subjectColumn);
    return (
        <div className="status-updated-page-wrapper">
            <h2>Woohoo! item status was updated</h2>

            <p>The new status is:</p>

            <span className="status-box" style={{ backgroundColor: subjectColumn.additionalInfo.color }}>
                <h6>{subjectColumn.additionalInfo.label}</h6>
            </span>
        </div>
    )
}
