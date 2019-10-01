declare module 'bad-words' {
  class Filter {
    constructor(options? : FilterParams)
    isProfane(phrase: string) : boolean
    replaceWord(phrase: string) : string
    clean(phrase: string) : string
    addWords(...words: string[]) : void
    removeWords(...words: string[]) : void
  }

  class FilterParams {
    emptyList?: boolean
    list?: string[]
    placeHolder?: string
    regex?: string
    replaceRegex?: string
  }

  export default Filter
  export {
    FilterParams
  }
}

