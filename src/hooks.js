const { useState, useEffect, useRef } = require("react");

export const usePaginationData = () => {
  const [isLoading, setIsloding] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [data, setData] = useState([]);

  const getData = async ({ limit, search, pageNo }) => {
    setIsloding(true);
    console.log(pageNo);

    const res = await fetch(
      `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${pageNo}${
        search ? `&filter[text]=${search}` : ""
      }`
    );
    const apiData = await res.json();
    console.log(apiData.data);
    setData([...data, ...apiData.data]);
    setIsloding(false);
    if (apiData.links.next) {
      setHasNext(true);
    } else {
      setHasNext(false);
    }
  };
  const reset = () => {
    setData([]);
  };
  return { isLoading, data, hasNext, getData, reset };
};
