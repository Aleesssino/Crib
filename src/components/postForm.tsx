import { useSession } from "next-auth/react"

export function PostForm () {
    const session = useSession();

    if (session.status !== "authenticated") return (
        <div>
            <h1>hi.. You must log in</h1>
        </div>
    );

    
    return <Form/>    
}


function Form () {
    return (
        <form className="flex border-b px-4 py-2">
            <textarea placeholder="What's on your mind?" className="bg-transparent flex w-full rounded-xl p-4 text-xl grow border-b-2 overflow-hidden"/>
            <button className="ml-1 px-4 py-2 h-24 w-10 border-l border-b border-orange-500 self-end  rounded-r-full bg-slate-50 text-slate-950 text-xl">➔</button>

               
        </form>
    )
}