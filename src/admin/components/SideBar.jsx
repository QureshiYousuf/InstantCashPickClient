import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { SiShopware } from "react-icons/si";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { MdCategory, MdOutlineNumbers, MdSlideshow } from "react-icons/md";
import {
  RiListCheck2,
  RiListCheck3,
  RiListIndefinite,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import {
  TbBrandAirtable,
  TbBrandPushover,
  TbPasswordMobilePhone,
} from "react-icons/tb";
import { TiPuzzle, TiPointOfInterest, TiPlusOutline } from "react-icons/ti";
import { SiAstro, SiDatabricks, SiSlides } from "react-icons/si";
import { FaCentSign, FaPersonCircleQuestion } from "react-icons/fa6";
import { BsBorderStyle } from "react-icons/bs";
import { GiStockpiles, GiCash } from "react-icons/gi";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";

const SideBar = (props) => {
  //   const { isSidebarOpen, setIsSidebarOpen, drawerWidth } = props;

  const { user, isSidebarOpen } = props;

  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const handleActive = () => {
    setActive(!active);
  };

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
  };
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  const links = [
    {
      title: "Dashboard",
      links: [
        {
          name: "dashboard",
          icon: <BiSolidDashboard />,
        },
      ],
    },

    {
      title: "Category",
      links: [
        {
          name: "add-category",
          icon: <MdCategory />,
        },
        {
          name: "categories-list",
          icon: <RiListCheck3 />,
        },
      ],
    },

    {
      title: "Brands",
      links: [
        {
          name: "add-brands",
          icon: <TbBrandAirtable />,
        },
        {
          name: "brands-list",
          icon: <RiListIndefinite />,
        },
      ],
    },
    {
      title: "Products",
      links: [
        {
          name: "add-products",
          // icon: <TbBrandPushover />,
          icon: <SiAstro />,
        },
        {
          name: "products-list",
          icon: <RiListCheck2 />,
        },
      ],
    },
    {
      title: "Series",
      links: [
        {
          name: "add-series",
          icon: <SiDatabricks />,
        },
      ],
    },
    {
      title: "Questions",
      links: [
        {
          name: "create-questions",
          icon: <RiQuestionAnswerFill />,
        },
      ],
    },
    {
      title: "Orders",
      links: [
        {
          name: "orders",
          icon: <BsBorderStyle />,
        },
        {
          name: "phone-numbers",
          icon: <MdOutlineNumbers />,
          // icon: <TbPasswordMobilePhone />,
        },
      ],
    },
    {
      title: "Manage Stocks",
      links: [
        {
          name: "manage-stocks",
          icon: <GiStockpiles />,
        },
      ],
    },

    {
      title: "Sliders & Coupons",
      links: [
        {
          name: "add-sliders",
          icon: <SiSlides />,
          // icon: <MdSlideshow />,
        },
        {
          name: "add-coupons",
          icon: <FaCentSign />,
          // icon: <MdSlideshow />,
        },
      ],
    },
    {
      title: "Services",
      links: [
        {
          name: "add-services",
          // icon: <CgProfile />,
          icon: <ImProfile />,
        },
        {
          name: "services-list",
          // icon: <CgProfile />,
          icon: <ImProfile />,
        },
        {
          name: "services-Orders",
          // icon: <CgProfile />,
          icon: <ImProfile />,
        },
      ],
    },
    {
      title: "Recycle Order",
      links: [
        {
          name: "recycle-orders",
          icon: <ImProfile />,
        },
      ],
    },
    {
      title: "Settings",
      links: [
        {
          name: "update-profile",
          // icon: <CgProfile />,
          icon: <ImProfile />,
        },
      ],
    },
  ];

  const activeLink =
    "flex items-center gap-3 pl-4 pt-2 pb-2 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-3 pl-4 pt- pb-1 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-cyan-500 hover:bg-light-gray m-2";

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  return (
    <div
      // ${isSidebarOpen ? "" : "hidden"}
      className={`
       md-[15%] lg:w-[12%] h-full bg-gray-900 text-white fixed overflow-y-auto scrollbar`}
    >
      <div className="flex justify-between items-center">
        <Link
          to="/admin"
          onClick={handleCloseSideBar}
          className="items-center gap-2 ml-3 mt-4 flex text-l font-extrabold tracking-tight dark:text-white text-slate-900"
        >
          {/* <SiShopware />  */}
          <GiCash />
          <span>InstantCashPick</span>
        </Link>
        {/* <button
          type="button"
          onClick={() => setActiveMenu(!activeMenu)}
          style={{ color: currentColor }}
          className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
        >
          <MdOutlineCancel />
        </button> */}
      </div>

      <div className="mt-5">
        {links.map((item) => (
          <div key={item.title}>
            <p className="text-gray-400 text-sm dark:text-gray-400 mx-2 mt-2 uppercase">
              {item.title}
            </p>
            {item.links.map((link) => (
              <NavLink
                to={`/admin/${link.name}`}
                // to={`/${link.name}`}
                key={link.name}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                {link.icon}
                <span className="capitalize">{link.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* <ul className="flex flex-col my-28 items-center">
        {sideBarLinks.map(({ text, url }, i) => {
          return (
            <li className={`my-4 `} key={i}>
              <button className="text-xl">
                <Link to={`/admin/${url}`}>{text}</Link>
              </button>
            </li>
          );
        })}
      </ul> */}
    </div>
  );
};

export default SideBar;
