'use client';

import React, {useCallback, useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import './SearchSettings.css';
import axios from "axios";

import {base_url} from "@/app/components/constants";

export default function Page() {
    const [graphData, setGraphData] = useState(null);
    const [tagsGraphData, setTagsGraphData] = useState(null);
    const [nameGraphData, setNameGraphData] = useState(null);
    const [shortDescriptionData, setShortDescriptionData] = useState(null);
    const [aboutTheGameData, setAboutTheGameData] = useState(null);
    const [weights, setWeights] = useState<{ [key: string]: number }>({});


    useEffect(() => {
        // rewrite to use axios
        axios.get(`${base_url}/weights`)
            .then(response => {
                setWeights(response.data);
            });

        axios.get(`${base_url}/graph`)
            .then(response => {
                setGraphData(response.data);
            });

        axios.get(`${base_url}/tags_graph`)
            .then(response => {
                setTagsGraphData(response.data);
            });

        axios.get(`${base_url}/name_graph`)
            .then(response => {
                setNameGraphData(response.data);
            });

        axios.get(`${base_url}/short_description_graph`)
            .then(response => {
                setShortDescriptionData(response.data);
            });

        axios.get(`${base_url}/about_the_game_graph`)
            .then(response => {
                setAboutTheGameData(response.data);
            });
    }, []);

    const saveWeights = useCallback(() => {
        axios.post(`${base_url}/set_weights`, weights)
            .then(response => {
            });
    }, [weights]);


    // @ts-ignore
    return (
        <div>
            <div className={"page-container"}>
                <div className={"graph-container"}>
                    {graphData && (
                        <>
                            <h3>Combined Vector Plot (t-SNE)</h3>
                            <p>This shows the results of combining and weighting vectors. It's what similar search is based off of.</p>
                            <Plot
                            // @ts-ignore
                            data={graphData.data}
                            // @ts-ignore
                            layout={{width: 500, height: 500}}/>
                        </>
                    )}

                    {tagsGraphData && (
                        <>
                            <h3>Tags Vector Plot (t-SNE)</h3>
                            <p>How similar each tag is</p>
                            <Plot
                            // @ts-ignore
                            data={tagsGraphData.data}
                            // @ts-ignore
                            layout={{width: 500, height: 500}}/>
                        </>
                    )}

                    {nameGraphData && (
                        <>
                            <h3>Name Vector Plot (t-SNE)</h3>
                            <p>Similarity of game names</p>
                            <Plot
                            // @ts-ignore
                            data={nameGraphData.data}
                            // @ts-ignore
                            layout={{width: 500, height: 500}}/>
                        </>
                    )}
                    {shortDescriptionData && (
                        <>
                            <h3>Short Description Vector Plot (t-SNE)</h3>
                            <p>Similarity of game short descriptions</p>
                            <Plot
                            // @ts-ignore
                            data={shortDescriptionData.data}
                            // @ts-ignore
                            layout={{width: 500, height: 500}}/>
                        </>
                    )}
                    {aboutTheGameData && (
                        <>
                            <h3>About the Game Vector Plot (t-SNE)</h3>
                            <p>Similarity of game short descriptions</p>
                            <Plot
                            // @ts-ignore
                            data={aboutTheGameData.data}
                            // @ts-ignore
                            layout={{width: 500, height: 500}}/>
                        </>
                    )}
                </div>
                <div className={"settings-container"}>
                    <button disabled={true}>Fully Reindex Database</button>
                    <p>How AI Search weights each facet of a game.</p>
                    {weights && Object.keys(weights).map((key) => (
                        <div key={key}>
                            <label>{key}</label>
                            <input id={key}
                                   onChange={e => {
                                       const value = e.currentTarget.value;
                                       setWeights(
                                           (oldWeights) => ({
                                               ...oldWeights,
                                               [key]: Number.parseInt(value),
                                           })
                                       );
                                   }}
                                   type="number"
                                   value={weights[key]}/>
                        </div>
                    ))}

                    <button onClick={() => saveWeights()}>Reindex Weights</button>
                    <button onClick={() => axios.get(`${base_url}/regenerate_graph`)}>Regenerate Graphs</button>

                    <label>Sort AI search results by:</label>
                    <div>
                        <input defaultChecked={true} type="radio" disabled={true} id="sortByDistance" name="distance" value="true"/>
                        <label htmlFor="sortByDistance">Distance</label>
                    </div>
                    <div>
                        <input type="radio" id="sortByRating" name="distance" value="false" disabled={true}/>
                        <label htmlFor="sortByRating">Rating</label>
                        
                    </div>
                        <label>Adult Content</label>
                        <div>
                            <input
                                defaultChecked={true}
                                type="radio"
                                id="adultContent"
                                name="adultContent"
                                value="true"
                            />
                            <label htmlFor="adultContent">Yes</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="adultContent"
                                name="adultContent"
                                value="false"
                            />
                            <label htmlFor="adultContent">No</label>
                        </div>
                </div>
            </div>
        </div>
    );
}
