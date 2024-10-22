'use client'

import SearchBox from "@/app/components/search/SearchBox";
import {Box, Tab, Tabs, ToggleButton, ToggleButtonGroup} from "@mui/material";
import React from "react";
import {fetchGame, useSearchContext} from "@/app/page";
import {ReadonlyURLSearchParams, useSearchParams} from "next/navigation";
import {TabOption} from "@/app/components/search/Filter";
import axios from "axios";
import {base_url} from "@/app/components/constants";
import {Game} from "@/app/components/shared/Game";

export function handleTabSetting(value, setResults: (value: (((prevState: Game[]) => Game[]) | Game[])) => void, searchParams: ReadonlyURLSearchParams, findSimilar: (result: Game, updateHistory?: boolean, page?: number) => void) {
    if (value == TabOption.Recent) {
        axios.get(`${base_url}/recent`)
            .then((response: any) => {
                setResults(response.data)
            });
    } else if (value == TabOption.Search) {
        const hasId = searchParams.get('id');
        if (hasId) {
            fetchGame({id: parseInt(hasId)} as Game)
                .then(game => findSimilar(game, false));
        } else {
            setResults([]);
        }
    }
}

export default function Header() {
    const {
        findSimilar,
        filter,
        setFilter,
        isSearching,
        setResults
    } = useSearchContext();
    const searchParams = useSearchParams();

    const styles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    return (
        <div style={styles}>
            <SearchBox></SearchBox>

            {!isSearching && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={filter ? filter.tab_option : TabOption.Search}
                          onChange={(_e, value) => {
                              handleTabSetting(value, setResults, searchParams, findSimilar);

                              setFilter((oldFilter) => ({
                                  ...(oldFilter || {}),
                                  tab_option: value
                              }));
                          }}
                    >

                        <Tab label="Search" value={TabOption.Search}/>
                        <Tab label="Recent" value={TabOption.Recent}/>
                        <Tab label="Saved" value={TabOption.Saved}/>
                    </Tabs>
                </Box>
            )}
        </div>
    );
}