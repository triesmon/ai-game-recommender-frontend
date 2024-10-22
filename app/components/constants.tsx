import React from "react";
import {SearchContextType} from "@/app/search/searchContextType";

export const base_url = "https://data.jamiesalts.com"
export const SearchContext = React.createContext<SearchContextType | undefined>(undefined);