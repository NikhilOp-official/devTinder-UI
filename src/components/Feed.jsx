import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addfeed } from "../utils/store/slices/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    getFeed();
  }, []);

  const getFeed = async () => {
    // if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addfeed(res?.data?.data));
    } catch (error) {
      console.error("Error getting feed", error);
    }
  };

  if (!feed) return;
  if (feed?.length === 0) {
    return <h2 className="flex justify-center my-10">No new users found!</h2>;
  }

  return (
    <div className="flex   overflow-hidden overflow-y-scroll items-center justify-center gap-10 my-10">
      {feed && <UserCard user={feed[0]} />}
    </div>
  );
};

export default Feed;
