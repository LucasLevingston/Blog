import React, { useEffect } from 'react';
import Header from '../components/Header.tsx';
import Container from '../components/Container.tsx';
import { useUser } from '../hooks/use-user.ts';
import { usePosts } from '../hooks/use-posts.ts';

export default function Home() {
  const { posts, loading, error, fetchPosts, deletePost } = usePosts();
  const user = useUser((state) => state.user);
  const { clearUser } = useUser();
  // Efeito para buscar posts ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Efeito para logar o usuário
  useEffect(() => {
    console.log('User: ', user);
    // clearUser();
  }, [user]);

  function Loading() {
    return <div>Loading...</div>;
  }
  if (error) console.log(error);

  return (
    <div>
      <Header />
      {loading && Loading()}
      {user ? (
        <Container>
          <div>
            <h1>Posts</h1>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </li>
              ))}
            </ul>
            {/* Adicione um formulário para criar novos posts aqui */}
          </div>
        </Container>
      ) : (
        <Container>Faça o login</Container>
      )}
    </div>
  );
}
