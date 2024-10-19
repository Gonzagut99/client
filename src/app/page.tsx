"use client";

import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Poll = {
  pub_date: string;
  poll_text: string;
  id: string;
  user_id: string;
  options: Array<{
    option_text: string;
    votes: number;
    id: string;
  }>;
};

async function fetchUserPolls(sessionId: string) {
  const response = await fetch("http://localhost:8001/poll/get-user-polls/", {
    credentials: "include",
    headers:{
      "Content-Type": "application/json",
      "Cookie": `fast_vote_session=${sessionId}`
    },
    // @ts-ignore
    next: {
      revalidate: 0,
    },
  });
  const data = await response.json();
  return data as Poll[];
}

async function deletePoll(id:string, sessionId: string) {
  await fetch(`http://localhost:8001/poll/${id}`, {
    credentials: "include",
    headers:{
      "Content-Type": "application/json",
      "Cookie": `fast_vote_session=${sessionId}`
    },
    // @ts-ignore
    next: {
      revalidate: 0,
    },

    method: "DELETE",
  });
  return true;
}

export default function Home() {
  const sessionId = useSession();
  const [data, setData] = useState<Poll[]>([]);

  function fetchPolls(sessionId: string) {
    fetchUserPolls(sessionId)
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (sessionId){
      fetchPolls(sessionId);
    }
  }, [sessionId]);

  function deletePollHandler(id: string, sessionId: string) {
    deletePoll(id, sessionId)
      .then((data) => {
        if (data) {
          fetchPolls(sessionId);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <main className="flex min-h-dvh h-screen flex-col items-center p-4 lg:p-24 gap-8">
      <h1 className="text-4xl font-bold">Fast Vote</h1>
      <div className="w-full flex justify-center items-center">
        <div className="max-w-[200px] p-4 text-pretty">
          {sessionId.length>0 ? `Sesión: ${sessionId}` : "No hay sesión"}
        </div>
        <Link href="/create">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Crear encuesta
          </button>
        </Link>
      </div>
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl font-bold">Tus encuestas</h2>
        <div className="flex flex-col items-center w-[90%]">
          {data.map((poll) => (
            <div
              className="flex items-center my-2 justify-between w-full p-4 shadow-sm rounded-md"
              key={poll.id}
            >
              <h3 className="text-base font-bold">{poll.poll_text}</h3>
              <div className="flex gap-3">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => deletePollHandler(poll.id, sessionId)}
                >
                  Delete
                </button>
                <Link href={`/q/${poll.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Open
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
