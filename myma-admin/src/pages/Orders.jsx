import { motion } from "framer-motion";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


// ======================================================
// DEMO ORDERS
// Later Java + MySQL API-la replace pannuvom
// ======================================================

const initialOrders = [
  {
    id: "MYMA884249",
    customer: {
      name: "Arun Kumar",
      mobile: "6369564771",
    },

    items: [
      {
        name: "Fresh Apples",
        quantity: "1 kg",
        count: 2,
        price: 120,
      },
      {
        name: "Fresh Milk",
        quantity: "1 L",
        count: 1,
        price: 62,
      },
      {
        name: "Bread",
        quantity: "500 g",
        count: 1,
        price: 45,
      },
    ],

    total: 347,

    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",

    status: "New",

    date: "28 Aug 2026",
    time: "10:30 AM",

    address:
      "12, Main Road, Anna Nagar, Chennai, Tamil Nadu - 600040",
  },

  {
    id: "MYMA884250",
    customer: {
      name: "Priya S",
      mobile: "9876501234",
    },

    items: [
      {
        name: "Tomatoes",
        quantity: "1 kg",
        count: 1,
        price: 80,
      },
      {
        name: "Potatoes",
        quantity: "1 kg",
        count: 2,
        price: 40,
      },
    ],

    total: 160,

    paymentMethod: "UPI",
    paymentStatus: "Paid",

    status: "Confirmed",

    date: "28 Aug 2026",
    time: "11:15 AM",

    address:
      "24, Gandhi Street, Velachery, Chennai, Tamil Nadu - 600042",
  },

  {
    id: "MYMA884251",
    customer: {
      name: "Rahul M",
      mobile: "9988776655",
    },

    items: [
      {
        name: "Bananas",
        quantity: "12 pcs",
        count: 1,
        price: 60,
      },
      {
        name: "Carrots",
        quantity: "1 kg",
        count: 1,
        price: 95,
      },
      {
        name: "Milk",
        quantity: "1 L",
        count: 2,
        price: 62,
      },
    ],

    total: 279,

    paymentMethod: "UPI",
    paymentStatus: "Paid",

    status: "Packed",

    date: "28 Aug 2026",
    time: "12:05 PM",

    address:
      "8, Lake View Road, Adyar, Chennai, Tamil Nadu - 600020",
  },

  {
    id: "MYMA884252",
    customer: {
      name: "Divya R",
      mobile: "9123456789",
    },

    items: [
      {
        name: "Fresh Apples",
        quantity: "500 g",
        count: 1,
        price: 65,
      },
      {
        name: "Carrots",
        quantity: "500 g",
        count: 1,
        price: 48,
      },
    ],

    total: 113,

    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",

    status: "Out for Delivery",

    date: "28 Aug 2026",
    time: "12:45 PM",

    address:
      "45, Market Road, T Nagar, Chennai, Tamil Nadu - 600017",
  },

  {
    id: "MYMA884253",
    customer: {
      name: "Karthik R",
      mobile: "9000011111",
    },

    items: [
      {
        name: "Fresh Tomatoes",
        quantity: "1 kg",
        count: 2,
        price: 80,
      },
    ],

    total: 160,

    paymentMethod: "UPI",
    paymentStatus: "Paid",

    status: "Delivered",

    date: "27 Aug 2026",
    time: "06:20 PM",

    address:
      "7, Temple Street, Mylapore, Chennai, Tamil Nadu - 600004",
  },
];


// ======================================================
// STATUS FLOW
// ======================================================

const statusFlow = [
  "New",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];


// ======================================================
// STATUS STYLES
// ======================================================

const statusStyles = {
  New: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: Clock3,
  },

  Confirmed: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: CheckCircle2,
  },

  Packed: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: Package,
  },

  "Out for Delivery": {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: Truck,
  },

  Delivered: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: CheckCircle2,
  },
};


// ======================================================
// ORDERS
// ======================================================

function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState(initialOrders);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  // ====================================================
  // FILTER
  // ====================================================

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        order.id
          .toLowerCase()
          .includes(searchText) ||
        order.customer.name
          .toLowerCase()
          .includes(searchText) ||
        order.customer.mobile
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  }, [
    orders,
    search,
    statusFilter,
  ]);


  // ====================================================
  // CHANGE STATUS
  // ====================================================

  const handleStatusChange = (
    orderId,
    newStatus
  ) => {

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
        )
    );


    // ================================================
    // LATER JAVA API
    // ================================================

    console.log(
      "Order status changed:",
      orderId,
      newStatus
    );


    // ================================================
    // LATER WHATSAPP API
    // ================================================

    console.log(
      "WhatsApp notification required:",
      {
        orderId,
        status: newStatus,
      }
    );
  };


