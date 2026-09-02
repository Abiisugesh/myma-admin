import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Bell,
  Box,
  ChevronRight,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  // ======================================================
  // CHECK ADMIN LOGIN
  // ======================================================

  const authenticated =
    localStorage.getItem(
      "myma_admin_authenticated"
    );

  if (authenticated !== "true") {
    navigate("/login", {
      replace: true,
    });

    return null;
  }


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "myma_admin_authenticated"
    );

    localStorage.removeItem(
      "myma_admin_user"
    );

    navigate("/login", {
      replace: true,
    });
  };


  // ======================================================
  // SIDEBAR MENU
  // ======================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Products",
      icon: Box,
      path: "/products",
    },
    {
      name: "Categories",
      icon: PackageCheck,
      path: "/categories",
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/orders",
    },
    {
      name: "Customers",
      icon: Users,
      path: "/customers",
    },
  ];


  // ======================================================
  // ACTIVE MENU
  // ======================================================

  const isActive = (path) => {

    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };


  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleNavigation = (path) => {

    navigate(path);

    setSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div
      className="
        min-h-screen
        bg-[#F8F6FF]
      "
    >

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-[#211B38]/40
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-[#E6DFFF]
          bg-white
          shadow-xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ================================================
            LOGO
        ================================================= */}

        <div
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-[#EEE9FF]
            px-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* MYMA LOGO */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-white
                p-1
                shadow-lg
              "
            >

              <img
                src="/myma-logo.png"
                alt="MYMA Supermarket"
                className="
                  h-full
                  w-full
                  object-contain
                "
              />

            </div>


            {/* BRAND */}

            <div>

              <p
                className="
                  text-sm
                  font-black
                  text-[#211B38]
                "
              >
                MYMA
              </p>

              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.2em]
                  text-[#968EAE]
                "
              >
                ADMIN PANEL
              </p>

            </div>

          </div>


          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              rounded-lg
              p-2
              text-[#81799C]
              transition
              hover:bg-[#F5F2FF]
              hover:text-[#5B3FC4]
              lg:hidden
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            px-3
            py-5
          "
        >

          <p
            className="
              mb-3
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]
              text-[#A29AB8]
            "
          >
            Main Menu
          </p>


          {menuItems.map((item) => {

            const Icon = item.icon;

            const active =
              isActive(item.path);


            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  transition-all
                  ${
                    active
                      ? "bg-[#F0ECFF] text-[#5B3FC4]"
                      : "text-[#81799C] hover:bg-[#FAF8FF] hover:text-[#5B3FC4]"
                  }
                `}
              >

                <Icon size={18} />

                <span
                  className="
                    text-xs
                    font-bold
                  "
                >
                  {item.name}
                </span>


                {active && (
                  <span
                    className="
                      ml-auto
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#6B4FD3]
                    "
                  />
                )}

              </button>
            );

          })}

        </nav>


        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div
          className="
            border-t
            border-[#EEE9FF]
            p-4
          "
        >

          <div
            className="
              mb-3
              flex
              items-center
              gap-3
              rounded-xl
              bg-[#F8F6FF]
              p-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#6B4FD3]
                text-white
              "
            >

              <UserRound
                size={17}
              />

            </div>


            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  truncate
                  text-xs
                  font-black
                  text-[#211B38]
                "
              >
                MYMA Admin
              </p>

              <p
                className="
                  text-[9px]
                  text-[#9B92B4]
                "
              >
                Administrator
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-xl
              px-3
              py-2.5
              text-xs
              font-bold
              text-red-500
              transition
              hover:bg-red-50
            "
          >

            <LogOut size={16} />

            Sign Out

          </button>

        </div>

      </aside>


      {/* ==================================================
          MAIN
      ================================================== */}

      <div
        className="
          min-h-screen
          lg:pl-64
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-20
            items-center
            justify-between
            border-b
            border-[#E6DFFF]
            bg-white/95
            px-4
            backdrop-blur
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#E5DFFF]
                bg-white
                text-[#5B3FC4]
                lg:hidden
              "
            >

              <Menu size={19} />

            </button>


            <div>

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#7C5CFC]
                "
              >
                MYMA Supermarket
              </p>

              <h1
                className="
                  text-lg
                  font-black
                  text-[#211B38]
                  sm:text-xl
                "
              >
                Dashboard
              </h1>

            </div>

          </div>


          {/* HEADER RIGHT */}

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-4
            "
          >

            {/* Notification */}

            <button
              type="button"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#E5DFFF]
                bg-white
                text-[#6B4FD3]
              "
            >

              <Bell size={18} />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                "
              />

            </button>


            {/* Admin */}

            <div
              className="
                hidden
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-[#E5DFFF]
                bg-[#FBFAFF]
                px-3
                sm:flex
              "
            >

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#6B4FD3]
                  text-white
                "
              >

                <UserRound
                  size={14}
                />

              </div>

              <span
                className="
                  text-xs
                  font-bold
                  text-[#211B38]
                "
              >
                Admin
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <main
          className="
            mx-auto
            max-w-[1600px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
          "
        >

          {/* WELCOME */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mb-7
            "
          >

            <h2
              className="
                text-2xl
                font-black
                tracking-tight
                text-[#211B38]
                sm:text-3xl
              "
            >
              Good afternoon, Admin 👋
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-[#81799C]
                sm:text-sm
              "
            >
              Here's what's happening with
              your supermarket today.
            </p>

          </motion.div>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <StatCard
              title="Total Orders"
              value="128"
              change="+12.5%"
              icon={ShoppingCart}
              description="vs last month"
              delay={0}
            />

            <StatCard
              title="Total Products"
              value="245"
              change="+8.2%"
              icon={Box}
              description="active products"
              delay={0.05}
            />

            <StatCard
              title="Customers"
              value="842"
              change="+18.4%"
              icon={Users}
              description="registered users"
              delay={0.1}
            />

            <StatCard
              title="Revenue"
              value="₹1,24,500"
              change="+14.7%"
              icon={IndianRupee}
              description="this month"
              delay={0.15}
            />

          </div>


          {/* =================================================
              LOWER GRID
          ================================================= */}

          <div
            className="
              mt-6
              grid
              gap-6
              xl:grid-cols-[1.6fr_1fr]
            "
          >

            {/* RECENT ORDERS */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#E5DFFF]
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#EEE9FF]
                  px-5
                  py-5
                "
              >

                <div>

                  <h3
                    className="
                      text-sm
                      font-black
                      text-[#211B38]
                    "
                  >
                    Recent Orders
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-[#9B92B4]
                    "
                  >
                    Latest customer orders
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      "/orders"
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    text-[10px]
                    font-bold
                    text-[#6B4FD3]
                  "
                >

                  View all

                  <ChevronRight
                    size={13}
                  />

                </button>

              </div>


              <div
                className="
                  divide-y
                  divide-[#F0ECF8]
                "
              >

                <OrderRow
                  order="#MYMA884249"
                  customer="Arun Kumar"
                  amount="₹899"
                  status="Packed"
                />

                <OrderRow
                  order="#MYMA884250"
                  customer="Priya S"
                  amount="₹450"
                  status="New"
                />

                <OrderRow
                  order="#MYMA884251"
                  customer="Rahul M"
                  amount="₹1,200"
                  status="Delivered"
                />

                <OrderRow
                  order="#MYMA884252"
                  customer="Divya R"
                  amount="₹675"
                  status="Out for Delivery"
                />

              </div>

            </motion.section>


            {/* ORDER OVERVIEW */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
              }}
              className="
                rounded-2xl
                border
                border-[#E5DFFF]
                bg-white
                p-5
                shadow-sm
              "
            >

              <h3
                className="
                  text-sm
                  font-black
                  text-[#211B38]
                "
              >
                Order Overview
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9B92B4]
                "
              >
                Current order status
              </p>


              <div className="mt-5 space-y-4">

                <ProgressRow
                  label="New Orders"
                  count="18"
                  percentage={18}
                />

                <ProgressRow
                  label="Confirmed"
                  count="24"
                  percentage={24}
                />

                <ProgressRow
                  label="Packed"
                  count="31"
                  percentage={31}
                />

                <ProgressRow
                  label="Out for Delivery"
                  count="15"
                  percentage={15}
                />

                <ProgressRow
                  label="Delivered"
                  count="40"
                  percentage={40}
                />

              </div>

            </motion.section>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4">

              <h3
                className="
                  text-sm
                  font-black
                  text-[#211B38]
                "
              >
                Quick Actions
              </h3>

            </div>


            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              <QuickAction
                icon={Box}
                title="Add Product"
                description="Create a new product"
                onClick={() =>
                  handleNavigation(
                    "/products/add"
                  )
                }
              />

              <QuickAction
                icon={PackageCheck}
                title="Manage Orders"
                description="View pending orders"
                onClick={() =>
                  handleNavigation(
                    "/orders"
                  )
                }
              />

              <QuickAction
                icon={Users}
                title="Customers"
                description="View customer list"
                onClick={() =>
                  handleNavigation(
                    "/customers"
                  )
                }
              />

              <QuickAction
                icon={TrendingUp}
                title="Reports"
                description="View sales reports"
                onClick={() => {}}
              />

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  delay,
}) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
      }}
      className="
        rounded-2xl
        border
        border-[#E5DFFF]
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[#F0ECFF]
            text-[#6B4FD3]
          "
        >

          <Icon size={19} />

        </div>


        <span
          className="
            flex
            items-center
            gap-1
            rounded-full
            bg-green-50
            px-2
            py-1
            text-[9px]
            font-black
            text-green-600
          "
        >

          <TrendingUp size={11} />

          {change}

        </span>

      </div>


      <p
        className="
          mt-5
          text-[10px]
          font-bold
          text-[#9B92B4]
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-1
          text-2xl
          font-black
          text-[#211B38]
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-1
          text-[9px]
          text-[#A29AB8]
        "
      >
        {description}
      </p>

    </motion.div>
  );
}


// ======================================================
// ORDER ROW
// ======================================================

function OrderRow({
  order,
  customer,
  amount,
  status,
}) {

  const statusStyles = {

    New:
      "bg-blue-50 text-blue-600",

    Packed:
      "bg-purple-50 text-purple-600",

    Delivered:
      "bg-green-50 text-green-600",

    "Out for Delivery":
      "bg-orange-50 text-orange-600",

  };


  return (
    <div
      className="
        flex
        flex-col
        gap-3
        px-5
        py-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#F0ECFF]
            text-[#6B4FD3]
          "
        >

          <ShoppingCart
            size={15}
          />

        </div>


        <div>

          <p
            className="
              text-xs
              font-black
              text-[#211B38]
            "
          >
            {order}
          </p>

          <p
            className="
              mt-0.5
              text-[9px]
              text-[#9B92B4]
            "
          >
            {customer}
          </p>

        </div>

      </div>


      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          sm:justify-end
        "
      >

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[9px]
            font-black
            ${statusStyles[status]}
          `}
        >
          {status}
        </span>

        <span
          className="
            min-w-16
            text-right
            text-xs
            font-black
            text-[#211B38]
          "
        >
          {amount}
        </span>

        <ChevronRight
          size={15}
          className="text-[#B0A8C5]"
        />

      </div>

    </div>
  );
}


// ======================================================
// PROGRESS ROW
// ======================================================

function ProgressRow({
  label,
  count,
  percentage,
}) {

  return (
    <div>

      <div
        className="
          mb-1.5
          flex
          items-center
          justify-between
        "
      >

        <span
          className="
            text-[10px]
            font-bold
            text-[#81799C]
          "
        >
          {label}
        </span>

        <span
          className="
            text-[10px]
            font-black
            text-[#211B38]
          "
        >
          {count}
        </span>

      </div>


      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-[#F0ECF8]
        "
      >

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-[#5B3FC4]
            to-[#9B7CFF]
          "
        />

      </div>

    </div>
  );
}


// ======================================================
// QUICK ACTION
// ======================================================

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-[#E5DFFF]
        bg-white
        p-4
        text-left
        shadow-sm
        transition
        hover:border-[#CFC2FF]
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#F0ECFF]
          text-[#6B4FD3]
        "
      >

        <Icon size={18} />

      </div>


      <div className="min-w-0">

        <p
          className="
            text-xs
            font-black
            text-[#211B38]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            text-[#9B92B4]
          "
        >
          {description}
        </p>

      </div>


      <ArrowUpRight
        size={15}
        className="
          ml-auto
          shrink-0
          text-[#B0A8C5]
        "
      />

    </motion.button>
  );
}


export default Dashboard;