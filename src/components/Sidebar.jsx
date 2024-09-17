import PropTypes from 'prop-types';
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useContext, createContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-white border-r shadow-lg">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/public/assets/cryptoview.png"
            className={`overflow-hidden transition-all bg-black rounded-3xl ${
              expanded ? "w-24" : "w-0"
            }`}
            alt="logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          {/* <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          /> */}
          <div
            className={`
              flex justify-center items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4"></div>
            {/* <MoreVertical size={20} /> */}
          </div>
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext);
  // useLocation est un hook de react-router-dom qui fournit l'objet location actuel.
  // Cet objet contient des informations sur l'URL courante. `location.pathname` est une propriété
  // de cet objet qui contient le chemin de l'URL actuelle. Nous utilisons `location.pathname`
  // pour déterminer si le chemin actuel correspond à la prop `to` du composant SidebarItem,
  // permettant ainsi de savoir si l'élément doit être marqué comme actif.
  const location = useLocation();
  const active = location.pathname === to;
  const alert = location.pathname === to;

  return (
    <Link to={to}>
      <li
        className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
