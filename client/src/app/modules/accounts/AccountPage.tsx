import React from 'react'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Settings} from './components/settings/Settings'
import {AccountHeader} from './AccountHeader'
import {Automation} from './components/automation/Automation'
const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/settings/overview',
    isSeparator: false,
    isActive: true,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <AccountHeader />
            <Outlet />
          </>
        }
      >
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
              <Overview />
            </>
          }
        />
        <Route
          path='settings'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle>
              <Settings />
            </>
          }
        />
        <Route
          path='automation'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Automation</PageTitle>
              <Automation />
            </>
          }
        />
        <Route index element={<Navigate to='/settings/overview' />} />
      </Route>
    </Routes>
  )
}

export default AccountPage
