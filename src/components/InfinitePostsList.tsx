import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";

import { VscHeart, VscHeartFilled } from "react-icons/vsc" 
import { api } from "~/utils/api";
//import { Like } from "@prisma/client";
//import { boolean } from "zod";


type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean | undefined;
  user: { id: string; image: string | null; name: string | null };
};

type InfinitePostsProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
};

export function InfinitePostsList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: InfinitePostsProps) {
  if (isLoading) return <h1>loading...</h1>;
  if (isError) return <h1>Oi Error</h1>;
  if (posts == null || posts.length === 0) {
    return <h1 className="my-4 text-center text-gray-400">Oi.. No posts</h1>;
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        hasMore={hasMore!}
        loader={"loading... oi"}
      >
        {posts.map((post) => {
          return <PostCard key={post.id} {...post} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

const formatDate = new Intl.DateTimeFormat(undefined, { dateStyle: "short"});

function PostCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Post) {

  const trpcUtils = api.useContext();
  const toggleLike = api.posts.toggleLike.useMutation({
    onSuccess:  ({ addedLike }) => {

      const updatedData: Parameters<typeof trpcUtils.posts.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) return

        const countModif = addedLike ? 1 : -1

        return {
          ...oldData,
          pages: oldData.pages.map(page => {
            return {
              ...page,
              posts: page.posts.map(post => {
                 if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + countModif,
                    likedByMe: addedLike
                  }
                 }
                 return post;
              })
            }
          })
        }
      }

       trpcUtils.posts.infiniteFeed.setInfiniteData({}, updatedData);
    }
  });



  function handleToggleLike() {
    toggleLike.mutate({ id })
  }

  return (
    <li className="flex gap-4 border px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex gap-1">
        <Link href={`/profiles/${user.id}`}
            className="font-bold outline-none"
        >
            {user.name}
        </Link>
        <span className="text-grey-600 text-sm">{formatDate.format(createdAt)}</span>

      </div>
      <p className="whitespace-pre-wrap">{content}</p>
      <Like onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount}/>
    </li>
  );
}

type HeartProps = {
    likedByMe: boolean | undefined;
    likeCount: number;
    onClick: () => void;
    isLoading: boolean;
}

function Like({likedByMe, likeCount, isLoading, onClick}: HeartProps) {
    const session = useSession();
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart


    if (session.status !== "authenticated") {
        
    
    return (<div className="mb-1 mt-1 flex items-center gap-2 bg-transparent self-end">
        <HeartIcon/>
        <span>{likeCount}</span>
    </div>);
    }
    return(
        <button 
          disabled={isLoading}
          onClick={onClick}
          className={`group items-center gap-1 self-end fles transition-colors duration-200 ${likedByMe ? "text-emerald-50" : "text-slate-800"} hover:text-slate-50`}>
            
               <HeartIcon className={`transition-colors duration-200 ${likedByMe ? "fill-slate-100" : "fill-none group-hover:fill-slate-100"}`}/>
        
        <span>{likeCount}</span>
        </button>
    
    )
}
