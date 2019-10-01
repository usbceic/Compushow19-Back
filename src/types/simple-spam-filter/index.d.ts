declare module 'simple-spam-filter' {
  class SimpleSpamFilter {
    constructor(options? : SimpleSpamFilterParams)
    isSpam(text: string) : boolean
  }

  class SimpleSpamFilterParams {
    minWords?: number
    maxPercentCaps?: number
    maxNumSwearWords?: number
  }

  export default SimpleSpamFilter
  export {
    SimpleSpamFilterParams
  }
}
