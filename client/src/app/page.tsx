"use client";
import Image from "next/image";
import icker from "../app/assets/icker.png";
import { useRouter } from "next/navigation";
import { api } from "./services/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RootState } from "@/state/redux";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "@/state";

type SessionResp = {
  sessionLink: string;
};

const Home = () => {
  const [name, setName] = useLocalStorage<string>("name", "");
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.session);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name) {
      setError("name is required");
      return;
    }

    try {
      const response = await api.post<SessionResp>("/session", { name });
      dispatch(setError(""));
      router.push(response.data.sessionLink);

    } catch (err) {

      const error = err as { 
        message: string
      } | undefined

      const userError = error?.message || 'Error when fetching'

      dispatch(setError(userError));
    }
  };

  return (
    <div className="p-6 min-h-screen rounded-xl bg-magnolia dark:bg-blue-950">
      <section className="mt-40 flex flex-col items-center">
        <Image src={icker} alt="logo" width={200} />
        <form className="w-[400px]" onSubmit={handleLogin}>
          <input
            type="text"
            required
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[300px] sm:w-full ml-[52px] sm:ml-0 pl-2 text-gray-700  rounded-md border-solid border-2 border-blue-500 py-1.5 mb-4 relative -left-[1px]"
          />
          <button
            className="rounded-md w-[300px] sm:w-full ml-[52px] sm:ml-0 bg-marine text-white mb-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-inset ring-sky-600 hover:bg-greenblue disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Create Room
          </button>
          {error && <p className="text-red-500 mb-2">{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default Home;
