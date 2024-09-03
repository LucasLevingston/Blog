import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from './ui/button.tsx';
import { FaGear } from 'react-icons/fa6';
import { useUser } from '@/hooks/use-user.ts';

export default function Header() {
  const user = useUser((state) => state.user);
  const { clearUser } = useUser();
  return (
    <div className="min-w-[50%] flex justify-between items-center h-32 border-b-2 border-gray bg-blue-500 p-5 text-left text-mainTextColor">
      <p className="font-saira-stencil text-5xl">
        Soft<span className="text-white">Blog</span>
      </p>
      {user && (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-white hover:bg-gray text-black flex items-center">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link to={`/${user?.user.id}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Ver meu perfil</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center">
                    <FaGear className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <button
                  onClick={() => {
                    clearUser();
                    window.location.href = '/login';
                  }}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair da conta</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
