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
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";


// ======================================================
// STATUS MAP
// ======================================================

const FRONTEND_STATUS_MAP = {
  PENDING: "New",
  CONFIRMED: "Confirmed",
  PROCESSING: "Packed",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  const navigate = useNavigate();

  const location = useLocation();


  // ======================================================
  // SIDEBAR
  // ======================================================

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  // ======================================================
  // NOTIFICATION DROPDOWN
  // ======================================================

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);


  // ======================================================
  // LOGOUT POPUP
  // ======================================================

  const [
    logoutPopupOpen,
    setLogoutPopupOpen,
  ] = useState(false);


  // ======================================================
  // ADMIN USER
  // ======================================================

  const adminUser = useMemo(() => {

    const storedUser =
      localStorage.getItem(
        "myma_admin_user"
      );

    if (!storedUser) {
      return null;
    }

    try {

      return JSON.parse(
        storedUser
      );

    } catch (error) {

      console.warn(
        "Unable to parse admin user:",
        error
      );

      return {
        name: storedUser,
      };

    }

  }, []);


  const adminName =
    adminUser?.name ||
    adminUser?.fullName ||
    adminUser?.username ||
    (
      adminUser?.email
        ? adminUser.email.split("@")[0]
        : "Admin"
    );


  const adminRole =
    adminUser?.role ||
    "Administrator";


  // ======================================================
  // DASHBOARD DATA
  // ======================================================

  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    categories,
    setCategories,
  ] = useState([]);


  // ======================================================
  // LOADING
  // ======================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // ======================================================
  // ERROR
  // ======================================================

  const [
    error,
    setError,
  ] = useState("");


  // ======================================================
  // LAST UPDATED
  // ======================================================

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);


  // ======================================================
  // ADMIN LOGIN CHECK
  // ======================================================

  const authenticated =
    localStorage.getItem(
      "myma_admin_authenticated"
    );


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    setLogoutPopupOpen(true);

  };


  const confirmLogout = () => {

    localStorage.removeItem(
      "myma_admin_authenticated"
    );

    localStorage.removeItem(
      "myma_admin_user"
    );

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "token"
    );

    setLogoutPopupOpen(false);

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  const handleTokenExpired = () => {

    localStorage.removeItem(
      "myma_admin_authenticated"
    );

    localStorage.removeItem(
      "myma_admin_user"
    );

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "token"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  };


  // ======================================================
  // MENU
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

      return (
        location.pathname ===
        "/dashboard"
      );

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

  const handleNavigation = (
    path
  ) => {

    navigate(path);

    setSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ======================================================
  // LOAD DASHBOARD DATA
  // ======================================================

  const loadDashboardData =
    async () => {

      setLoading(true);

      setError("");

      try {

        const [
          ordersResponse,
          productsResponse,
          categoriesResponse,
        ] = await Promise.all([

          api.get(
            "/admin/orders"
          ),

          api.get(
            "/admin/products"
          ),

          api.get(
            "/admin/categories"
          ),

        ]);


        // ==================================================
        // ORDERS
        // ==================================================

        const ordersData =
          Array.isArray(
            ordersResponse?.data
          )
            ? ordersResponse.data
            : [];


        // ==================================================
        // PRODUCTS
        // ==================================================

        const productsData =
          Array.isArray(
            productsResponse?.data
          )
            ? productsResponse.data
            : [];


        // ==================================================
        // CATEGORIES
        // ==================================================

        const categoriesData =
          Array.isArray(
            categoriesResponse?.data
          )
            ? categoriesResponse.data
            : [];


        setOrders(
          ordersData
        );

        setProducts(
          productsData
        );

        setCategories(
          categoriesData
        );


        setLastUpdated(
          new Date()
        );


      } catch (err) {

        console.error(
          "Dashboard API error:",
          err
        );


        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403
        ) {

          handleTokenExpired();

          return;

        }


        setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load dashboard data."
        );


      } finally {

        setLoading(false);

      }

    };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    if (
      authenticated !== "true"
    ) {

      navigate(
        "/login",
        {
          replace: true,
        }
      );

      return;

    }


    loadDashboardData();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);


  // ======================================================
  // GREETING
  // ======================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  };


  // ======================================================
  // FORMAT MONEY
  // ======================================================

  const formatCurrency =
    (value) => {

      const amount =
        Number(value) || 0;

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(amount);

    };


  // ======================================================
  // FORMAT DATE
  // ======================================================

  const getDate =
    (value) => {

      if (!value) {
        return null;
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return null;

      }

      return date;

    };


  // ======================================================
  // CURRENT MONTH
  // ======================================================

  const now =
    new Date();


  const currentYear =
    now.getFullYear();


  const currentMonth =
    now.getMonth();


  // ======================================================
  // PREVIOUS MONTH
  // ======================================================

  const previousMonthDate =
    new Date(
      currentYear,
      currentMonth - 1,
      1
    );


  const previousMonth =
    previousMonthDate.getMonth();


  const previousMonthYear =
    previousMonthDate.getFullYear();


  // ======================================================
  // CURRENT MONTH ORDERS
  // ======================================================

  const currentMonthOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const date =
            getDate(
              order?.createdAt
            );

          if (!date) {
            return false;
          }

          return (
            date.getFullYear() ===
              currentYear &&
            date.getMonth() ===
              currentMonth
          );

        }
      );

    }, [
      orders,
      currentYear,
      currentMonth,
    ]);


  // ======================================================
  // PREVIOUS MONTH ORDERS
  // ======================================================

  const previousMonthOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const date =
            getDate(
              order?.createdAt
            );

          if (!date) {
            return false;
          }

          return (
            date.getFullYear() ===
              previousMonthYear &&
            date.getMonth() ===
              previousMonth
          );

        }
      );

    }, [
      orders,
      previousMonth,
      previousMonthYear,
    ]);


  // ======================================================
  // TOTAL ORDERS
  // ======================================================

  const totalOrders =
    orders.length;


  // ======================================================
  // TOTAL PRODUCTS
  // ======================================================

  const totalProducts =
    products.length;


  // ======================================================
  // ACTIVE PRODUCTS
  // ======================================================

  const activeProducts =
    products.filter(
      (product) =>
        product?.active !== false &&
        product?.available !== false
    ).length;


  // ======================================================
  // UNIQUE CUSTOMERS
  // ======================================================

  const uniqueCustomers =
    useMemo(() => {

      const customerIds =
        new Set();


      orders.forEach(
        (order) => {

          if (
            order?.customerId !==
              null &&
            order?.customerId !==
              undefined
          ) {

            customerIds.add(
              String(
                order.customerId
              )
            );

          }

        }
      );


      if (
        customerIds.size ===
        0
      ) {

        const fallback =
          new Set();


        orders.forEach(
          (order) => {

            const key =
              order?.customerPhone ||
              order?.customerEmail ||
              order?.customerName;


            if (key) {

              fallback.add(
                String(key)
                  .trim()
                  .toLowerCase()
              );

            }

          }
        );


        return fallback.size;

      }


      return customerIds.size;

    }, [
      orders,
    ]);


  // ======================================================
  // CURRENT MONTH REVENUE
  // ======================================================

  const currentMonthRevenue =
    useMemo(() => {

      return currentMonthOrders.reduce(
        (
          total,
          order
        ) => {

          const status =
            String(
              order?.orderStatus ||
              ""
            ).toUpperCase();


          if (
            status ===
            "CANCELLED"
          ) {

            return total;

          }


          return (
            total +
            Number(
              order?.totalAmount ||
              0
            )
          );

        },
        0
      );

    }, [
      currentMonthOrders,
    ]);


  // ======================================================
  // PREVIOUS MONTH REVENUE
  // ======================================================

  const previousMonthRevenue =
    useMemo(() => {

      return previousMonthOrders.reduce(
        (
          total,
          order
        ) => {

          const status =
            String(
              order?.orderStatus ||
              ""
            ).toUpperCase();


          if (
            status ===
            "CANCELLED"
          ) {

            return total;

          }


          return (
            total +
            Number(
              order?.totalAmount ||
              0
            )
          );

        },
        0
      );

    }, [
      previousMonthOrders,
    ]);


  // ======================================================
  // MONTHLY ORDER CHANGE
  // ======================================================

  const orderChange =
    useMemo(() => {

      if (
        previousMonthOrders.length ===
        0
      ) {

        if (
          currentMonthOrders.length >
          0
        ) {

          return "+100%";

        }

        return "0%";

      }


      const change =
        (
          (
            currentMonthOrders.length -
            previousMonthOrders.length
          ) /
          previousMonthOrders.length
        ) *
        100;


      return `${
        change >= 0
          ? "+"
          : ""
      }${change.toFixed(1)}%`;

    }, [
      currentMonthOrders,
      previousMonthOrders,
    ]);


  // ======================================================
  // REVENUE CHANGE
  // ======================================================

  const revenueChange =
    useMemo(() => {

      if (
        previousMonthRevenue ===
        0
      ) {

        if (
          currentMonthRevenue >
          0
        ) {

          return "+100%";

        }

        return "0%";

      }


      const change =
        (
          (
            currentMonthRevenue -
            previousMonthRevenue
          ) /
          previousMonthRevenue
        ) *
        100;


      return `${
        change >= 0
          ? "+"
          : ""
      }${change.toFixed(1)}%`;

    }, [
      currentMonthRevenue,
      previousMonthRevenue,
    ]);


  // ======================================================
  // CUSTOMER CURRENT MONTH
  // ======================================================

  const currentMonthCustomers =
    useMemo(() => {

      const customers =
        new Set();


      currentMonthOrders.forEach(
        (order) => {

          const key =
            order?.customerId ??
            order?.customerPhone ??
            order?.customerEmail ??
            order?.customerName;


          if (key) {

            customers.add(
              String(key)
                .trim()
                .toLowerCase()
            );

          }

        }
      );


      return customers.size;

    }, [
      currentMonthOrders,
    ]);


  // ======================================================
  // CUSTOMER PREVIOUS MONTH
  // ======================================================

  const previousMonthCustomers =
    useMemo(() => {

      const customers =
        new Set();


      previousMonthOrders.forEach(
        (order) => {

          const key =
            order?.customerId ??
            order?.customerPhone ??
            order?.customerEmail ??
            order?.customerName;


          if (key) {

            customers.add(
              String(key)
                .trim()
                .toLowerCase()
            );

          }

        }
      );


      return customers.size;

    }, [
      previousMonthOrders,
    ]);


  // ======================================================
  // CUSTOMER CHANGE
  // ======================================================

  const customerChange =
    useMemo(() => {

      if (
        previousMonthCustomers ===
        0
      ) {

        if (
          currentMonthCustomers >
          0
        ) {

          return "+100%";

        }

        return "0%";

      }


      const change =
        (
          (
            currentMonthCustomers -
            previousMonthCustomers
          ) /
          previousMonthCustomers
        ) *
        100;


      return `${
        change >= 0
          ? "+"
          : ""
      }${change.toFixed(1)}%`;

    }, [
      currentMonthCustomers,
      previousMonthCustomers,
    ]);


  // ======================================================
  // ACTIVE CATEGORY COUNT
  // ======================================================

  const activeCategories =
    categories.filter(
      (category) =>
        category?.active !== false
    ).length;


  // ======================================================
  // ORDER STATUS COUNTS
  // ======================================================

  const orderStatusCounts =
    useMemo(() => {

      const counts = {

        New: 0,

        Confirmed: 0,

        Packed: 0,

        "Out for Delivery": 0,

        Delivered: 0,

        Cancelled: 0,

      };


      orders.forEach(
        (order) => {

          const backendStatus =
            String(
              order?.orderStatus ||
              "PENDING"
            ).toUpperCase();


          const frontendStatus =
            FRONTEND_STATUS_MAP[
              backendStatus
            ] || "New";


          if (
            counts[
              frontendStatus
            ] !== undefined
          ) {

            counts[
              frontendStatus
            ] += 1;

          }

        }
      );


      return counts;

    }, [
      orders,
    ]);


  // ======================================================
  // ORDER OVERVIEW TOTAL
  // ======================================================

  const overviewTotal =
    Object.values(
      orderStatusCounts
    ).reduce(
      (
        total,
        value
      ) =>
        total + value,
      0
    );


  // ======================================================
  // RECENT ORDERS
  // ======================================================

  const recentOrders =
    useMemo(() => {

      return [
        ...orders,
      ]
        .sort(
          (
            first,
            second
          ) => {

            const firstDate =
              getDate(
                first?.createdAt
              )?.getTime() || 0;


            const secondDate =
              getDate(
                second?.createdAt
              )?.getTime() || 0;


            return (
              secondDate -
              firstDate
            );

          }
        )
        .slice(
          0,
          5
        );

    }, [
      orders,
    ]);


  // ======================================================
  // FORMAT ORDER STATUS
  // ======================================================

  const getOrderStatus =
    (order) => {

      const backendStatus =
        String(
          order?.orderStatus ||
          "PENDING"
        ).toUpperCase();


      return (
        FRONTEND_STATUS_MAP[
          backendStatus
        ] || "New"
      );

    };


  // ======================================================
  // ORDER NUMBER
  // ======================================================

  const getOrderNumber =
    (order) => {

      return (
        order?.orderNumber ||
        `#${order?.id || ""}`
      );

    };


  // ======================================================
  // CUSTOMER NAME
  // ======================================================

  const getCustomerName =
    (order) => {

      return (
        order?.customerName ||
        "Unknown Customer"
      );

    };


  // ======================================================
  // ORDER AMOUNT
  // ======================================================

  const getOrderAmount =
    (order) => {

      return formatCurrency(
        order?.totalAmount
      );

    };


  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  const notifications =
    useMemo(() => {

      const items = [];


      // ==================================================
      // NEW ORDERS
      // ==================================================

      orders
        .filter(
          (order) => {

            const status =
              String(
                order?.orderStatus ||
                "PENDING"
              ).toUpperCase();

            return (
              status ===
              "PENDING"
            );

          }
        )
        .sort(
          (
            first,
            second
          ) => {

            const firstDate =
              getDate(
                first?.createdAt
              )?.getTime() || 0;


            const secondDate =
              getDate(
                second?.createdAt
              )?.getTime() || 0;


            return (
              secondDate -
              firstDate
            );

          }
        )
        .slice(
          0,
          5
        )
        .forEach(
          (order) => {

            items.push({

              id:
                `new-order-${
                  order?.id ||
                  order?.orderNumber ||
                  "order"
                }`,

              type:
                "order",

              title:
                "New order received",

              message:
                `${getOrderNumber(
                  order
                )} from ${getCustomerName(
                  order
                )}`,

              icon:
                ShoppingCart,

              time:
                getDate(
                  order?.createdAt
                ),

            });

          }
        );


      // ==================================================
      // STOCK NOTIFICATIONS
      // ==================================================

      products.forEach(
        (product) => {

          const variants =
            Array.isArray(
              product?.variants
            )
              ? product.variants
              : [];


          // ==================================================
          // PRODUCT VARIANTS
          // ==================================================

          if (
            variants.length > 0
          ) {

            variants.forEach(
              (variant) => {

                const rawStock =
                  variant?.stockQuantity ??
                  variant?.stock ??
                  variant?.quantity;


                if (
                  rawStock ===
                    undefined ||
                  rawStock ===
                    null
                ) {

                  return;

                }


                const stock =
                  Number(
                    rawStock
                  );


                if (
                  !Number.isFinite(
                    stock
                  )
                ) {

                  return;

                }


                const variantName =
                  variant?.name ||
                  variant?.value ||
                  variant?.unit ||
                  "Variant";


                if (
                  stock <= 0
                ) {

                  items.push({

                    id:
                      `out-stock-${
                        product?.id ||
                        product?.name
                      }-${
                        variant?.id ||
                        variantName
                      }`,

                    type:
                      "danger",

                    title:
                      "Out of stock",

                    message:
                      `${
                        product?.name ||
                        "Product"
                      } (${
                        variantName
                      }) is out of stock`,

                    icon:
                      AlertCircle,

                    time:
                      null,

                  });

                } else if (
                  stock <= 10
                ) {

                  items.push({

                    id:
                      `low-stock-${
                        product?.id ||
                        product?.name
                      }-${
                        variant?.id ||
                        variantName
                      }`,

                    type:
                      "warning",

                    title:
                      "Low stock alert",

                    message:
                      `${
                        product?.name ||
                        "Product"
                      } (${
                        variantName
                      }) has only ${
                        stock
                      } left`,

                    icon:
                      AlertCircle,

                    time:
                      null,

                  });

                }

              }
            );


            return;

          }


          // ==================================================
          // NORMAL PRODUCT STOCK
          // ==================================================

          const rawStock =
            product?.stockQuantity ??
            product?.stock ??
            product?.quantity;


          if (
            rawStock ===
              undefined ||
            rawStock ===
              null
          ) {

            return;

          }


          const stock =
            Number(
              rawStock
            );


          if (
            !Number.isFinite(
              stock
            )
          ) {

            return;

          }


          if (
            stock <= 0
          ) {

            items.push({

              id:
                `out-stock-${
                  product?.id ||
                  product?.name
                }`,

              type:
                "danger",

              title:
                "Out of stock",

              message:
                `${
                  product?.name ||
                  "Product"
                } is out of stock`,

              icon:
                AlertCircle,

              time:
                null,

            });

          } else if (
            stock <= 10
          ) {

            items.push({

              id:
                `low-stock-${
                  product?.id ||
                  product?.name
                }`,

              type:
                "warning",

              title:
                "Low stock alert",

              message:
                `${
                  product?.name ||
                  "Product"
                } has only ${
                  stock
                } left`,

              icon:
                AlertCircle,

              time:
                null,

            });

          }

        }
      );


      return items;

    }, [
      orders,
      products,
    ]);


  const notificationCount =
    notifications.length;


  // ======================================================
  // RETRY
  // ======================================================

  const handleRetry =
    () => {

      loadDashboardData();

    };


  // ======================================================
  // AUTH GUARD
  // ======================================================

  if (
    authenticated !== "true"
  ) {

    return null;

  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#F8F6FF]
      "
    >


      {/* ==================================================
          LOGOUT CONFIRMATION POPUP
      ================================================== */}

      {logoutPopupOpen && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            bg-[#211B38]/50
            px-4
            backdrop-blur-sm
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="
              w-full
              max-w-sm
              rounded-2xl
              border
              border-[#E5DFFF]
              bg-white
              p-6
              shadow-2xl
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
              "
            >
              <LogOut size={21} />
            </div>


            <h3
              className="
                mt-4
                text-base
                font-black
                text-[#211B38]
              "
            >
              Sign out?
            </h3>


            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#81799C]
              "
            >
              Are you sure you want to sign out of the admin panel?
            </p>


            <div
              className="
                mt-6
                flex
                gap-3
              "
            >

              <button
                type="button"
                onClick={() =>
                  setLogoutPopupOpen(false)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-[#E5DFFF]
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-[#81799C]
                  transition
                  hover:bg-[#F8F6FF]
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={confirmLogout}
                className="
                  flex-1
                  rounded-xl
                  bg-red-500
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                Sign Out
              </button>

            </div>

          </motion.div>

        </div>

      )}


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


        {/* =================================================
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


          {menuItems.map(
            (item) => {

              const Icon =
                item.icon;


              const active =
                isActive(
                  item.path
                );


              return (

                <button
                  key={
                    item.name
                  }
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

            }
          )}

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
                {adminName}
              </p>

              <p
                className="
                  truncate
                  text-[9px]
                  text-[#9B92B4]
                "
              >
                {adminRole}
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={
              handleLogout
            }
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

            {/* REFRESH */}

            <button
              type="button"
              onClick={
                handleRetry
              }
              disabled={loading}
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
                text-[#6B4FD3]
                transition
                hover:bg-[#F8F6FF]
                disabled:opacity-50
              "
              title="Refresh dashboard"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

            </button>


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <div
              className="
                relative
              "
            >

              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (current) =>
                      !current
                  )
                }
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
                  transition
                  hover:bg-[#F8F6FF]
                "
                title="Notifications"
              >

                <Bell
                  size={18}
                />


                {notificationCount >
                  0 && (

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      px-1
                      text-[8px]
                      font-black
                      text-white
                    "
                  >
                    {
                      notificationCount >
                      99
                        ? "99+"
                        : notificationCount
                    }
                  </span>

                )}

              </button>


              {/* =================================================
                  NOTIFICATION DROPDOWN
              ================================================= */}

              {notificationOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-[100]
                    w-[340px]
                    max-w-[calc(100vw-2rem)]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#E5DFFF]
                    bg-white
                    shadow-2xl
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#EEE9FF]
                      px-4
                      py-3
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
                        Notifications
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          text-[#9B92B4]
                        "
                      >
                        Latest supermarket activity
                      </p>

                    </div>


                    <span
                      className="
                        rounded-full
                        bg-[#F0ECFF]
                        px-2
                        py-1
                        text-[8px]
                        font-black
                        text-[#6B4FD3]
                      "
                    >
                      {notificationCount}
                    </span>

                  </div>


                  {/* EMPTY */}

                  {notifications.length ===
                  0 ? (

                    <div
                      className="
                        flex
                        min-h-[180px]
                        flex-col
                        items-center
                        justify-center
                        px-5
                        text-center
                      "
                    >

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F0ECFF]
                          text-[#6B4FD3]
                        "
                      >

                        <Bell
                          size={20}
                        />

                      </div>


                      <p
                        className="
                          mt-3
                          text-xs
                          font-black
                          text-[#211B38]
                        "
                      >
                        No new notifications
                      </p>


                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#9B92B4]
                        "
                      >
                        Everything looks good.
                      </p>

                    </div>

                  ) : (

                    <div
                      className="
                        max-h-[360px]
                        overflow-y-auto
                      "
                    >

                      {notifications.map(
                        (
                          notification
                        ) => {

                          const Icon =
                            notification.icon;


                          return (

                            <button
                              key={
                                notification.id
                              }
                              type="button"
                              onClick={() => {

                                setNotificationOpen(
                                  false
                                );


                                if (
                                  notification.type ===
                                  "order"
                                ) {

                                  navigate(
                                    "/orders"
                                  );

                                } else {

                                  navigate(
                                    "/products"
                                  );

                                }

                              }}
                              className="
                                flex
                                w-full
                                items-start
                                gap-3
                                border-b
                                border-[#F2EFF8]
                                px-4
                                py-3
                                text-left
                                transition
                                hover:bg-[#FBFAFF]
                              "
                            >

                              {/* ICON */}

                              <div
                                className={`
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  ${
                                    notification.type ===
                                    "danger"
                                      ? "bg-red-50 text-red-500"
                                      : notification.type ===
                                        "warning"
                                        ? "bg-orange-50 text-orange-500"
                                        : "bg-[#F0ECFF] text-[#6B4FD3]"
                                  }
                                `}
                              >

                                <Icon
                                  size={15}
                                />

                              </div>


                              {/* CONTENT */}

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >

                                <p
                                  className="
                                    text-[10px]
                                    font-black
                                    text-[#211B38]
                                  "
                                >
                                  {
                                    notification.title
                                  }
                                </p>


                                <p
                                  className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-[#81799C]
                                  "
                                >
                                  {
                                    notification.message
                                  }
                                </p>


                                {notification.time && (

                                  <p
                                    className="
                                      mt-1
                                      text-[8px]
                                      font-semibold
                                      text-[#A29AB8]
                                    "
                                  >

                                    {
                                      notification.time.toLocaleString(
                                        "en-IN",
                                        {
                                          day:
                                            "2-digit",
                                          month:
                                            "short",
                                          hour:
                                            "2-digit",
                                          minute:
                                            "2-digit",
                                        }
                                      )
                                    }

                                  </p>

                                )}

                              </div>

                            </button>

                          );

                        }
                      )}

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* =================================================
                ADMIN
            ================================================= */}

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


              <div
                className="
                  min-w-0
                "
              >

                <span
                  className="
                    block
                    max-w-[110px]
                    truncate
                    text-xs
                    font-bold
                    text-[#211B38]
                  "
                >
                  {adminName}
                </span>

                <span
                  className="
                    block
                    text-[8px]
                    text-[#9B92B4]
                  "
                >
                  {adminRole}
                </span>

              </div>

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


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mb-6
                flex
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-red-100
                bg-red-50
                px-4
                py-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <AlertCircle
                  size={19}
                  className="
                    shrink-0
                    text-red-500
                  "
                />


                <div>

                  <p
                    className="
                      text-xs
                      font-black
                      text-red-600
                    "
                  >
                    Unable to load dashboard data
                  </p>


                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-red-500
                    "
                  >
                    {error}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  handleRetry
                }
                className="
                  shrink-0
                  rounded-xl
                  bg-red-500
                  px-3
                  py-2
                  text-[10px]
                  font-black
                  text-white
                "
              >
                Retry
              </button>

            </motion.div>

          )}


          {/* =================================================
              WELCOME
          ================================================= */}

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

            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-[#211B38]
                    sm:text-3xl
                  "
                >
                  {getGreeting()}, {adminName} 👋
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

              </div>


              {lastUpdated && (

                <p
                  className="
                    text-[9px]
                    font-semibold
                    text-[#9B92B4]
                  "
                >

                  Updated{" "}

                  {lastUpdated.toLocaleTimeString(
                    "en-IN",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}

                </p>

              )}

            </div>

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
              value={
                loading
                  ? "..."
                  : totalOrders
              }
              change={
                loading
                  ? "..."
                  : orderChange
              }
              icon={
                ShoppingCart
              }
              description={
                currentMonthOrders.length ===
                1
                  ? "1 order this month"
                  : `${currentMonthOrders.length} orders this month`
              }
              delay={0}
            />


            <StatCard
              title="Total Products"
              value={
                loading
                  ? "..."
                  : totalProducts
              }
              change={
                loading
                  ? "..."
                  : "LIVE"
              }
              icon={Box}
              description={
                loading
                  ? "Loading products"
                  : `${activeProducts} active products`
              }
              delay={0.05}
            />


            <StatCard
              title="Customers"
              value={
                loading
                  ? "..."
                  : uniqueCustomers
              }
              change={
                loading
                  ? "..."
                  : customerChange
              }
              icon={Users}
              description={
                loading
                  ? "Loading customers"
                  : `${currentMonthCustomers} this month`
              }
              delay={0.1}
            />


            <StatCard
              title="Revenue"
              value={
                loading
                  ? "..."
                  : formatCurrency(
                      currentMonthRevenue
                    )
              }
              change={
                loading
                  ? "..."
                  : revenueChange
              }
              icon={
                IndianRupee
              }
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


            {/* =================================================
                RECENT ORDERS
            ================================================= */}

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

                {loading ? (

                  <DashboardLoadingRows />

                ) : recentOrders.length ===
                  0 ? (

                  <EmptyOrders />

                ) : (

                  recentOrders.map(
                    (
                      order,
                      index
                    ) => (

                      <OrderRow
                        key={
                          order?.id ||
                          order?.orderNumber ||
                          index
                        }
                        order={
                          getOrderNumber(
                            order
                          )
                        }
                        customer={
                          getCustomerName(
                            order
                          )
                        }
                        amount={
                          getOrderAmount(
                            order
                          )
                        }
                        status={
                          getOrderStatus(
                            order
                          )
                        }
                      />

                    )
                  )

                )}

              </div>

            </motion.section>


            {/* =================================================
                ORDER OVERVIEW
            ================================================= */}

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

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
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

                </div>


                <span
                  className="
                    rounded-full
                    bg-[#F0ECFF]
                    px-2.5
                    py-1
                    text-[9px]
                    font-black
                    text-[#6B4FD3]
                  "
                >
                  {overviewTotal}
                </span>

              </div>


              <div
                className="
                  mt-5
                  space-y-4
                "
              >

                <ProgressRow
                  label="New Orders"
                  count={
                    orderStatusCounts.New
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts.New /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />


                <ProgressRow
                  label="Confirmed"
                  count={
                    orderStatusCounts.Confirmed
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts.Confirmed /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />


                <ProgressRow
                  label="Packed"
                  count={
                    orderStatusCounts.Packed
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts.Packed /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />


                <ProgressRow
                  label="Out for Delivery"
                  count={
                    orderStatusCounts[
                      "Out for Delivery"
                    ]
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts[
                            "Out for Delivery"
                          ] /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />


                <ProgressRow
                  label="Delivered"
                  count={
                    orderStatusCounts.Delivered
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts.Delivered /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />


                <ProgressRow
                  label="Cancelled"
                  count={
                    orderStatusCounts.Cancelled
                  }
                  percentage={
                    overviewTotal
                      ? (
                          orderStatusCounts.Cancelled /
                          overviewTotal
                        ) *
                        100
                      : 0
                  }
                />

              </div>

            </motion.section>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section
            className="
              mt-6
            "
          >

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
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
                  Quick Actions
                </h3>


                <p
                  className="
                    mt-1
                    text-[9px]
                    text-[#9B92B4]
                  "
                >
                  Manage your supermarket
                </p>

              </div>


              <div
                className="
                  hidden
                  text-[9px]
                  font-bold
                  text-[#9B92B4]
                  sm:block
                "
              >
                {activeCategories} active categories
              </div>

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
                title="Categories"
                description={
                  `${activeCategories} active categories`
                }
                onClick={() =>
                  handleNavigation(
                    "/categories"
                  )
                }
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

  const isPositive =
    String(change)
      .startsWith("+");


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
          className={`
            flex
            items-center
            gap-1
            rounded-full
            px-2
            py-1
            text-[9px]
            font-black
            ${
              isPositive
                ? "bg-green-50 text-green-600"
                : "bg-[#F5F2FF] text-[#6B4FD3]"
            }
          `}
        >

          {isPositive && (

            <TrendingUp
              size={11}
            />

          )}

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
              max-w-[180px]
              truncate
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
            ${
              status === "Confirmed"
                ? "bg-indigo-50 text-indigo-600"
                : status === "Packed"
                  ? "bg-purple-50 text-purple-600"
                  : status === "Out for Delivery"
                    ? "bg-orange-50 text-orange-600"
                    : status === "Delivered"
                      ? "bg-green-50 text-green-600"
                      : status === "Cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600"
            }
          `}
        >
          {status}
        </span>


        <span
          className="
            min-w-20
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
          className="
            text-[#B0A8C5]
          "
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
            width: `${Math.min(
              100,
              Math.max(
                0,
                percentage
              )
            )}%`,
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


      <div
        className="
          min-w-0
        "
      >

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


// ======================================================
// LOADING ROWS
// ======================================================

function DashboardLoadingRows() {

  return (

    <>

      {[1, 2, 3, 4].map(
        (item) => (

          <div
            key={item}
            className="
              flex
              items-center
              justify-between
              px-5
              py-4
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
                  h-9
                  w-9
                  animate-pulse
                  rounded-lg
                  bg-[#F0ECFF]
                "
              />


              <div>

                <div
                  className="
                    h-3
                    w-24
                    animate-pulse
                    rounded
                    bg-[#F0ECFF]
                  "
                />


                <div
                  className="
                    mt-2
                    h-2
                    w-32
                    animate-pulse
                    rounded
                    bg-[#F5F2FF]
                  "
                />

              </div>

            </div>


            <div
              className="
                h-5
                w-20
                animate-pulse
                rounded-full
                bg-[#F0ECFF]
              "
            />

          </div>

        )
      )}

    </>

  );

}


// ======================================================
// EMPTY ORDERS
// ======================================================

function EmptyOrders() {

  return (

    <div
      className="
        px-5
        py-12
        text-center
      "
    >

      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-[#F0ECFF]
          text-[#6B4FD3]
        "
      >

        <ShoppingCart
          size={20}
        />

      </div>


      <p
        className="
          mt-3
          text-xs
          font-black
          text-[#211B38]
        "
      >
        No orders yet
      </p>


      <p
        className="
          mt-1
          text-[9px]
          text-[#9B92B4]
        "
      >
        New customer orders will
        appear here.
      </p>

    </div>

  );

}


export default Dashboard;