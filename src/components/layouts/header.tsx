import { ArrowLeftOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";
import { logout } from "@/lib/actions";

interface IHeaderProps {
  setToggleOpen: (toggleOpen: boolean) => void;
  toggleOpen?: boolean;
}

export default function Header({ setToggleOpen, toggleOpen }: IHeaderProps) {
  const toggleSidebar = () => {
    setToggleOpen(!toggleOpen);
  };
  const [state, dispatch] = useFormState(logout, undefined);

  return (
    <nav className="fixed z-30 w-full border-b bg-gray-800 border-gray-700">
      <div className="px-3 py-3 md:px-5 md:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              id="toggleSidebar"
              aria-expanded="true"
              aria-controls="sidebar"
              className="p-2 hidden sm:block rounded cursor-pointer focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={toggleSidebar}
            >
              <Bars3Icon
                className="w-6 h-6 text-gray-300"
              />
            </button>
            <button
              id="toggleSidebarMobile"
              aria-expanded="true"
              aria-controls="sidebar"
              className="p-2 rounded cursor-pointer md:hidden focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <Bars3Icon className="w-6 h-6 text-gray-300" />
            </button>
            <a href="/admin/" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                Admin Panel
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <div>
                <form action={dispatch}>
                  <button
                    type="submit"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button-2"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-2"
                    onClick={() => {
                      setTimeout(() => window.location.reload(), 1000)
                    }}
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-300" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
