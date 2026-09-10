import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/store/slices/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store?.requests);
  const [error, setError] = useState(null);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        },
      );

      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Unable to review request");
    }
  };

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!requests) return;

  if (requests?.length === 0) {
    return <h1 className="px-4 py-10 text-center text-2xl font-bold">No Connection Requests found</h1>;
  }
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 sm:py-10">
      <h1 className="text-center text-2xl font-bold">Connection Requests</h1>
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <div className="w-full">
        {requests?.map((r) => {
          const { firstName, lastName, gender, age, about, photoUrl } =
            r.fromUserId;
          return (
            <div
              className="flex flex-col gap-4 rounded-lg bg-base-300 p-4 sm:flex-row sm:items-center sm:justify-between"
              key={r._id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  alt="photo"
                  className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
                />

              <div className="min-w-0 text-left">
                <h2 className="truncate text-xl font-bold">
                  {firstName + " " + lastName}
                </h2>

                <p>
                  {age ? `${age} years` : "Age not specified"} · {gender || "Gender not specified"}
                </p>

                <p className="break-words">{about}</p>
              </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto sm:gap-5">
                <button
                  className="btn btn-primary flex-1 sm:flex-none"
                  onClick={() => reviewRequest("rejected", r._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary flex-1 sm:flex-none"
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
