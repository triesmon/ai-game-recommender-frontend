'use client'

import React, {useEffect, useRef, useState} from 'react';
import './Result.css';
import {ExternalScrollSavingLink} from "../shared/ExternalScrollSavingLink";
import {Game} from "../shared/Game";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import PlayCircle from '@mui/icons-material/PlayCircle';
import {Button} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {SortBy} from "@/app/components/search/Filter";

type ResultProps = {
    result: Game;
    onFindSimilar: (game: Game) => void;
    sortBy: SortBy;
};

const Result: React.FC<ResultProps> = ({result, onFindSimilar, sortBy}) => {
    const [forceUpdate, setForceUpdate] = useState(0);
    const myRef = useRef<null | HTMLDivElement>(null);
    const [trailerPlaying, setTrailerPlaying] = useState(false);

    useEffect(() => {
        const scrollTo = localStorage.getItem('scrollTo');

        // convert to number
        setTimeout(() => {
            if (scrollTo) {
                const savedId = parseInt(scrollTo);
                if (savedId && savedId == result.id) {
                    console.log('scrolling to' + myRef);
                    myRef.current?.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
                    localStorage.removeItem('scrollTo');
                }
            }
        }, 200)
    });

    function formatReleaseDate(result: Game) {
        const currentYear = new Date().getFullYear() + '';

        if (result['release_date'].split(' ')[2] == currentYear) {
            return result['release_date']
        } else {
            return result['release_date'].split(' ')[2]
        }
    }

    return (
        <div ref={myRef} id={'result-' + result.id} className='result-container'>
            <Grid container spacing={2}>
                <Grid container direction={"column"} size={{ xs: 12, sm: 6}}>
                    <Grid>
                        <h3 className='result-name'>{result['name']}</h3>
                        <p className='result-description'>{result['short_description']}</p>
                    </Grid>
                    <Grid spacing={1} justifyContent={'space-between'} className={'metadata'}>
                        <Grid>
                            <span>Steam Rating: {formatAsPercent(result.rating)}</span>
                        </Grid>
                        {result.metacritic_score > 0 && (
                            <Grid>
                                <span>Metacritic Rating: {result.metacritic_score}%</span>
                            </Grid>
                        )}
                        <Grid>
                            <span>Released: {formatReleaseDate(result)}</span>
                        </Grid>
                        <Grid>
                            {sortBy == SortBy.Similarity && result['vector_distance'] && (
                                <span>Similarity: {getSimilarity(result['vector_distance'])}%</span>
                            )}
                            {sortBy == SortBy.Uniqueness && result['average_distance'] && (
                                <span>Uniqueness: {getUniqueness(result['average_distance'])}%</span>
                            )}
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6}} className={'button-bar'}>
                        <div className={'metadata'}>
                            {isResultIdSaved(result['id']) &&
                                <Button variant={'outlined'}>
                                    <BookmarkOutlinedIcon onClick={() => unsaveResultFromStorage(result)}/>
                                    Remove
                                </Button>
                            }

                            {!isResultIdSaved(result['id']) &&
                                <Button variant={'outlined'}>
                                    <BookmarkAddOutlinedIcon onClick={() => saveResultToStorage(result)}/>
                                    Save
                                </Button>
                            }

                            <ExternalScrollSavingLink
                                scrollTo={result['id']}
                                href={`https://store.steampowered.com/app/${result['id']}`}
                            >
                                Steam
                            </ExternalScrollSavingLink>

                            <Button variant={'outlined'} onClick={() => onFindSimilar(result)}>Find Similar</Button>
                        </div>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                    <div className={"trailer-container"}>
                        {!trailerPlaying && <img src={result['header_image']}
                                                 onClick={() => result.movies.length > 0 && setTrailerPlaying(true)}
                                                 alt={result['name']} className='result-image'></img>}
                        {result.movies.length > 0 && trailerPlaying &&
                            <video autoPlay={true} poster={result.header_image} controls={true} src={result.movies[0]}
                                   className='result-image'></video>}
                        {result.movies.length > 0 && <div className={"icon-container"}>
                            {!trailerPlaying &&
                                <PlayCircle onClick={() => setTrailerPlaying(true)} fontSize={"large"} color={"action"}
                                            className={"play-icon"}/>}
                        </div>}
                    </div>
                </Grid>
            </Grid>
        </div>
    );


    function saveResultToStorage(result: Game) {
        // Get saved games from local storage
        const savedGamesString = localStorage.getItem('savedGames');
        let savedGamesArray: number[] = savedGamesString ? JSON.parse(savedGamesString) : [];

        // Check if the game is not already in the saved games
        if (!savedGamesArray.includes(result.id)) {
            savedGamesArray.push(result.id);
            localStorage.setItem('savedGames', JSON.stringify(savedGamesArray));
        }

        setForceUpdate(forceUpdate + 1);
    }

    function unsaveResultFromStorage(result: Game) {
        // Get saved games from local storage
        const savedGamesString = localStorage.getItem('savedGames');
        let savedGamesArray: number[] = savedGamesString ? JSON.parse(savedGamesString) : [];

        // Check if the game is not already in the saved games
        if (savedGamesArray.includes(result.id)) {
            savedGamesArray = savedGamesArray.filter(id => id !== result.id);
            localStorage.setItem('savedGames', JSON.stringify(savedGamesArray));
        }

        setForceUpdate(forceUpdate + 1);
    }


    function formatAsPercent(value: number): string {
        return `${Math.round(value * 100)}%`;
    }
}

export function isResultIdSaved(gameId: number): boolean {
    // Get saved games from local storage
    const savedGamesString = localStorage.getItem('savedGames');
    let savedGamesArray: number[] = savedGamesString ? JSON.parse(savedGamesString) : [];

    return savedGamesArray.includes(gameId);
}

export function getSimilarity(value: number): number {
    // Convert to similarity percentage on a scale of 0-0.3
    return Math.round((1 - (Math.min(value, 0.3) / 0.3)) * 100);
}

export function getUniqueness(value: number): number {
    // Convert to similarity percentage on a scale of 0-0.3
    return Math.round((Math.min(value, 0.3) / 0.3) * 100);
}

export default React.memo(Result);
