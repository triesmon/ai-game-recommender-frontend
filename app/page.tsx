'use client'

import React, {useContext, useEffect, useState} from 'react';
import './pages/App.css';
import './components/global.css'
import Result from "./components/search-results/Result";
import {Button, Menu, MenuItem, Slider, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Game} from "./components/shared/Game";
import {useSearchParams} from "next/navigation";
import {SearchContextType} from "@/app/search/searchContextType";
import {base_url, SearchContext} from "@/app/components/constants";
import 'normalize.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DataProvider from "@/app/components/server/DataProvider";
import {SortBy, TabOption} from "@/app/components/search/Filter";
import {handleTabSetting} from "@/app/components/header/header";

export default function AppWrapper() {
    return (
        <Page></Page>
    );
}

export function useSearchContext(): SearchContextType {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error("Component must be used within a ContextProvider");
    }

    return context;
}

export async function fetchGame(param: Game) {
    return fetch(`${base_url}/game/${param['id']}`)
        .then((data: any) => (data.json()) as Game);
}

function Page() {
    const {
        searchType,
        filter,
        setFilter,
        filteredResults,
        findSimilar,
        setResults,
        similarGame,
        sortBy,
        setSortBy
    } = useSearchContext();
    const searchParams = useSearchParams()
    const [visibleResults, setVisibleResults] = useState<number>(50);
    const [page, setPage] = useState<number>(1);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        window.history.scrollRestoration = 'auto';
    }, []);

    useEffect(() => {
        const hasId = searchParams.get('id');
        (async () => {
            handleTabSetting(filter.tab_option, setResults, searchParams, findSimilar);
        })();

    }, [searchType, searchParams])


    return (
        <div>
            {filter?.tab_option !== TabOption.Saved && (
                <>
                    <label>Steam Rating %</label>
                    <Slider
                        min={70}
                        max={100}
                        value={filter?.rating}
                        onChange={(e, value) => {
                            if (Array.isArray(value)) {
                                setFilter((oldFilter) => ({
                                    ...oldFilter,
                                    rating: value,
                                }));
                            }
                        }}
                        valueLabelDisplay={"auto"}
                    />
                    <label>Metacritic Rating %</label>
                    <Slider
                        min={0}
                        max={100}
                        value={filter?.metacritic_score}
                        onChange={(e, value) => {
                            if (Array.isArray(value)) {
                                setFilter((oldFilter) => ({
                                    ...oldFilter,
                                    metacritic_score: value,
                                }));
                            }
                        }}
                        valueLabelDisplay={"auto"}
                    />

                    {filter?.tab_option == TabOption.Search && (
                        <>
                            <label>Release Year</label>
                            <Slider
                                value={filter?.release_year_range}
                                onChange={(e, value) => {
                                    if (Array.isArray(value)) {
                                        setFilter((oldFilter) => ({
                                            ...oldFilter,
                                            release_year_range: value,
                                        }));
                                    }
                                }}
                                min={2004}
                                max={2023}
                                marks={true}
                                valueLabelDisplay="auto"
                            />
                        </>
                    )}


                    <ToggleButtonGroup
                        value={filter.categories}
                        onChange={(e, value) => {
                            if (Array.isArray(value)) {
                                setFilter((oldFilter) => ({
                                    ...oldFilter,
                                    categories: value,
                                }));
                            }
                        }}
                    >
                        <ToggleButton value="Multi-player">
                            Multi-Player
                        </ToggleButton>
                        <ToggleButton value="Co-op">
                            Co-Op
                        </ToggleButton>
                    </ToggleButtonGroup>

                </>
            )}

            <DataProvider repo=""></DataProvider>

            {(similarGame || filter.tab_option != TabOption.Search) && (
                <div className={"sticky"}>
                    <KeyboardArrowUpIcon fontSize={"large"} onClick={() => window.scrollTo(0, 0)}></KeyboardArrowUpIcon>
                    {filter?.tab_option == TabOption.Search && (
                        <>
                        <span>Games Similar To: {similarGame?.name}</span>
                        <Button
                            id="demo-positioned-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            Sort By: {sortBy}
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={() => {
                                setSortBy(SortBy.Similarity)
                                handleClose()
                            }} >Similarity</MenuItem>
                            <MenuItem onClick={() => {
                                setSortBy(SortBy.Uniqueness)
                                handleClose()
                            }} >Uniqueness</MenuItem>
                        </Menu>
                        </>
                        )}
                        {filter?.tab_option == TabOption.Recent && (
                            <span>Recently Released Games</span>
                        )}
                        {filter?.tab_option == TabOption.Saved && (
                            <span>Your Bookmarked Games</span>
                        )}
                        </div>
                    )}

                    <div className={"results-container"}>
                        {filteredResults.slice(0, visibleResults).map((result) =>
                            <Result
                                key={result.id}
                                result={result}
                                onFindSimilar={findSimilar}
                                sortBy={sortBy}
                            />)}
                    </div>
                    {/*<Button className={"show-more-button"} onClick={() => {*/}
                    {/*    if (similarGame) {*/}
                    {/*        if (filteredResults.length > visibleResults) {*/}
                    {/*            setVisibleResults(visibleResults + 10)*/}
                    {/*        }else {*/}
                    {/*            setPage(page + 1)*/}
                    {/*            findSimilar(similarGame, false, page);*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}}>Show More</Button>*/}
                </div>
            );

            }

