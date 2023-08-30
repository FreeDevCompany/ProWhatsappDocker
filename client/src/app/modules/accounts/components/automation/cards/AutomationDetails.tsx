import React, { useState } from 'react'
import { IAutomationSettings, automationSettingsInitial as initialValues } from '../AutomationSettingsModel'
import * as Yup from 'yup'
import { useFormik } from 'formik'

const profileDetailsSchema = Yup.object().shape({
  minMessageDelay: Yup.number().required('Minimum Message delay range is required'),
  maxMessageDelay: Yup.number().required('Maximum Message delay range is required'),
  startTime: Yup.date().required('Message start time is required')
})

const AutomationDetails: React.FC = () => {
  const [data, setData] = useState<IAutomationSettings>(initialValues)

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IAutomationSettings>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const updatedData = Object.assign(data, values)
        setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Autmation Settings</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Message Delay Range</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Minimum message delay'
                      {...formik.getFieldProps('minMessageDelay')}
                    />
                    {formik.touched.minMessageDelay && formik.errors.minMessageDelay && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.minMessageDelay as string}</div>
                      </div>
                    )}
                  </div>

                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Minimum message delay'
                      {...formik.getFieldProps('maxMessageDelay')}
                    />
                    {formik.touched.maxMessageDelay && formik.errors.maxMessageDelay && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.maxMessageDelay as string}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Company</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='StartTime'
                  {...formik.getFieldProps('messageStartTime')}
                />
                {formik.touched.messageStartTime && formik.errors.messageStartTime && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.messageStartTime as string}</div>
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { AutomationDetails }
