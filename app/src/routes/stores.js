import { writable } from 'svelte/store'

/** used to maintain the state of filtered keyboards */
export const filterStore = writable({
  filterOptions: [],
  selectedFilters: {}
});
