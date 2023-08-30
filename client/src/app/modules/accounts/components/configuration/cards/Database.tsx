/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const DatabaseCard: React.FC = () => {
    return (
        <div className='card mb-5 mb-xl-10'>
            <div
                className='card-header border-0 cursor-pointer'
                role='button'
                data-bs-toggle='collapse'
                data-bs-target='#kt_account_database'
            >
                <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Database Management</h3>
                </div>
            </div>
            <div id='kt_account_database' className='collapse show'>
                <div className='card-body border-top p-9'>
                    <div className='d-flex flex-wrap align-items-center'>
                        <div id='kt_signin_email' className={' ' + (false && 'd-none')}>
                            <div className='fs-6 fw-bolder mb-1'>Back Up Database</div>
                        </div>
                        <div id='kt_signin_email_button' className={'ms-auto ' + (false && 'd-none')}>
                            <button
                                onClick={() => {
                                    console.log("create new backup")
                                }}
                                className='btn btn-light btn-active-light-primary'
                            >
                                Create New Back Up
                            </button>
                        </div>
                    </div>
                    <div className='separator separator-dashed my-6'></div>
                    <div className='d-flex flex-wrap align-items-center mb-2'>
                        <div id='kt_signin_password' className={' ' + (false && 'd-none')}>
                            <div className='fs-6 fw-bolder mb-1'>Clear All logs</div>
                        </div>
                        <div
                            id='kt_signin_password_button'
                            className={'ms-auto ' + (false && 'd-none')}
                        >
                            <button
                                onClick={() => {
                                    console.log("clear all logs")
                                }}
                                className='btn btn-light btn-active-light-primary'
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { DatabaseCard }
