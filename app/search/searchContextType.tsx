import {Game} from "@/app/components/shared/Game";
import React from "react";
import {Filter, SortBy} from "@/app/components/search/Filter";

export type SearchContextType = {
    loading: boolean;

    isSearching: boolean | undefined;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean | undefined>>;

    findSimilar: (result: Game, updateHistory?: boolean, page?:number) => void;
    similarGame: Game | null;

    results: Game[];
    setResults: React.Dispatch<React.SetStateAction<Game[]>>;

    filteredResults: Game[];
    setFilteredResults: React.Dispatch<React.SetStateAction<Game[]>>;

    filter: Filter;
    setFilter: React.Dispatch<React.SetStateAction<Filter>>

    searchType: string;
    setSearchType: React.Dispatch<React.SetStateAction<string>>;

    sortBy: SortBy;
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};