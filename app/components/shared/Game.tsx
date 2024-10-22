export type Game = {
    name: string;
    short_description: string;
    url: string;
    genres: string[];
    rating: number;
    tags: { [key: string]: number };
    id: number
    header_image: string;
    movies: string[];
    vector_distance: number;
    release_date: string;
    categories: string[];
    metacritic_score: number;
};