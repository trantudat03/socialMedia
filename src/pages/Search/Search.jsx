import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormFilter, ListPosts } from "../../components";
import { useLocation } from "react-router-dom";
import { fetchSearchResults, reset } from "../../redux/searchSlice";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery().get("q");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const { results, isSuccess } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const payload = {
      query: query,
      page: page,
      limit: 6,
    };
    dispatch(fetchSearchResults(payload));
  }, [page, query, dispatch]);

  useEffect(() => {
    if (isSuccess && results) {
      if (page === 1) {
        setPosts(results?.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...results?.posts]);
      }
      dispatch(reset());
    }
  }, [results, isSuccess, page, dispatch]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="relative w-full flex bg-[#f0f2f5]">
      {/* Left */}
      <div
        className="w-1/4 max-w-96 pl-2 bg-white sticky top-0  overflow-y-auto"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <h2 className="text-2xl font-bold mb-4 mt-2">Kết quả tìm kiếm</h2>
        <FormFilter />
      </div>
      {/* Center */}
      <div className="flex-1 flex flex-col items-center pt-6 gap-6 overflow-y-auto h-screen">
        <div className="max-w-2xl w-full" style={{ minWidth: "672px" }}>
          {posts.length > 0 && (
            <ListPosts
              hasMore={true}
              loadMorePosts={loadMorePosts}
              postList={posts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
