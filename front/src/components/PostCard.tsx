import { Post } from '@/types/Post.ts';
import { User } from 'lucide-react';
import React from 'react';

export const PostCard: React.FC<{
  post: Post;
}> = ({ post }) => {
  function timeSince(date: Date): string {
    const now: Date = new Date();
    const seconds: number = Math.floor((now.getTime() - date.getTime()) / 1000);

    const days: number = Math.floor(seconds / (3600 * 24));
    const weeks: number = Math.floor(days / 7);

    if (days < 1) {
      return 'Há menos de um dia';
    } else if (weeks < 1) {
      return `Há ${days} dia${days > 1 ? 's' : ''}`;
    } else {
      return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    }
  }

  return (
    <div className="border p-4 w-[392px] h-[488px] flex flex-col justify-between rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          {post.images[0] && (
            <div className="w-[360px] h-[240px] border rounded-lg">
              <img src={post.images[0]} alt="" />
            </div>
          )}
        </div>
        <div className="flex">
          <p className="rounded-lg font-medium text-[#4B6BFB] text-sm bg-[#4B6BFB]/5 p-2 ">
            Technology
          </p>
        </div>
        <div className="w-full text-2xl font-semibold">{post.title}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <User className="rounded-full border w-9 h-9" />
          <p className="text-[16px] font-medium text-[#97989F]">{post.author.username}</p>
        </div>
        <div className="w-full text-[16px] text-[#97989F] text-right">
          <p>{timeSince(post.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};
