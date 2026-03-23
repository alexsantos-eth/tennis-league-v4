import { Award, Home, PlusIcon, Trophy, User } from "lucide-react";

import NavItem from "./nav-item";

const Navigation: React.FC = () => {
  return (
    <nav
      data-id="nav"
      style={{ boxShadow: "0px -2px 5px -1px rgba(0,0,0,0.05)" }}
      className="bg-white z-10 fixed bottom-0 left-0 w-full"
    >
      <div data-id="nav-container" className="px-6 pt-4 pb-4 bg-white">
        <div
          data-id="nav-content"
          className="flex justify-between bg-white h-full"
        >
          <NavItem
            href="/"
            label="Inicio"
            className="animate-jump-in animate-ease-linear"
            
            icon={
              <Home
                className={`h-6 w-6`}
              />
            }
          />

          <NavItem
            className="animate-jump-in animate-delay-200 animate-ease-linear"
            href="/torneos"
            label="Torneos"
            icon={
              <Trophy
                className={`h-6 w-6`}
              />
            }
          />

          <NavItem
            justIcon
            className="bg-primary max-w-15 min-w-0 w-15 max-h-15 h-15 animate-jump-in animate-delay-200 animate-ease-linear rounded-full relative -top-12"
            href="/match/new"
            label="Nuevo Partido"
            icon={
              <PlusIcon
                className={`h-6 w-6 text-white`}
              />
            }
          />

          <NavItem
            href="/ranking"
            label="Ranking"
            className="animate-jump-in animate-delay-300 animate-ease-linear"
  
            icon={
              <Award
                className={`h-6 w-6`}
              />
            }
          />

          <NavItem
            href="/perfil"
            label="Perfil"
            className="animate-jump-in animate-delay-400 animate-ease-linear"
         
            icon={
              <User
                className={`h-6 w-6`}
              />
            }
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