// ====================================================
// WHATSAPP STATUS MESSAGE
// ====================================================

const openWhatsApp = (order) => {

  const phone = order.customer.mobile;

  let message = "";

  // ================================================
  // NEW
  // ================================================

  if (order.status === "New") {

    message =
      `🛒 *MYMA SUPERMARKET*%0A%0A` +
      `Hello ${order.customer.name},%0A%0A` +
      `We have received your order successfully! ✅%0A%0A` +
      `🧾 Order ID: #${order.id}%0A` +
      `💰 Total: ₹${order.total}%0A%0A` +
      `Your order is waiting for confirmation.%0A%0A` +
      `Thank you for shopping with MYMA ❤️`;

  }


  // ================================================
  // CONFIRMED
  // ================================================

  else if (order.status === "Confirmed") {

    message =
      `✅ *MYMA ORDER CONFIRMED*%0A%0A` +
      `Hello ${order.customer.name},%0A%0A` +
      `Your order has been confirmed successfully! 🎉%0A%0A` +
      `🧾 Order ID: #${order.id}%0A` +
      `💰 Total: ₹${order.total}%0A%0A` +
      `We are now preparing your items.%0A%0A` +
      `We will notify you once your order is packed.%0A%0A` +
      `Thank you for choosing MYMA ❤️`;

  }


  // ================================================
  // PACKED
  // ================================================

  else if (order.status === "Packed") {

    message =
      `📦 *MYMA ORDER PACKED*%0A%0A` +
      `Hello ${order.customer.name},%0A%0A` +
      `Great news! Your order has been packed successfully. ✅%0A%0A` +
      `🧾 Order ID: #${order.id}%0A` +
      `💰 Total: ₹${order.total}%0A%0A` +
      `Your order will be dispatched shortly.%0A%0A` +
      `Please keep your phone available for delivery updates. 📱%0A%0A` +
      `MYMA Supermarket ❤️`;

  }


  // ================================================
  // OUT FOR DELIVERY
  // ================================================

  else if (
    order.status === "Out for Delivery"
  ) {

    message =
      `🚚 *MYMA ORDER OUT FOR DELIVERY*%0A%0A` +
      `Hello ${order.customer.name},%0A%0A` +
      `Your order is on the way! 🎉%0A%0A` +
      `🧾 Order ID: #${order.id}%0A` +
      `💰 Total: ₹${order.total}%0A%0A` +
      `📍 Delivery Address:%0A${order.address}%0A%0A` +
      `Please keep your phone available for the delivery executive. 📱%0A%0A` +
      `Thank you for shopping with MYMA ❤️`;

  }


  // ================================================
  // DELIVERED
  // ================================================

  else if (order.status === "Delivered") {

    message =
      `🎉 *MYMA ORDER DELIVERED*%0A%0A` +
      `Hello ${order.customer.name},%0A%0A` +
      `Your order has been delivered successfully! ✅%0A%0A` +
      `🧾 Order ID: #${order.id}%0A` +
      `💰 Total: ₹${order.total}%0A%0A` +
      `Thank you for shopping with MYMA Supermarket. ❤️%0A%0A` +
      `We hope to serve you again soon! 🛒`;

  }


  // ================================================
  // OPEN WHATSAPP
  // ================================================

  const whatsappUrl =
    `https://wa.me/91${phone}?text=${message}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
};


  return (
    <main
      className="
        min-h-screen
        bg-[#F8F6FF]
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className="
          sticky
          top-0
          z-30
          border-b
          border-[#E6DFFF]
          bg-white/95
          backdrop-blur
        "
      >

        <div
          className="
            mx-auto
            flex
            h-20
            max-w-[1600px]
            items-center
            justify-between
            gap-3
            px-4
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

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#E3DDF5]
                bg-white
                text-[#6B4FD3]
                transition
                hover:bg-[#F4F0FF]
              "
            >

              <ArrowLeft
                size={18}
              />

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
                MYMA Admin
              </p>

              <h1
                className="
                  mt-1
                  text-xl
                  font-black
                  text-[#211B38]
                  sm:text-2xl
                "
              >
                Orders
              </h1>

            </div>

          </div>


          {/* ORDER COUNT */}

          <div
            className="
              hidden
              rounded-xl
              bg-[#F0ECFF]
              px-4
              py-2
              sm:block
            "
          >

            <span
              className="
                text-xs
                font-black
                text-[#5B3FC4]
              "
            >
              {orders.length}
            </span>

            <span
              className="
                ml-1
                text-[10px]
                font-bold
                text-[#81799C]
              "
            >
              Total Orders
            </span>

          </div>

        </div>

      </header>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <section
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

        {/* ==================================================
            STATUS SUMMARY
        ================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-5
          "
        >

          {statusFlow.map(
            (status) => {

              const count =
                orders.filter(
                  (order) =>
                    order.status ===
                    status
                ).length;

              const Icon =
                statusStyles[
                  status
                ].icon;

              return (
                <motion.button
                  key={status}
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  onClick={() =>
                    setStatusFilter(
                      status
                    )
                  }
                  className={`
                    rounded-2xl
                    border
                    p-4
                    text-left
                    shadow-sm
                    transition
                    ${
                      statusFilter ===
                      status
                        ? "border-[#BEB0F5] bg-[#F0ECFF]"
                        : "border-[#E5DFFF] bg-white"
                    }
                  `}
                >

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        statusStyles[
                          status
                        ].bg
                      }
                      ${
                        statusStyles[
                          status
                        ].text
                      }
                    `}
                  >

                    <Icon
                      size={17}
                    />

                  </div>


                  <p
                    className="
                      mt-3
                      text-[9px]
                      font-bold
                      text-[#9B92B4]
                    "
                  >
                    {status}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xl
                      font-black
                      text-[#211B38]
                    "
                  >
                    {count}
                  </p>

                </motion.button>
              );

            }
          )}

        </div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-[#E5DFFF]
            bg-white
            p-4
            shadow-sm
            sm:p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* SEARCH */}

            <div
              className="
                relative
                w-full
                lg:max-w-md
              "
            >

              <Search
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#9B92B4]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search order ID, customer or mobile..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#E2DCF4]
                  bg-[#FCFBFF]
                  pl-11
                  pr-4
                  text-xs
                  font-medium
                  text-[#211B38]
                  outline-none
                  placeholder:text-[#AAA3BC]
                  focus:border-[#6B4FD3]
                  focus:ring-4
                  focus:ring-[#6B4FD3]/10
                "
              />

            </div>


            {/* STATUS */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#E2DCF4]
                  bg-[#FCFBFF]
                  px-4
                  text-xs
                  font-bold
                  text-[#211B38]
                  outline-none
                  focus:border-[#6B4FD3]
                  sm:w-auto
                "
              >

                <option value="All">
                  All Orders
                </option>

                {statusFlow.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </select>


              {statusFilter !==
                "All" && (

                <button
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      "All"
                    )
                  }
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

                  <X size={16} />

                </button>

              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            ORDERS
        ================================================== */}

        <section
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-[#E5DFFF]
            bg-white
            shadow-sm
          "
        >

          {/* DESKTOP HEADER */}

          <div
            className="
              hidden
              grid-cols-[1.3fr_1.3fr_0.8fr_0.9fr_1.1fr_40px]
              gap-4
              border-b
              border-[#EEE9FF]
              bg-[#FCFBFF]
              px-5
              py-3
              lg:grid
            "
          >

            <TableHeader>
              Order
            </TableHeader>

            <TableHeader>
              Customer
            </TableHeader>

            <TableHeader>
              Total
            </TableHeader>

            <TableHeader>
              Payment
            </TableHeader>

            <TableHeader>
              Status
            </TableHeader>

            <span />

          </div>


          {/* ORDER LIST */}

          {filteredOrders.length > 0 ? (

            <div
              className="
                divide-y
                divide-[#F0ECF8]
              "
            >

              {filteredOrders.map(
                (order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={
                      handleStatusChange
                    }
                    onView={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                    onWhatsApp={() =>
                      openWhatsApp(
                        order
                      )
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div
              className="
                flex
                min-h-[350px]
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
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F0ECFF]
                  text-[#6B4FD3]
                "
              >

                <Search
                  size={25}
                />

              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-black
                  text-[#211B38]
                "
              >
                No orders found
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9B92B4]
                "
              >
                Try changing your search
                or filter.
              </p>

            </div>

          )}

        </section>

      </section>


      {/* ==================================================
          ORDER DETAILS MODAL
      ================================================== */}

      {selectedOrder && (

        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          onStatusChange={
            handleStatusChange
          }
          onWhatsApp={() =>
            openWhatsApp(
              selectedOrder
            )
          }
        />

      )}

    </main>
  );
}


// ======================================================
// TABLE HEADER
// ======================================================

function TableHeader({
  children,
}) {

  return (
    <p
      className="
        text-[9px]
        font-black
        uppercase
        tracking-wider
        text-[#9B92B4]
      "
    >
      {children}
    </p>
  );
}


// ======================================================
// ORDER CARD
// ======================================================

function OrderCard({
  order,
  onStatusChange,
  onView,
  onWhatsApp,
}) {

  const style =
    statusStyles[
      order.status
    ];

  const StatusIcon =
    style.icon;


  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="
        px-4
        py-4
        sm:px-5
      "
    >

      {/* ==================================================
          MOBILE / COMMON
      ================================================== */}

      <div
        className="
          grid
          gap-4
          lg:grid-cols-[1.3fr_1.3fr_0.8fr_0.9fr_1.1fr_40px]
          lg:items-center
        "
      >

        {/* ORDER */}

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
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#F0ECFF]
              text-[#6B4FD3]
            "
          >

            <Package
              size={17}
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
              #{order.id}
            </p>

            <p
              className="
                mt-1
                text-[9px]
                text-[#9B92B4]
              "
            >
              {order.date} • {order.time}
            </p>

          </div>

        </div>


        {/* CUSTOMER */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <UserRound
            size={15}
            className="
              shrink-0
              text-[#9B92B4]
            "
          />

          <div>

            <p
              className="
                text-xs
                font-bold
                text-[#211B38]
              "
            >
              {order.customer.name}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[#9B92B4]
              "
            >
              {order.customer.mobile}
            </p>

          </div>

        </div>


        {/* TOTAL */}

        <div>

          <p
            className="
              text-[9px]
              text-[#9B92B4]
              lg:hidden
            "
          >
            Total
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-black
              text-[#211B38]
            "
          >
            ₹{order.total}
          </p>

        </div>


        {/* PAYMENT */}

        <div>

          <p
            className="
              text-[9px]
              text-[#9B92B4]
              lg:hidden
            "
          >
            Payment
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              font-bold
              text-[#211B38]
            "
          >
            {order.paymentMethod}
          </p>

          <span
            className={`
              mt-1
              inline-block
              rounded-full
              px-2
              py-0.5
              text-[8px]
              font-black
              ${
                order.paymentStatus ===
                "Paid"
                  ? "bg-green-50 text-green-600"
                  : "bg-orange-50 text-orange-600"
              }
            `}
          >
            {order.paymentStatus}
          </span>

        </div>


        {/* STATUS */}

        <div>

          <p
            className="
              mb-1.5
              text-[9px]
              text-[#9B92B4]
              lg:hidden
            "
          >
            Order Status
          </p>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${style.bg}
                ${style.text}
              `}
            >

              <StatusIcon
                size={13}
              />

            </div>


            <select
              value={order.status}
              onChange={(e) =>
                onStatusChange(
                  order.id,
                  e.target.value
                )
              }
              className="
                min-w-0
                flex-1
                rounded-lg
                border
                border-[#E3DDF5]
                bg-white
                px-2
                py-2
                text-[9px]
                font-black
                text-[#211B38]
                outline-none
                focus:border-[#6B4FD3]
              "
            >

              {statusFlow.map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            gap-2
            lg:justify-end
          "
        >

          <button
            type="button"
            onClick={onWhatsApp}
            className="
              flex
              h-9
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-green-50
              text-[9px]
              font-black
              text-green-600
              transition
              hover:bg-green-100
              lg:w-9
              lg:flex-none
            "
            title="WhatsApp"
          >

            <MessageCircle
              size={14}
            />

            <span className="lg:hidden">
              WhatsApp
            </span>

          </button>


          <button
            type="button"
            onClick={onView}
            className="
              flex
              h-9
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#F0ECFF]
              text-[9px]
              font-black
              text-[#5B3FC4]
              transition
              hover:bg-[#E7E0FF]
              lg:w-9
              lg:flex-none
            "
            title="View Order"
          >

            <Eye size={14} />

            <span className="lg:hidden">
              View
            </span>

          </button>

        </div>

      </div>

    </motion.div>
  );
}


// ======================================================
// ORDER DETAILS MODAL
// ======================================================

function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
  onWhatsApp,
}) {

  const style =
    statusStyles[
      order.status
    ];

  const StatusIcon =
    style.icon;


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-[#211B38]/40
        px-4
        py-6
        backdrop-blur-sm
      "
    >

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="
          max-h-[92vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-[#EEE9FF]
            bg-white
            px-5
            py-4
          "
        >

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
              Order Details
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-black
                text-[#211B38]
              "
            >
              #{order.id}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-[#81799C]
              hover:bg-[#F5F2FF]
            "
          >

            <X size={18} />

          </button>

        </div>


        <div className="p-5">

          {/* ==================================================
              STATUS
          ================================================== */}

          <div
            className="
              rounded-2xl
              bg-[#FAF8FF]
              p-4
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
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
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${style.bg}
                    ${style.text}
                  `}
                >

                  <StatusIcon
                    size={19}
                  />

                </div>


                <div>

                  <p
                    className="
                      text-[9px]
                      text-[#9B92B4]
                    "
                  >
                    Current Status
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-black
                      text-[#211B38]
                    "
                  >
                    {order.status}
                  </p>

                </div>

              </div>


              <select
                value={order.status}
                onChange={(e) =>
                  onStatusChange(
                    order.id,
                    e.target.value
                  )
                }
                className="
                  h-10
                  rounded-xl
                  border
                  border-[#E2DCF4]
                  bg-white
                  px-3
                  text-[10px]
                  font-black
                  text-[#211B38]
                  outline-none
                  focus:border-[#6B4FD3]
                "
              >

                {statusFlow.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* ==================================================
              CUSTOMER
          ================================================== */}

          <div className="mt-5">

            <SectionTitle>
              Customer Information
            </SectionTitle>


            <div
              className="
                mt-3
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <InfoBox
                icon={UserRound}
                label="Customer"
                value={
                  order.customer.name
                }
              />

              <InfoBox
                icon={Phone}
                label="Mobile"
                value={
                  order.customer.mobile
                }
              />

              <InfoBox
                icon={MapPin}
                label="Delivery Address"
                value={
                  order.address
                }
                full
              />

            </div>

          </div>


          {/* ==================================================
              ITEMS
          ================================================== */}

          <div className="mt-6">

            <SectionTitle>
              Order Items
            </SectionTitle>


            <div
              className="
                mt-3
                divide-y
                divide-[#EEE9FF]
                rounded-xl
                border
                border-[#EEE9FF]
              "
            >

              {order.items.map(
                (item, index) => (

                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xs
                          font-black
                          text-[#211B38]
                        "
                      >
                        {item.name}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#9B92B4]
                        "
                      >
                        {item.quantity} ×{" "}
                        {item.count}
                      </p>

                    </div>


                    <p
                      className="
                        text-xs
                        font-black
                        text-[#211B38]
                      "
                    >
                      ₹
                      {item.price *
                        item.count}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* ==================================================
              PAYMENT
          ================================================== */}

          <div className="mt-6">

            <SectionTitle>
              Payment
            </SectionTitle>


            <div
              className="
                mt-3
                rounded-xl
                border
                border-[#EEE9FF]
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-[9px]
                      text-[#9B92B4]
                    "
                  >
                    Payment Method
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-bold
                      text-[#211B38]
                    "
                  >
                    {order.paymentMethod}
                  </p>

                </div>


                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-[9px]
                    font-black
                    ${
                      order.paymentStatus ===
                      "Paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }
                  `}
                >
                  {order.paymentStatus}
                </span>

              </div>


              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  border-t
                  border-[#EEE9FF]
                  pt-4
                "
              >

                <span
                  className="
                    text-xs
                    font-bold
                    text-[#81799C]
                  "
                >
                  Total Amount
                </span>

                <span
                  className="
                    text-xl
                    font-black
                    text-[#5B3FC4]
                  "
                >
                  ₹{order.total}
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div
            className="
              mt-6
              flex
              flex-col
              gap-2
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onWhatsApp}
              className="
                flex
                h-11
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-green-500
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-green-200/40
              "
            >

              <MessageCircle
                size={16}
              />

              Message on WhatsApp

            </button>


            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#DDD6F2]
                px-6
                text-xs
                font-bold
                text-[#81799C]
              "
            >
              Close
            </button>

          </div>

        </div>

      </motion.div>

    </div>
  );
}


// ======================================================
// SECTION TITLE
// ======================================================

function SectionTitle({
  children,
}) {

  return (
    <h3
      className="
        text-xs
        font-black
        text-[#211B38]
      "
    >
      {children}
    </h3>
  );
}


// ======================================================
// INFO BOX
// ======================================================

function InfoBox({
  icon: Icon,
  label,
  value,
  full,
}) {

  return (
    <div
      className={`
        flex
        gap-3
        rounded-xl
        bg-[#FAF8FF]
        p-3
        ${
          full
            ? "sm:col-span-2"
            : ""
        }
      `}
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

        <Icon size={15} />

      </div>


      <div
        className="
          min-w-0
        "
      >

        <p
          className="
            text-[9px]
            text-[#9B92B4]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-[10px]
            font-bold
            leading-4
            text-[#211B38]
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
}


export default Orders;