// function onSearch(searchValue: string, updateHistory: boolean = true) {
//     if (searchValue === "") {
//         return;
//     }
//
//     setFilter((oldFilter) => ({
//         ...oldFilter,
//         show_only_saved: false,
//     }));
//     setResults([])
//     setLoading(true);
//
//     // url encode setSearchValue value
//     if (searchValue) {
//         let urlEncodedSearchValue = encodeURIComponent(searchValue);
//         if (updateHistory) {
//             router.push(`search?title=${urlEncodedSearchValue}`)
//         }
//         urlEncodedSearchValue += '%20'
//         axios.get(`${base_url}/search?type=${searchType}&q=${urlEncodedSearchValue}`)
//             .then((response: any) => {
//                 setLoading(false);
//                 setResults(response.data);
//             });
//     }
// }