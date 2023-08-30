import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  ListsWidget7,
  MixedWidget10,
} from '../../../_metronic/partials/widgets'
import { UsersListWrapper } from '../../modules/apps/user-management/users-list/UsersList'

const DashboardPage = () => (
  <>
    <div className='row g-5 g-xl-9'>
      {/** Aylık ortalama kredi kullanımı */}
      <div className='col-xl-6 mb-8'>
        <MixedWidget10
          className='card-xl-stretch'
          chartColor='warning'
          chartHeight='150px'
        />
      </div>
      <div className='col-xl-6'>
        {/** Kuyruk işlem sırası*/}
        <ListsWidget7 className='card-xl-stretch mb-8'/>
      </div>
    </div>
    <div className='row g-5 g-xl-8'>
      {/** Mesaj Taslağı */}
      <div className='col-xl-stretch mb-8'>
        <UsersListWrapper />
      </div>
    </div>
    <div className='row g-5 g-xl-8'>
      {/** Kişiler ve gruplar */}
      <div className='col-xl-stretch mb-8'>
        <UsersListWrapper />
      </div>
    </div>
    <div className='row g-5 g-xl-8'>
      {/** Kuyruk Oluşturma */}
      <div className='col-xl-stretch mb-8'>
        <UsersListWrapper />
      </div>
    </div>
  </>
)

const DashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
