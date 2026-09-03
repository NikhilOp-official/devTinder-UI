import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/store/slices/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store?.requests);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        },
      );

      fetchRequests();
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests?.length === 0) {
    return <h1 className="text-2xl font-bold">No Connection Requests found</h1>;
  }
  return (
    <div className="flex flex-col items-center my-10">
      <h1 className="text-2xl font-bold">Connection Requests</h1>

      <div className="w-full max-w-2xl">
        {requests?.map((r) => {
          const { firstName, lastName, gender, age, about, photoUrl } =
            r.fromUserId;
          return (
            <div
              className="flex m-4 p-4 rounded-lg justify-between items-center bg-base-300"
              key={r.id}
            >
              <div>
                <img
                  src={photoUrl}
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                />
              </div>

              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>

                {age && gender && (
                  <p>
                    {age}, {gender}
                  </p>
                )}

                <p>{about}</p>
              </div>
              <div className="flex gap-5">
                <button
                  className="btn btn-primary"
                  onClick={() => reviewRequest("rejected", r._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => reviewRequest("accepted", r._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
