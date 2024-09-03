import React, { useEffect, useState } from 'react';
import Header from '../components/Header.tsx';
import Container from '../components/Container.tsx';
import { useUser } from '../hooks/use-user.ts';

export default function Login() {
  const [active, setActive] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const user = useUser((state) => state.user);
  const { login, register } = useUser();
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await login({ email: formData.email, password: formData.password });
    if (!result) {
      console.error('Login failed');
      throw new Error('Error');
    }
    // window.location.href = '/';
  };

  const onRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await register({
      email: formData.email,
      password: formData.password,
      username: formData.username,
    });
    if (!result) {
      console.error('Register failed');
      throw new Error('Error');
    }
    // window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {!user && (
        <Container>
          <div className="flex items-center justify-center flex-col">
            <div className="bg-white rounded-lg shadow-lg border-[2px] border-gray overflow-hidden relative w-[768px] max-w-full min-h-[480px]">
              {/* Formulário de Cadastro */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-full p-10 transition-transform duration-600 ${active === 'cadastrar' ? 'opacity-100 z-10' : 'opacity-0 z-1'}`}
              >
                {active === 'cadastrar' && (
                  <form
                    className="bg-white flex items-center justify-center flex-col px-10 h-full"
                    onSubmit={onRegisterSubmit}
                  >
                    <h1 className="text-4xl font-bold">Criar conta</h1>
                    <span className="text-sm">ou use seu email e senha</span>
                    <input
                      className="bg-gray border-none my-2 py-2 px-3 text-sm rounded-lg w-full outline-none"
                      type="text"
                      name="username"
                      placeholder="Nome de usuário"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <input
                      className="bg-gray border-none my-2 py-2 px-3 text-sm rounded-lg w-full outline-none"
                      type="email"
                      name="email"
                      placeholder="Email de cadastro"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      className="bg-gray border-none my-2 py-2 px-3 text-sm rounded-lg w-full outline-none"
                      type="password"
                      name="password"
                      placeholder="Senha de cadastro"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      data-testid="cadastro-submit"
                      type="submit"
                      className="bg-transparent border border-gray text-black text-sm font-semibold px-4 py-2 rounded-lg mt-4"
                      aria-label="Submit Cadastro"
                    >
                      Cadastrar
                    </button>
                  </form>
                )}
              </div>

              {/* Formulário de Login */}
              <div
                className={`absolute top-0 left-0 w-1/2 h-full p-10 transition-all duration-600 ${active === 'login' ? 'opacity-100 z-10' : 'opacity-0 z-1'}`}
              >
                {active === 'login' && (
                  <form
                    className="bg-white flex items-center justify-center flex-col px-10 h-full"
                    onSubmit={onLoginSubmit}
                  >
                    <h1 className="text-4xl font-bold">Login</h1>
                    <span className="text-sm">ou use email e senha</span>
                    <input
                      className="bg-gray border-none my-2 py-2 px-3 text-sm rounded-lg w-full outline-none"
                      type="email"
                      name="email"
                      placeholder="Email de login"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      className="bg-gray border-none my-2 py-2 px-3 text-sm rounded-lg w-full outline-none"
                      type="password"
                      name="password"
                      placeholder="Senha de login"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <a href="#" className="text-sm text-blue-400">
                      Esqueceu sua senha?
                    </a>
                    <button
                      type="submit"
                      className="bg-transparent border border-gray text-black text-sm font-semibold px-4 py-2 rounded-lg mt-4"
                      aria-label="Submit Login"
                    >
                      Login
                    </button>
                  </form>
                )}
              </div>

              {/* Transição entre Login e Cadastro */}
              <div
                className={`absolute top-0 ${active === 'cadastrar' ? 'left-0 rounded-r-[30%]' : 'rounded-l-[30%] left-1/2'} w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-50`}
              >
                <div
                  className={`bg-gradient-to-r left-0 
                  ${active === 'cadastrar' ? 'from-blue-700 to-blue-400' : 'from-blue-400 to-blue-700'}
                      text-white relative right-0 w-full h-full transform transition-all duration-600 ease-in-out`}
                >
                  <div
                    className={`${active === 'cadastrar' ? 'hidden' : ''} flex items-center justify-center flex-col h-full w-full`}
                  >
                    <h1 className="text-3xl font-bold mb-4">Bem vindo de volta!</h1>
                    <p className="text-sm leading-5 tracking-tight my-5">
                      Faça o login para continuar
                    </p>
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <p className="text-sm leading-5 tracking-tight my-5">
                        Não tem cadastro?
                      </p>
                      <button
                        data-testid="cadastro-toggle"
                        className="border rounded-xl p-2 px-6"
                        onClick={() => setActive('cadastrar')}
                        aria-label="Cadastrar"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${active === 'login' ? 'hidden' : ''} flex items-center justify-center flex-col h-full w-full`}
                  >
                    <h1 className="text-3xl font-bold mb-4">Seja bem-vindo!</h1>
                    <p className="text-sm leading-5 tracking-tight my-5">
                      Faça o registro para continuar
                    </p>
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <p className="text-sm leading-5 tracking-tight my-5">
                        Já tem cadastro?
                      </p>
                      <button
                        className="border rounded-xl p-2 px-6"
                        onClick={() => setActive('login')}
                        aria-label="Fazer Login"
                      >
                        Fazer Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
