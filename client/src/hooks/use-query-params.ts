import { useLocation } from "react-router";

function useQueryParams() {
  const search = useLocation().search; // returns the URL query String (e.g. ?q=abc&page=2)
  const urlSearchParams = new URLSearchParams(search); // creates a URLSearchParams object from the query string
  const params = Object.fromEntries(urlSearchParams.entries()); // creates a regular object (e.g. { q: 'abc', page: '2' })

  return params;
}

export default useQueryParams;
