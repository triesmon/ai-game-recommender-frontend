'use client'

import React from 'react';
import Downshift from 'downshift';
import {useSearchContext} from "../../page";
import './SearchBox.css';
import axios from "axios";
import {Game} from "../shared/Game";
import {Input} from "@mui/material";
import {base_url} from "@/app/components/constants";

export default function SearchBox() {
    const [items, setItems] = React.useState<Game[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const {findSimilar, setIsSearching} = useSearchContext();

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

    return (
        <Downshift
            onChange={selection => findSimilar(selection, true)}
            itemToString={item => (item ? item.name : '')}
            inputValue={inputValue}
            onInputValueChange={value => setInputValue(value)}
            onStateChange={({ isOpen }) => setIsSearching(isOpen)}
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
                        <div>
                            <label {...getLabelProps()}></label>
                            <div
                                {...getRootProps({}, {suppressRefError: true})}
                            >
                                <Input
                                    className={"search-input"}
                                    placeholder={"Search for a game"}
                                    {...getInputProps()} />
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
