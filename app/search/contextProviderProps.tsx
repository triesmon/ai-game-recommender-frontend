'use client'

import React, {useCallback, useEffect, useState} from "react";
import {Game} from "@/app/components/shared/Game";
import {useRouter, useSearchParams} from "next/navigation";
import {Filter, SortBy, TabOption} from "@/app/components/search/Filter";
import {base_url, SearchContext} from "@/app/components/constants";
import {isResultIdSaved} from "@/app/components/search-results/Result";
import axios from "axios";

export type ContextProviderProps = React.PropsWithChildren<{}>;
export const ContextProvider: React.FC<ContextProviderProps> = ({children}) => {
    const [searchType, setSearchType] = useState('title');
    const [similarGame, setSimilarGame] = useState<Game | null>(null);
    const [results, setResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams()
    const [filteredResults, setFilteredResults] = useState<Game[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.Similarity);

    const [filter, setFilter] = useState<Filter>(() => {
        const savedFilter = JSON.parse(localStorage.getItem('filter') || '{}');

        return {
            similarity: savedFilter.similarity || 85,
            rating: savedFilter.rating || [85, 100],
            metacritic_score: savedFilter.metacritic_rating || [0, 100],
            release_year_range: savedFilter.release_year_range || [2013, 2023],
            tab_option: savedFilter.tab_option || TabOption.Search,
            sortBy: savedFilter.sortBy || SortBy.Similarity,
            categories: savedFilter.categories || [],
            show_only_saved: savedFilter.show_only_saved || false
        } as Filter;
    });

    useEffect(() => {
        // Save current filter to local storage
        localStorage.setItem('filter', JSON.stringify(filter));
    }, [filter]);

    useEffect(() => {
        let filtered = results.filter((result) => {
                if (filter?.rating) {
                    const rating = Math.round(result.rating * 100) / 100;
                    return rating >= filter.rating[0] / 100 && rating <= filter.rating[1] / 100;
                }
                return true;
            }
        ).filter((result) => {
            if (filter?.metacritic_score) {
                const rating = result.metacritic_score;
                return rating >= filter.metacritic_score[0] && rating <= filter.metacritic_score[1];
            }
            return true;
            }
        ).filter((result) => {
                if (filter?.release_year_range) {
                    const year = parseInt(result.release_date.split(' ')[2])
                    return year >= filter.release_year_range[0] && year <= filter.release_year_range[1];
                }
                return true;
            }
        ).filter((result) => {
                if (filter?.tab_option == TabOption.Saved){
                    return isResultIdSaved(result.id);
                }
                return true;
            }
        ).filter((result) => {
                if (filter?.categories) {
                    return filter.categories.every((category) => result.categories.includes(category));
                }
                return true;
            }
        )

        // Get information for saved game ids
        if (filter?.tab_option == TabOption.Saved) {
            axios.post(`${base_url}/games/`, getAllSavedGames())
                .then((response: any) => {
                    setFilteredResults(response.data)
                });
        } else {
            setFilteredResults(filtered)
        }

    }, [filter, results, searchParams]);

    function getAllSavedGames() {
        const savedGamesString = localStorage.getItem('savedGames');
        let savedGamesArray: number[] = savedGamesString ? JSON.parse(savedGamesString) : [];
        return savedGamesArray;
    }

    useEffect(() => {
        if (similarGame){
            findSimilar(similarGame, false);
        }
    }, [sortBy]);

    const findSimilar = useCallback((result: Game, updateHistory: boolean = true, page: number = 1) => {
        if (updateHistory) {
            router.push(`/search?id=${result.id}`);
        }

        let path = 'recommend'
        switch(sortBy){
            case SortBy.Similarity:
                path = 'recommend';
                break;
            case SortBy.Uniqueness:
                path = 'anomalies';
                break;
        }

        setFilter((oldFilter) => ({
            ...(oldFilter || {}),
            tab_option: TabOption.Search,
        }));

        fetch(`${base_url}/${path}/${result['id']}?page=${page}`)
            .then(response => response.json())
            .then(data => {
                if (page === 1) {
                    setResults(data);
                } else {
                    setResults(prevResults => [...prevResults, ...data]);
                }
                setSimilarGame(result);
                setLoading(false);
            });

    }, [router, base_url, sortBy]);

    return (
        <SearchContext.Provider value={{
            searchType,
            setSearchType,
            similarGame,
            results,
            loading,
            filter,
            filteredResults,
            setFilter,
            setResults,
            isSearching,
            setIsSearching,
            findSimilar,
            sortBy,
            setSortBy
        }}>
            {children}
        </SearchContext.Provider>
    );


};