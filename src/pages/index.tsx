//import { signIn, signOut, useSession } from "next-auth/react";
//import Head from "next/head";
//import Link from "next/link";
import { PostForm } from "~/components/postForm";
import { api } from "~/utils/api";

export default function Home() {
 
  const post = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
    <header className="sticky top-0 z-10 pt-2">
      <h1 className="text-lg font-semibold mb-2 px-3">Crib</h1>
    </header>
      <PostForm/>
    </>
  );
}


