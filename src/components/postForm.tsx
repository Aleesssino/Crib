export function PostForm () {
    return (
        <form className="flex flex-col gap-2 border-b px-4 py-2">
            <textarea placeholder="What's on your mind?" className="bg-transparent flex w-full rounded-xl p-4 text-xl grow border-b-2 overflow-hidden"/>
            <button className="border-l border-b border-orange-500 self-end">Post It lol</button>

               
        </form>
    )
}