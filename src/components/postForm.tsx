import { useSession } from "next-auth/react"
import { FormEvent, useState } from "react";
import { api } from "~/utils/api";
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
    const session = useSession();
    const [inputValue, setInputValue] = useState("");
    const trpcUtils = api.useContext();

    

    const createPost = api.posts.create.useMutation({
        onSuccess: (newPost) => {
          // console.log(newPost);
          setInputValue("");

          if (session.status !== "authenticated") {
            return
          }

          trpcUtils.posts.infiniteFeed.setInfiniteData({}, (oldData) => {
            if (oldData == null || oldData.pages[0] == null) return
          
            const cachePost = {
              ...newPost,
              likeCount: 0,
              likedByMe: false,
              user: {
                id: session.data.user.id,
                name: session.data.user.name,
                image: session.data.user.image
              }

            }

            return {
              ...oldData,
              page: [
                {
                  ...oldData.pages[0],
                  posts: [cachePost, ...oldData.pages[0].posts]
                }, 
                ...oldData.pages.slice(1)
              ]
            }
          })
        },
      });
    
      function handleSubmit(e: FormEvent) {
        e.preventDefault();
        createPost.mutate({ content: inputValue });
      }

// TODO: fix the form so text will not appear behind button 
    return (
        <form onSubmit={handleSubmit} className="flex border-b px-4 py-2">
            <div className="relative flex w-full">
            <textarea value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} placeholder="What's on your mind?" className="bg-transparent flex w-full rounded-xl p-4 text-xl grow border-b-2 overflow-hidden"/>
        
            <button className="ml-8 h-10 w-10 absolute right-0 top-1/2 transform -translate-y-1/2 border-l border-b border-orange-500 self-end  rounded-full bg-slate-50 text-slate-950 text-xl">➤</button>
            
            </div>
               
        </form>
    )
}