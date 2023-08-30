import React from 'react'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import { AdminProfileSettings } from './components/settings/AdminProfileSettings'
import ServerConfiguration from './components/configuration/ServerConfiguration'
import { AdminAccountHeader } from './AdminAccountHeader'
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

const AdminAccountPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <AdminAccountHeader />
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
              <AdminProfileSettings />
            </>
          }
        />
        <Route
          path='server-configuration'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Server Configuration</PageTitle>
              <ServerConfiguration />
            </>
          }
        />
        <Route index element={<Navigate to='overview' />} />
      </Route>
    </Routes>
  )
}

export default AdminAccountPage;
