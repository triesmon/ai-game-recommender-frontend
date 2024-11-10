'use client'

import React from 'react';
import Downshift from 'downshift';
import {useSearchContext} from "../../page";
import axios from "axios";
import styles from './SearchBox.module.css';
import {Game} from "../shared/Game";
import {Input} from "@mui/material";
import {base_url} from "@/app/components/constants";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox() {
    const [items, setItems] = React.useState<Game[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const {findSimilar, similarGame, setIsSearching} = useSearchContext();

    React.useEffect(() => {
        // Your side effect logic here
        let urlEncodedSearchValue = encodeURIComponent(inputValue);

        if (urlEncodedSearchValue && urlEncodedSearchValue.length > 0) {
            axios.get(`${base_url}/search?q=${urlEncodedSearchValue}`)
                .then(response => {
                    console.log(response.data)
                    setItems(response.data);  // Assuming response.data is an array of items.
                }).catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }, [inputValue]); // Effect runs when either of these values change

    // Update the input to reflect value of current search (e.g. on initial load)
    React.useEffect(() => {
        if (similarGame) {
            setInputValue(similarGame.name);
        }
    }, [similarGame]);
    return (
        <Downshift
            onChange={selection => findSimilar(selection, true)}
            itemToString={item => (item ? item.name : '')}
            inputValue={inputValue}
            onInputValueChange={value => setInputValue(value)}
            onStateChange={({isOpen}) => isOpen !== undefined && setIsSearching(isOpen)}
        >
            {
                ({
                     getInputProps,
                     getItemProps,
                     getLabelProps,
                     getMenuProps,
                     isOpen,
                     highlightedIndex,
                     selectedItem,
                     getRootProps,
                 }) => {
                    return (
                        <div className={styles.searchBox}>
                            <label {...getLabelProps()}></label>
                            <div className={styles.outerInputContainer} {...getRootProps({}, {suppressRefError: true})}>
                                <div className={styles.inputContainer}>
                                    <SearchIcon className={styles.searchIcon} fontSize={"small"}/>
                                    <Input
                                        className={styles.searchInput}
                                        placeholder={"Search for a game"}
                                        {...getInputProps()}
                                    />
                                </div>

                            </div>
                            <ul {...getMenuProps()}>
                                {isOpen && items.map((item, index) => (
                                    <li
                                        key={item.id}
                                        {...getItemProps({
                                            index,
                                            item,
                                            style: {
                                                backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                                            },
                                        })}
                                    >
                                        <img src={item['header_image']} width={"75"}/>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            }
        </Downshift>
    );
}
