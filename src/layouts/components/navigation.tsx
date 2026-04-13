import { Award, Home, PlusIcon, Trophy, User } from "lucide-react";

import { useNewMatchStore } from "../../store/new-match";
import NavItem from "./nav-item";

const Navigation: React.FC = () => {
  const resetNewMatchStore = useNewMatchStore(
    (state) => state.resetNewMatchStore,
  );

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
            icon={<Home className={`h-6 w-6`} />}
          />

          <NavItem
            href="/tournaments"
            label="Torneos"
            icon={<Trophy className={`h-6 w-6`} />}
          />

          <NavItem
            justIcon
            className="bg-primary max-w-15 min-w-0 w-15 max-h-15 h-15 corner-round rounded-full relative -top-12"
            href="/match/new"
            label="Nuevo Partido"
            onClick={resetNewMatchStore}
            icon={<PlusIcon className={`h-6 w-6 text-white`} />}
          />

          <NavItem
            href="/ranking"
            label="Ranking"
            icon={<Award className={`h-6 w-6`} />}
          />

          <NavItem
            href="/profile"
            label="Perfil"
            icon={<User className={`h-6 w-6`} />}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
