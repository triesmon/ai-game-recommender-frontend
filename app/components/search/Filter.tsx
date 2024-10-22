export type Filter = {
    similarity: number,
    rating: number[],
    metacritic_score: number[]
    release_year_range: number[]
    show_only_saved: boolean
    tab_option: TabOption
    sortBy: SortBy
    categories: string[]
}

export enum TabOption {
    Search = 'search',
    Recent = 'recent',
    Saved = 'saved',
}

export enum SortBy {
    Similarity = 'similarity',
    Uniqueness = 'uniqueness',
}