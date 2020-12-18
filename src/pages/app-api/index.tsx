import {asyncComponent, log} from '@src/common/utils'
import './app-api.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./app-api')
    return module.default
  } catch (error) {
    log('asyncComponent home', error)
  }
  return null
})
