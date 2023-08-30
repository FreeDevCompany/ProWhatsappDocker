import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  StatisticsWidget5,
  MixedWidget1,
} from '../../../_metronic/partials/widgets'

const AdminDashboardPage = () => (
  <>
    <div className='row g-5 g-xl-8'>
      {/** Aylık ortalama kredi kullanımı */}
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-xl-8'
          svgIcon='profile-circle'
          color='warning'
          iconColor='white'
          title='23,671'
          titleColor='white'
          description='Kullanıcı Sayısı'
          descriptionColor='white'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-5 mb-xl-8'
          svgIcon='chart-simple-3'
          color='success'
          iconColor='white'
          title='883,237'
          titleColor='white'
          description='Mesaj Sayısı'
          descriptionColor='white'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-5 mb-xl-8'
          svgIcon='shield-tick'
          color='secondary'
          iconColor='white'
          title='26'
          titleColor='white'
          description='Aktif Kullanıcı Sayısı'
          descriptionColor='white'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-5 mb-xl-8'
          svgIcon='google'
          color='danger'
          iconColor='white'
          title='733,511'
          titleColor='white'
          description='Google Trafik analizi'
          descriptionColor='white'
        />
      </div>
    </div>
    <div className='row g-5 g-xl-8'>
      <div className='col-xl-4'>
        <MixedWidget1 className='card-xl-stretch mb-xl-8' color='primary' />
      </div>
    </div>
  </>
)

const AdminDashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <AdminDashboardPage />
    </>
  )
}

export {AdminDashboardWrapper}
