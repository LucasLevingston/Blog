import React, { useEffect } from 'react';
import Header from '../components/Header.tsx';
import Container from '../components/Container.tsx';
import { useUser } from '../hooks/use-user.ts';
import { usePosts } from '../hooks/use-posts.ts';
import CreatePost from '@/components/CreatePost.tsx';
import { PostCard } from '@/components/PostCard.tsx';
import { Post } from '@/types/Post.ts';
import Footer from '@/components/Footer.tsx';

export default function Home() {
  const { posts, loading, error, fetchPosts, deletePost } = usePosts();
  const user = useUser((state) => state.user);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function Loading() {
    return <div>Loading...</div>;
  }
  if (error) console.log(error);
  const post: Post = {
    author: { username: 'culao', email: 'lucaolevingston@outlook.com', id: '1' },
    authorId: '1',
    content: 'Test Content',
    createdAt: new Date(),
    id: 1,
    title: 'Title test content',
  };
  return (
    <div>
      <Header />
      {loading && Loading()}
      {user ? (
        <Container>
          <CreatePost />
          <div>
            <h1>Posts</h1>
            {/* {posts.map((post) => ( */}
            <PostCard post={post} />
            {/* ))} */}
          </div>
        </Container>
      ) : (
        <Container>Faça o login</Container>
      )}
      <Footer />
    </div>
  );
}
