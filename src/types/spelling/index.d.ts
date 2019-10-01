declare module 'spelling' {
  class Spelling {
    constructor(dictionary: string)
    lookup(word: string) : LookupResult
  }

  interface LookupResult {
    found: boolean
    word: string
    rank?: number
    suggestions?: LookupResult[]
  }

  export default Spelling
}

declare module 'spelling/dictionaries/en_US' {
  const dictionary : string
  export default dictionary
}
