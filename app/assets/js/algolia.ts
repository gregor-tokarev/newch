import algoliasearch from 'algoliasearch/lite'

const algoliaClient = algoliasearch('R40L3PVYP5', '0798b7c27b0d2db05ff96e12a6724485').initIndex('threads')

const searchClient = {
  search (query: string) {
    if (query === '') {
      return
    }
    return algoliaClient.search(query)
  }
}

export default searchClient
