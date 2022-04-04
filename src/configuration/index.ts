import devConfigs from './dev'
import prodConfigs from './prod'

const env = process.env.REACT_APP_ENV

// eslint-disable-next-line no-restricted-globals
const configs = devConfigs

export default Object.freeze({ ...configs })
