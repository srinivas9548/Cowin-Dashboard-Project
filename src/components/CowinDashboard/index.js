import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCowinVaccinationData()
  }

  getCowinVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(
          eachVaccination => ({
            dose1: eachVaccination.dose_1,
            dose2: eachVaccination.dose_2,
            vaccineDate: eachVaccination.vaccine_date,
          }),
        ),
        vaccinationByAge: data.vaccination_by_age.map(eachVaccination => ({
          age: eachVaccination.age,
          count: eachVaccination.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(
          eachVaccination => ({
            count: eachVaccination.count,
            gender: eachVaccination.gender,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state
    const result = Object.keys(vaccinationData)

    return (
      <>
        {result.length > 0 && (
          <VaccinationCoverage
            vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
          />
        )}
        {result.length > 0 && (
          <VaccinationByGender
            vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
          />
        )}
        {result.length > 0 && (
          <VaccinationByAge
            vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
          />
        )}
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderViewBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-container">
        <div className="cowin-dashboard-content">
          <div className="cowin-logo-and-label-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="website-logo"
            />
            <h1 className="website-label">Co-WIN</h1>
          </div>
          <h1 className="title">CoWIN Vaccination in India</h1>
          {this.renderViewBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
