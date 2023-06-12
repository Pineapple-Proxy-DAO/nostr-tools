import {createNymMixnetClient, NymMixnetClient} from '@nymproject/sdk'

class NymClient {
  nym: NymMixnetClient | null
  isInitialized: boolean

  constructor() {
    this.nym = null
    this.isInitialized = false
    this.init()
  }

  async init() {
    if (typeof window === 'undefined') {
      return
    }

    this.nym = await createNymMixnetClient()

    if (!this.nym) {
      console.error('Oh no! Could not create client')
      return
    }

    const nymApiUrl = 'https://validator.nymtech.net/api'

    await this.nym.client.start({
      clientId: 'My awesome client',
      nymApiUrl
    })

    this.nym.events.subscribeToConnected(e => {
      console.log('Connected to gateway', e)
    })

    this.isInitialized = true
  }

  waitForNymClientReady(delay = 1000): Promise<void> {
    return new Promise(resolve => {
      const checkInitialization = () => {
        if (this.isInitialized) {
          resolve()
        } else {
          setTimeout(checkInitialization, delay)
        }
      }

      checkInitialization()
    })
  }
}

const nymClient = new NymClient()
export default nymClient
