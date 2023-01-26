import "./styles.css";
import style from "./styles.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePaginationData } from "./hooks";

export default function App() {
  const [params, setParams] = useState({ limit: 10, pageNo: 1, search: "" });
  const { isLoading, data, getData, reset } = usePaginationData();
  const refs = useRef();

  const observerRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (refs.current) refs.current.disconnect();
      refs.current = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) {
          setParams((page) => ({ ...page, pageNo: page.pageNo + 1 }));
        }
      });
      if (node) refs.current.observe(node);
    },
    [isLoading]
  );

  useEffect(() => {
    getData(params);
  }, [params.limit, params.pageNo]);

  useEffect(() => {
    const time = setTimeout(() => {
      getData(params);
    }, 500);
    return () => clearTimeout(time);
  }, [params.search]);

  return (
    <div className={style.container}>
      <div className={style.infoSection}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start Typing to see some magic happen!</h2>
        <input
          onChange={(e) => {
            reset();
            setParams({ ...params, pageNo: 1, search: e.target.value });
          }}
        />
        <h3>
          Last page no : {params.pageNo} , Total posts : {data.length}
        </h3>
      </div>
      <div className={style.listItemContainer}>
        {isLoading && !data.length ? <div>Getting data</div> : null}

        {data.map((item, idx) =>
          idx + 1 == data.length ? (
            <div className={style.listItem} key={idx} ref={observerRef}>
              {item.attributes.canonicalTitle}
            </div>
          ) : (
            <div className={style.listItem} key={idx}>
              {item.attributes.canonicalTitle}
            </div>
          )
        )}
        {Boolean(isLoading && data.length) && (
          <div className={style.loaderContaier}>
            <div className={style.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
}
