import { motion } from "framer-motion";







import {



  ArrowLeft,



  Search,



  Users,



  Phone,



  Mail,



  ShieldCheck,



  ShieldX,



  RefreshCw,



  Eye,



  X,



  UserRound,





  ShoppingBag,



  IndianRupee,



  Package,



  CreditCard,



  CalendarDays,



} from "lucide-react";







import {



  useEffect,



  useMemo,



  useState,



} from "react";







import { useNavigate } from "react-router-dom";







import api from "../api/api";











function Customers() {







  const navigate = useNavigate();











  // =====================================================



  // CUSTOMERS



  // =====================================================







  const [



    customers,



    setCustomers,



  ] = useState([]);











  // =====================================================



  // LOADING



  // =====================================================







  const [



    loading,



    setLoading,



  ] = useState(true);











  // =====================================================



  // ERROR



  // =====================================================







  const [



    error,



    setError,



  ] = useState("");











  // =====================================================



  // SEARCH



  // =====================================================







  const [



    search,



    setSearch,



  ] = useState("");











  // =====================================================



  // STATUS FILTER



  // =====================================================







  const [



    statusFilter,



    setStatusFilter,



  ] = useState("ALL");











  // =====================================================



  // SELECTED CUSTOMER



  // =====================================================







  const [



    selectedCustomer,



    setSelectedCustomer,



  ] = useState(null);







  const [



    customerOrders,



    setCustomerOrders,



  ] = useState([]);







  const [



    ordersLoading,



    setOrdersLoading,



  ] = useState(false);







  const [



    ordersError,



    setOrdersError,



  ] = useState("");











  // =====================================================



  // LOAD CUSTOMERS



  // =====================================================







  const loadCustomers = async () => {







    try {







      setLoading(true);







      setError("");











      const response = await api.get(



        "/admin/customers"



      );











      const data =



        Array.isArray(response?.data)



          ? response.data



          : [];











      setCustomers(data);







    } catch (err) {







      console.error(



        "Customer API error:",



        err



      );











      setError(



        err?.response?.data?.message ||



        err?.response?.data?.error ||



        err?.message ||



        "Unable to load customers."



      );







    } finally {







      setLoading(false);







    }







  };











  // =====================================================



  // LOAD ON PAGE OPEN



  // =====================================================







  useEffect(() => {







    loadCustomers();







  }, []);











  // =====================================================



  // FILTER CUSTOMERS



  // =====================================================







  const filteredCustomers = useMemo(() => {







    const searchValue =



      search



        .trim()



        .toLowerCase();











    return customers.filter(



      (customer) => {







        const name =



          String(



            customer?.name || ""



          ).toLowerCase();











        const phone =



          String(



            customer?.phoneNumber || ""



          ).toLowerCase();











        const email =



          String(



            customer?.email || ""



          ).toLowerCase();











        const id =



          String(



            customer?.id || ""



          ).toLowerCase();











        const matchesSearch =



          !searchValue ||



          name.includes(searchValue) ||



          phone.includes(searchValue) ||



          email.includes(searchValue) ||



          id.includes(searchValue);











        const active =



          customer?.active !== false;











        const matchesStatus =



          statusFilter === "ALL" ||







          (



            statusFilter === "ACTIVE" &&



            active



          ) ||







          (



            statusFilter === "INACTIVE" &&



            !active



          );











        return (



          matchesSearch &&



          matchesStatus



        );







      }



    );







  }, [



    customers,



    search,



    statusFilter,



  ]);











  // =====================================================



  // ACTIVE COUNT



  // =====================================================







  const activeCount =



    customers.filter(



      (customer) =>



        customer?.active !== false



    ).length;











  // =====================================================



  // INACTIVE COUNT



  // =====================================================







  const inactiveCount =



    customers.filter(



      (customer) =>



        customer?.active === false



    ).length;











  // =====================================================



  // DATE FORMAT



  // =====================================================







  const formatDate = (dateValue) => {







    if (!dateValue) {



      return "—";



    }











    const date =



      new Date(dateValue);











    if (



      Number.isNaN(



        date.getTime()



      )



    ) {



      return "—";



    }











    return date.toLocaleDateString(



      "en-IN",



      {



        day: "2-digit",



        month: "short",



        year: "numeric",



      }



    );







  };











  // =====================================================



  // PHONE FORMAT



  // =====================================================







  const formatPhone = (phone) => {







    if (!phone) {



      return "No phone";



    }







    return phone;







  };











  // =====================================================



  // OPEN CUSTOMER



  // =====================================================







  const openCustomer = async (customer) => {







    setSelectedCustomer(customer);



    setCustomerOrders([]);



    setOrdersError("");



    setOrdersLoading(true);







    try {







      const response = await api.get(



        `/admin/orders/customer/${customer?.id}`



      );







      const orders =



        Array.isArray(response?.data)



          ? response.data



          : [];







      setCustomerOrders(orders);







    } catch (err) {







      console.error("Customer orders error:", err);







      setOrdersError(



        err?.response?.data?.message ||



        err?.response?.data?.error ||



        err?.message ||



        "Unable to load customer orders."



      );







    } finally {



      setOrdersLoading(false);



    }



  };











  // =====================================================



  // CLOSE CUSTOMER



  // =====================================================







  const closeCustomer = () => {







    setSelectedCustomer(null);



    setCustomerOrders([]);



    setOrdersError("");



    setOrdersLoading(false);







  };











  // =====================================================



  // =====================================================

  // PURCHASE SUMMARY HELPERS

  // =====================================================







  const totalOrders = customerOrders.length;







  const totalPurchasedAmount = customerOrders.reduce(



    (sum, order) =>



      sum + Number(order?.totalAmount || 0),



    0



  );







  const formatCurrency = (amount) => {



    return `₹${Number(amount || 0).toLocaleString("en-IN", {



      minimumFractionDigits: 2,



      maximumFractionDigits: 2,



    })}`;



  };







  // RENDER



  // =====================================================







  return (







    <main



      className="



        min-h-screen



        bg-[#F8F6FF]



        px-4



        py-6



        sm:px-6



        lg:px-8



      "



    >







      <div



        className="



          mx-auto



          max-w-[1500px]



        "



      >



















        <motion.div



          initial={{



            opacity: 0,



            y: 15,



          }}



          animate={{



            opacity: 1,



            y: 0,



          }}



          className="mb-6"



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







            {/**\\\*** LEFT SIDE **\\\***/}







            <div



              className="



                flex



                items-center



                gap-3



              "



            >







              {/**\\\*** BACK BUTTON **\\\***/}







              <button



                type="button"



                onClick={() =>



                  navigate("/dashboard")



                }



                title="Back to Dashboard"



                className="



                  flex



                  h-10



                  w-10



                  shrink-0



                  items-center



                  justify-center



                  rounded-xl



                  border



                  border-[#E5DFFF]



                  bg-white



                  text-[#6B4FD3]



                  shadow-sm



                  transition



                  hover:bg-[#F0ECFF]



                  hover:shadow



                  active:scale-95



                "



              >







                <ArrowLeft



                  size={18}



                />







              </button>











              {/**\\\*** TITLE **\\\***/}







              <div>







                <p



                  className="



                    text-[9px]



                    font-black



                    uppercase



                    tracking-[0.2em]



                    text-[#7C5CFC]



                  "



                >



                  MYMA Supermarket



                </p>











                <h1



                  className="



                    mt-1



                    text-2xl



                    font-black



                    text-[#211B38]



                    sm:text-3xl



                  "



                >



                  Customers



                </h1>











                <p



                  className="



                    mt-1



                    text-xs



                    text-[#81799C]



                  "



                >



                  Manage all registered MYMA customers



                </p>







              </div>







            </div>











            {/**\\\*** REFRESH **\\\***/}







            <button



              type="button"



              onClick={loadCustomers}



              disabled={loading}



              className="



                flex



                items-center



                justify-center



                gap-2



                rounded-xl



                border



                border-[#E5DFFF]



                bg-white



                px-4



                py-2.5



                text-xs



                font-black



                text-[#6B4FD3]



                shadow-sm



                transition



                hover:bg-[#F8F6FF]



                disabled:opacity-50



              "



            >







              <RefreshCw



                size={15}



                className={



                  loading



                    ? "animate-spin"



                    : ""



                }



              />







              Refresh







            </button>







          </div>







        </motion.div>


















        <div



          className="



            mb-6



            grid



            grid-cols-1



            gap-4



            sm:grid-cols-3



          "



        >







          <SummaryCard



            icon={Users}



            title="Total Customers"



            value={customers.length}



          />











          <SummaryCard



            icon={ShieldCheck}



            title="Active Customers"



            value={activeCount}



          />











          <SummaryCard



            icon={ShieldX}



            title="Inactive Customers"



            value={inactiveCount}



          />







        </div>











   







        <div



          className="



            mb-5



            rounded-2xl



            border



            border-[#E5DFFF]



            bg-white



            p-4



            shadow-sm



          "



        >







          <div



            className="



              flex



              flex-col



              gap-3



              lg:flex-row



              lg:items-center



            "



          >







            {/**\\\*** SEARCH **\\\***/}







            <div



              className="



                relative



                flex-1



              "



            >







              <Search



                size={17}



                className="



                  absolute



                  left-4



                  top-1/2



                  -translate-y-1/2



                  text-[#A29AB8]



                "



              />











              <input



                type="text"



                value={search}



                onChange={(event) =>



                  setSearch(



                    event.target.value



                  )



                }



                placeholder="Search by name, phone, email or ID..."



                className="



                  h-11



                  w-full



                  rounded-xl



                  border



                  border-[#E5DFFF]



                  bg-[#FBFAFF]



                  pl-11



                  pr-4



                  text-xs



                  font-semibold



                  text-[#211B38]



                  outline-none



                  transition



                  placeholder:text-[#B0A8C5]



                  focus:border-[#8B6CFF]



                  focus:ring-2



                  focus:ring-[#8B6CFF]/10



                "



              />







            </div>











            {/**\\\*** STATUS **\\\***/}







            <select



              value={statusFilter}



              onChange={(event) =>



                setStatusFilter(



                  event.target.value



                )



              }



              className="



                h-11



                rounded-xl



                border



                border-[#E5DFFF]



                bg-[#FBFAFF]



                px-4



                text-xs



                font-bold



                text-[#211B38]



                outline-none



                focus:border-[#8B6CFF]



              "



            >







              <option value="ALL">



                All Customers



              </option>







              <option value="ACTIVE">



                Active



              </option>







              <option value="INACTIVE">



                Inactive



              </option>







            </select>







          </div>







        </div>

















        {error && (







          <div



            className="



              mb-5



              rounded-2xl



              border



              border-red-100



              bg-red-50



              px-4



              py-4



              text-xs



              font-bold



              text-red-600



            "



          >







            {error}







          </div>







        )}



















        <div



          className="



            overflow-hidden



            rounded-2xl



            border



            border-[#E5DFFF]



            bg-white



            shadow-sm



          "



        >







          {/**\\\*** TABLE HEADER **\\\***/}







          <div



            className="



              flex



              items-center



              justify-between



              border-b



              border-[#EEE9FF]



              px-5



              py-4



            "



          >







            <div>







              <h2



                className="



                  text-sm



                  font-black



                  text-[#211B38]



                "



              >



                Customer List



              </h2>











              <p



                className="



                  mt-1



                  text-[9px]



                  text-[#9B92B4]



                "



              >



                Showing{" "}



                {filteredCustomers.length}



                {" "}



                customers



              </p>







            </div>







          </div>



















          {loading && (







            <div



              className="



                flex



                min-h-[300px]



                items-center



                justify-center



              "



            >







              <RefreshCw



                size={28}



                className="



                  animate-spin



                  text-[#6B4FD3]



                "



              />







            </div>







          )}

















          {!loading &&



            filteredCustomers.length === 0 && (







              <div



                className="



                  flex



                  min-h-[300px]



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



                    h-14



                    w-14



                    items-center



                    justify-center



                    rounded-2xl



                    bg-[#F0ECFF]



                    text-[#6B4FD3]



                  "



                >







                  <Users



                    size={24}



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



                  No customers found



                </h3>











                <p



                  className="



                    mt-1



                    text-xs



                    text-[#9B92B4]



                  "



                >



                  Try changing your search or filter.



                </p>







              </div>







            )}



















          {!loading &&



            filteredCustomers.length > 0 && (







              <div



                className="



                  hidden



                  overflow-x-auto



                  md:block



                "



              >







                <table



                  className="



                    w-full



                    min-w-[900px]



                  "



                >







                  <thead>







                    <tr



                      className="



                        border-b



                        border-[#EEE9FF]



                        bg-[#FBFAFF]



                      "



                    >







                      <TableHeader>



                        Customer



                      </TableHeader>







                      <TableHeader>



                        Phone



                      </TableHeader>







                      <TableHeader>



                        Email



                      </TableHeader>







                      <TableHeader>



                        Status



                      </TableHeader>







                      <TableHeader>



                        Joined



                      </TableHeader>







                      <th



                        className="



                          px-5



                          py-3



                          text-right



                          text-[9px]



                          font-black



                          uppercase



                          tracking-wider



                          text-[#9B92B4]



                        "



                      >



                        Action



                      </th>







                    </tr>







                  </thead>











                  <tbody



                    className="



                      divide-y



                      divide-[#F0ECF8]



                    "



                  >







                    {filteredCustomers.map(



                      (customer) => {







                        const active =



                          customer?.active !== false;











                        return (







                          <tr



                            key={customer.id}



                            className="



                              transition



                              hover:bg-[#FCFBFF]



                            "



                          >







                            {/**\\\*** CUSTOMER **\\\***/}







                            <td



                              className="



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







                                <CustomerAvatar />











                                <div>







                                  <p



                                    className="



                                      text-xs



                                      font-black



                                      text-[#211B38]



                                    "



                                  >



                                    {customer?.name ||



                                      "MYMA Customer"}



                                  </p>











                                  <p



                                    className="



                                      mt-1



                                      text-[9px]



                                      text-[#9B92B4]



                                    "



                                  >



                                    ID: #{customer?.id}



                                  </p>







                                </div>







                              </div>







                            </td>











                            {/**\\\*** PHONE **\\\***/}







                            <td



                              className="



                                px-5



                                py-4



                              "



                            >







                              <div



                                className="



                                  flex



                                  items-center



                                  gap-2



                                  text-xs



                                  font-semibold



                                  text-[#514A67]



                                "



                              >







                                <Phone



                                  size={14}



                                  className="



                                    text-[#8B6CFF]



                                  "



                                />







                                {formatPhone(



                                  customer?.phoneNumber



                                )}







                              </div>







                            </td>











                            {/**\\\*** EMAIL **\\\***/}







                            <td



                              className="



                                px-5



                                py-4



                              "



                            >







                              <div



                                className="



                                  flex



                                  max-w-[220px]



                                  items-center



                                  gap-2



                                  truncate



                                  text-xs



                                  font-semibold



                                  text-[#514A67]



                                "



                              >







                                <Mail



                                  size={14}



                                  className="



                                    shrink-0



                                    text-[#8B6CFF]



                                  "



                                />











                                <span



                                  className="



                                    truncate



                                  "



                                >



                                  {customer?.email ||



                                    "No email"}



                                </span>







                              </div>







                            </td>











                            {/**\\\*** STATUS **\\\***/}







                            <td



                              className="



                                px-5



                                py-4



                              "



                            >







                              <StatusBadge



                                active={active}



                              />







                            </td>











                            {/**\\\*** JOINED **\\\***/}







                            <td



                              className="



                                px-5



                                py-4



                                text-xs



                                font-semibold



                                text-[#81799C]



                              "



                            >







                              {formatDate(



                                customer?.createdAt



                              )}







                            </td>











                            {/**\\\*** ACTION **\\\***/}







                            <td



                              className="



                                px-5



                                py-4



                                text-right



                              "



                            >







                              <button



                                type="button"



                                onClick={() =>



                                  openCustomer(



                                    customer



                                  )



                                }



                                className="



                                  inline-flex



                                  items-center



                                  gap-1.5



                                  rounded-lg



                                  bg-[#F0ECFF]



                                  px-3



                                  py-2



                                  text-[9px]



                                  font-black



                                  text-[#6B4FD3]



                                  transition



                                  hover:bg-[#E5DDFF]



                                "



                              >







                                <Eye



                                  size={13}



                                />







                                View







                              </button>







                            </td>







                          </tr>







                        );







                      }



                    )}







                  </tbody>







                </table>







              </div>







            )}



















          {!loading &&



            filteredCustomers.length > 0 && (







              <div



                className="



                  divide-y



                  divide-[#F0ECF8]



                  md:hidden



                "



              >







                {filteredCustomers.map(



                  (customer) => {







                    const active =



                      customer?.active !== false;











                    return (







                      <div



                        key={customer.id}



                        className="p-4"



                      >







                        <div



                          className="



                            flex



                            items-start



                            justify-between



                            gap-3



                          "



                        >







                          <div



                            className="



                              flex



                              min-w-0



                              items-center



                              gap-3



                            "



                          >







                            <CustomerAvatar />











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



                                {customer?.name ||



                                  "MYMA Customer"}



                              </p>











                              <p



                                className="



                                  mt-1



                                  text-[9px]



                                  text-[#9B92B4]



                                "



                              >



                                ID: #{customer?.id}



                              </p>







                            </div>







                          </div>











                          <StatusBadge



                            active={active}



                            mobile



                          />







                        </div>











                        <div



                          className="



                            mt-4



                            space-y-2



                          "



                        >







                          <div



                            className="



                              flex



                              items-center



                              gap-2



                              text-xs



                              text-[#81799C]



                            "



                          >







                            <Phone



                              size={13}



                            />







                            {formatPhone(



                              customer?.phoneNumber



                            )}







                          </div>











                          <div



                            className="



                              flex



                              items-center



                              gap-2



                              truncate



                              text-xs



                              text-[#81799C]



                            "



                          >







                            <Mail



                              size={13}



                            />











                            <span



                              className="



                                truncate



                              "



                            >



                              {customer?.email ||



                                "No email"}



                            </span>







                          </div>











                          <div



                            className="



                              flex



                              items-center



                              gap-2



                              text-xs



                              text-[#81799C]



                            "



                          >







                            <Users



                              size={13}



                            />







                            Joined{" "}



                            {formatDate(



                              customer?.createdAt



                            )}







                          </div>







                        </div>











                        <button



                          type="button"



                          onClick={() =>



                            openCustomer(



                              customer



                            )



                          }



                          className="



                            mt-4



                            flex



                            w-full



                            items-center



                            justify-center



                            gap-2



                            rounded-xl



                            bg-[#F0ECFF]



                            py-2.5



                            text-[10px]



                            font-black



                            text-[#6B4FD3]



                            transition



                            hover:bg-[#E5DDFF]



                          "



                        >







                          <Eye



                            size={14}



                          />







                          View Customer







                        </button>







                      </div>







                    );







                  }



                )}







              </div>







            )}







        </div>







      </div>











      {/* =================================================

          CUSTOMER DETAILS MODAL

      ================================================= */}



      {selectedCustomer && (



        <div

          className="

            fixed

            inset-0

            z-[100]

            flex

            items-center

            justify-center

            bg-[#211B38]/50

            p-4

            backdrop-blur-sm

          "

          onClick={closeCustomer}

        >



          <motion.div

            initial={{ opacity: 0, scale: 0.95 }}

            animate={{ opacity: 1, scale: 1 }}

            onClick={(event) => event.stopPropagation()}

            className="

              w-full max-w-4xl max-h-[90vh] overflow-hidden

              rounded-3xl bg-white shadow-2xl

            "

          >



            <div

              className="

                flex items-center justify-between border-b

                border-[#EEE9FF] px-5 py-4

              "

            >

              <div>

                <p className="text-[9px] font-black uppercase tracking-wider text-[#7C5CFC]">

                  Customer Details

                </p>

                <h2 className="mt-1 text-lg font-black text-[#211B38]">

                  {selectedCustomer?.name || "MYMA Customer"}

                </h2>

              </div>



              <button

                type="button"

                onClick={closeCustomer}

                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F2FF] text-[#6B4FD3] transition hover:bg-[#EDE8FF]"

              >

                <X size={17} />

              </button>

            </div>



            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">



              <div className="space-y-3">

                <DetailRow

                  icon={UserRound}

                  label="Customer ID"

                  value={`#${selectedCustomer?.id || "—"}`}

                />



                <DetailRow

                  icon={Phone}

                  label="Phone Number"

                  value={selectedCustomer?.phoneNumber || "Not available"}

                />



                <DetailRow

                  icon={Mail}

                  label="Email"

                  value={selectedCustomer?.email || "Not available"}

                />



                <DetailRow

                  icon={ShieldCheck}

                  label="Verification"

                  value={selectedCustomer?.verified ? "Verified" : "Not Verified"}

                />



                <DetailRow

                  icon={ShieldCheck}

                  label="Status"

                  value={selectedCustomer?.active !== false ? "Active" : "Inactive"}

                />



                <DetailRow

                  icon={Users}

                  label="Joined"

                  value={formatDate(selectedCustomer?.createdAt)}

                />

              </div>



              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">



                <div className="rounded-2xl border border-[#E5DFFF] bg-[#FBFAFF] p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">

                        Total Orders

                      </p>

                      <p className="mt-2 text-2xl font-black text-[#211B38]">

                        {ordersLoading ? "..." : totalOrders}

                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6B4FD3]">

                      <ShoppingBag size={19} />

                    </div>

                  </div>

                </div>



                <div className="rounded-2xl border border-[#E5DFFF] bg-[#FBFAFF] p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">

                        Total Purchased

                      </p>

                      <p className="mt-2 text-2xl font-black text-[#211B38]">

                        {ordersLoading ? "..." : formatCurrency(totalPurchasedAmount)}

                      </p>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6B4FD3]">

                      <IndianRupee size={19} />

                    </div>

                  </div>

                </div>

              </div>



              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-black text-[#211B38]">Order History</h3>

                    <p className="mt-1 text-[9px] text-[#9B92B4]">

                      All orders placed by this customer

                    </p>

                  </div>

                  <div className="rounded-full bg-[#F0ECFF] px-3 py-1.5 text-[9px] font-black text-[#6B4FD3]">

                    {totalOrders} Orders

                  </div>

                </div>



                {ordersLoading && (

                  <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-[#E5DFFF] bg-[#FBFAFF]">

                    <RefreshCw size={25} className="animate-spin text-[#6B4FD3]" />

                  </div>

                )}



                {!ordersLoading && ordersError && (

                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600">

                    {ordersError}

                  </div>

                )}



                {!ordersLoading && !ordersError && customerOrders.length === 0 && (

                  <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-[#E5DFFF] bg-[#FBFAFF] text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6B4FD3]">

                      <ShoppingBag size={20} />

                    </div>

                    <p className="mt-3 text-xs font-black text-[#211B38]">No orders found</p>

                    <p className="mt-1 text-[10px] text-[#9B92B4]">

                      This customer has not placed any orders yet.

                    </p>

                  </div>

                )}



                {!ordersLoading && !ordersError && customerOrders.length > 0 && (

                  <div className="space-y-3">

                    {customerOrders.map((order) => (

                      <div key={order?.id} className="overflow-hidden rounded-2xl border border-[#E5DFFF] bg-white">



                        <div className="border-b border-[#EEE9FF] bg-[#FBFAFF] px-4 py-3">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                              <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">

                                Order

                              </p>

                              <p className="mt-1 text-xs font-black text-[#211B38]">

                                #{order?.orderNumber || order?.id}

                              </p>

                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#81799C]">

                              <CalendarDays size={13} />

                              {formatDate(order?.createdAt)}

                            </div>

                          </div>

                        </div>



                        <div className="p-4">

                          {Array.isArray(order?.items) && order.items.length > 0 && (

                            <div className="space-y-2">

                              {order.items.map((item) => (

                                <div key={item?.id} className="rounded-xl bg-[#FBFAFF] p-3">

                                  <div className="flex items-start justify-between gap-3">

                                    <div className="min-w-0">

                                      <div className="flex items-center gap-2">

                                        <Package size={14} className="shrink-0 text-[#8B6CFF]" />

                                        <p className="truncate text-xs font-black text-[#211B38]">

                                          {item?.productName || "Product"}

                                        </p>

                                      </div>



                                      {(item?.variantName || item?.variantValue || item?.variantUnit) && (

                                        <p className="mt-1 ml-6 text-[9px] text-[#9B92B4]">

                                          {[item?.variantName, item?.variantValue, item?.variantUnit]

                                            .filter(Boolean)

                                            .join(" • ")}

                                        </p>

                                      )}

                                    </div>



                                    <p className="shrink-0 text-xs font-black text-[#211B38]">

                                      {formatCurrency(item?.totalPrice)}

                                    </p>

                                  </div>



                                  <div className="mt-2 ml-6 flex items-center gap-4 text-[9px] font-semibold text-[#81799C]">

                                    <span>Qty: {item?.quantity || 0}</span>

                                    <span>Price: {formatCurrency(item?.price)}</span>

                                  </div>

                                </div>

                              ))}

                            </div>

                          )}



                          <div className="mt-4 flex flex-col gap-3 border-t border-[#EEE9FF] pt-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-green-50 px-2.5 py-1.5 text-[8px] font-black text-green-600">

                                {order?.orderStatus || "Unknown"}

                              </span>



                              <span className="flex items-center gap-1 rounded-full bg-[#F0ECFF] px-2.5 py-1.5 text-[8px] font-black text-[#6B4FD3]">

                                <CreditCard size={11} />

                                {order?.paymentStatus || "Unknown"}

                              </span>

                            </div>



                            <div className="text-left sm:text-right">

                              <p className="text-[8px] font-black uppercase tracking-wider text-[#9B92B4]">

                                Order Total

                              </p>

                              <p className="mt-1 text-base font-black text-[#211B38]">

                                {formatCurrency(order?.totalAmount)}

                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>



            </div>

          </motion.div>

        </div>

      )}



    </main>







  );







}











// ======================================================



// TABLE HEADER



// ======================================================







function TableHeader({ children }) {







  return (







    <th



      className="



        px-5



        py-3



        text-left



        text-[9px]



        font-black



        uppercase



        tracking-wider



        text-[#9B92B4]



      "



    >



      {children}



    </th>







  );







}











// ======================================================



// CUSTOMER AVATAR



// ======================================================







function CustomerAvatar() {







  return (







    <div



      className="



        flex



        h-10



        w-10



        shrink-0



        items-center



        justify-center



        rounded-full



        bg-[#F0ECFF]



        text-[#6B4FD3]



      "



    >







      <UserRound



        size={17}



      />







    </div>







  );







}











// ======================================================



// STATUS BADGE



// ======================================================







function StatusBadge({



  active,



  mobile = false,



}) {







  if (mobile) {







    return (







      <span



        className={`

         shrink-0



          rounded-full



          px-2



          py-1



          text-[8px]



          font-black



          ${



            active



              ? "bg-green-50 text-green-600"



              : "bg-red-50 text-red-600"



          }



        `}



      >



        {active



          ? "Active"



          : "Inactive"}



      </span>







    );







  }











  return (







    <span



      className={`



        inline-flex



        items-center



        gap-1.5



        rounded-full



        px-2.5



        py-1.5



        text-[9px]



        font-black



        ${



          active



            ? "bg-green-50 text-green-600"



            : "bg-red-50 text-red-600"



        }



      `}



    >







      <span



        className={`



          h-1.5



          w-1.5



          rounded-full



          ${



            active



              ? "bg-green-500"



              : "bg-red-500"



          }



        `}



      />







      {active



        ? "Active"



        : "Inactive"}







    </span>







  );







}











// ======================================================



// SUMMARY CARD



// ======================================================







function SummaryCard({



  icon: Icon,



  title,



  value,



}) {







  return (







    <div



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



          items-center



          justify-between



        "



      >







        <div



          className="



            flex



            h-10



            w-10



            items-center



            justify-center



            rounded-xl



            bg-[#F0ECFF]



            text-[#6B4FD3]



          "



        >







          <Icon



            size={18}



          />







        </div>











        <p



          className="



            text-2xl



            font-black



            text-[#211B38]



          "



        >



          {value}



        </p>







      </div>











      <p



        className="



          mt-4



          text-[10px]



          font-bold



          text-[#9B92B4]



        "



      >



        {title}



      </p>







    </div>







  );







}











// ======================================================



// DETAIL ROW



// ======================================================







function DetailRow({



  icon: Icon,



  label,



  value,



}) {







  return (







    <div



      className="



        flex



        items-center



        gap-3



        rounded-xl



        bg-[#FBFAFF]



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



          rounded-lg



          bg-[#F0ECFF]



          text-[#6B4FD3]



        "



      >







        <Icon



          size={15}



        />







      </div>











      <div



        className="



          min-w-0



          flex-1



        "



      >







        <p



          className="



            text-[8px]



            font-black



            uppercase



            tracking-wider



            text-[#A29AB8]



          "



        >



          {label}



        </p>











        <p



          className="



            mt-1



            truncate



            text-xs



            font-bold



            text-[#211B38]



          "



        >



          {value}



        </p>







      </div>







    </div>







  );







}











export default Customers;