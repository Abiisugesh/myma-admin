import { motion } from "framer-motion";

import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";


// ======================================================
// DEMO PRODUCTS
// Later Java + MySQL API-la replace pannuvom
// ======================================================

const initialProducts = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    price: 120,
    stock: 85,
    unit: "1 kg",
    image: "🍎",
    status: "Active",
  },

  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 80,
    stock: 120,
    unit: "1 kg",
    image: "🍅",
    status: "Active",
  },

  {
    id: 3,
    name: "Fresh Milk",
    category: "Dairy",
    price: 62,
    stock: 45,
    unit: "1 L",
    image: "🥛",
    status: "Active",
  },

  {
    id: 4,
    name: "Bananas",
    category: "Fruits",
    price: 60,
    stock: 8,
    unit: "1 dozen",
    image: "🍌",
    status: "Active",
  },

  {
    id: 5,
    name: "Potatoes",
    category: "Vegetables",
    price: 40,
    stock: 0,
    unit: "1 kg",
    image: "🥔",
    status: "Inactive",
  },

  {
    id: 6,
    name: "Carrots",
    category: "Vegetables",
    price: 95,
    stock: 65,
    unit: "1 kg",
    image: "🥕",
    status: "Active",
  },
];


// ======================================================
// PRODUCTS
// ======================================================

function Products() {

  const navigate = useNavigate();

  const [products, setProducts] =
    useState(initialProducts);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [deleteProduct, setDeleteProduct] =
    useState(null);


  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = [
    "All",
    ...new Set(
      products.map(
        (product) => product.category
      )
    ),
  ];


  // ====================================================
  // FILTER
  // ====================================================

  const filteredProducts = useMemo(() => {

    return products.filter(
      (product) => {

        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          product.category === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  }, [
    products,
    search,
    category,
  ]);


  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = () => {

    if (!deleteProduct) {
      return;
    }

    setProducts(
      (currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !==
            deleteProduct.id
        )
    );

    setDeleteProduct(null);
  };


  // ====================================================
  // STOCK STATUS
  // ====================================================

  const getStockStatus = (stock) => {

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-600",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-orange-50 text-orange-600",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-green-50 text-green-600",
    };
  };


  return (
    <div
      className="
        min-h-screen
        bg-[#F8F6FF]
      "
    >

      {/* ==========================================
          HEADER
      ========================================== */}

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
            flex
            h-20
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
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
              Products
            </h1>

          </div>


          {/* Add Product */}

          <motion.button
            type="button"
            whileHover={{
              scale: 1.02,
              y: -1,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={() =>
              navigate("/products/add")
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#5B3FC4]
              to-[#8B6CFF]
              px-4
              py-3
              text-xs
              font-black
              text-white
              shadow-lg
              shadow-purple-300/30
              sm:px-5
            "
          >

            <Plus size={17} />

            <span className="hidden sm:block">
              Add Product
            </span>

            <span className="sm:hidden">
              Add
            </span>

          </motion.button>

        </div>

      </header>


      {/* ==========================================
          CONTENT
      ========================================== */}

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

        {/* ========================================
            SUMMARY
        ======================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-4
          "
        >

          <SummaryCard
            title="Total Products"
            value={products.length}
            icon={Box}
          />

          <SummaryCard
            title="Active"
            value={
              products.filter(
                (product) =>
                  product.status ===
                  "Active"
              ).length
            }
            icon={CheckCircle2}
          />

          <SummaryCard
            title="Low Stock"
            value={
              products.filter(
                (product) =>
                  product.stock > 0 &&
                  product.stock <= 10
              ).length
            }
            icon={AlertTriangle}
          />

          <SummaryCard
            title="Out of Stock"
            value={
              products.filter(
                (product) =>
                  product.stock === 0
              ).length
            }
            icon={PackagePlus}
          />

        </div>


        {/* ========================================
            SEARCH + FILTER
        ======================================== */}

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

            {/* Search */}

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
                placeholder="Search products..."
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
                  transition
                  placeholder:text-[#AAA3BC]
                  focus:border-[#6B4FD3]
                  focus:ring-4
                  focus:ring-[#6B4FD3]/10
                "
              />

            </div>


            {/* Category */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  hidden
                  text-[10px]
                  font-bold
                  text-[#9B92B4]
                  sm:block
                "
              >
                Category
              </span>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  min-w-40
                  rounded-xl
                  border
                  border-[#E2DCF4]
                  bg-[#FCFBFF]
                  px-3
                  text-xs
                  font-bold
                  text-[#211B38]
                  outline-none
                  focus:border-[#6B4FD3]
                "
              >

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>


        {/* ========================================
            PRODUCT TABLE
        ======================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-[#E5DFFF]
            bg-white
            shadow-sm
          "
        >

          {/* Table Header */}

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
                All Products
              </h2>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9B92B4]
                "
              >
                {filteredProducts.length} products
                found
              </p>

            </div>

          </div>


          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">

            <table
              className="
                w-full
                min-w-[850px]
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-[#F0ECF8]
                    bg-[#FBFAFF]
                  "
                >

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
                    Product
                  </th>

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
                    Category
                  </th>

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
                    Price
                  </th>

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
                    Stock
                  </th>

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
                    Status
                  </th>

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
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stockStatus =
                      getStockStatus(
                        product.stock
                      );

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="
                          border-b
                          border-[#F2EFF8]
                          last:border-0
                          hover:bg-[#FCFBFF]
                        "
                      >

                        {/* Product */}

                        <td className="px-5 py-4">

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
                                rounded-xl
                                bg-[#F0ECFF]
                                text-2xl
                              "
                            >
                              {product.image}
                            </div>

                            <div>

                              <p
                                className="
                                  text-xs
                                  font-black
                                  text-[#211B38]
                                "
                              >
                                {product.name}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[9px]
                                  text-[#9B92B4]
                                "
                              >
                                {product.unit}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Category */}

                        <td
                          className="
                            px-5
                            py-4
                            text-xs
                            font-semibold
                            text-[#81799C]
                          "
                        >
                          {product.category}
                        </td>


                        {/* Price */}

                        <td
                          className="
                            px-5
                            py-4
                            text-xs
                            font-black
                            text-[#5B3FC4]
                          "
                        >
                          ₹{product.price}
                        </td>


                        {/* Stock */}

                        <td className="px-5 py-4">

                          <span
                            className="
                              text-xs
                              font-black
                              text-[#211B38]
                            "
                          >
                            {product.stock}
                          </span>

                        </td>


                        {/* Status */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              flex-col
                              items-start
                              gap-1
                            "
                          >

                            <span
                              className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-[9px]
                                font-black
                                ${stockStatus.className}
                              `}
                            >
                              {stockStatus.label}
                            </span>

                            <span
                              className="
                                text-[9px]
                                font-bold
                                text-[#9B92B4]
                              "
                            >
                              {product.status}
                            </span>

                          </div>

                        </td>


                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              justify-end
                              gap-2
                            "
                          >

                            <ActionButton
                              icon={Edit3}
                              label="Edit"
                              onClick={() =>
                                navigate(
                                  `/products/edit/${product.id}`
                                )
                              }
                            />

                            <ActionButton
                              icon={Trash2}
                              label="Delete"
                              danger
                              onClick={() =>
                                setDeleteProduct(
                                  product
                                )
                              }
                            />

                          </div>

                        </td>

                      </motion.tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>


          {/* ======================================
              MOBILE CARDS
          ====================================== */}

          <div
            className="
              divide-y
              divide-[#F0ECF8]
              md:hidden
            "
          >

            {filteredProducts.map(
              (product) => {

                const stockStatus =
                  getStockStatus(
                    product.stock
                  );

                return (
                  <motion.div
                    key={product.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      {/* Image */}

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#F0ECFF]
                          text-3xl
                        "
                      >
                        {product.image}
                      </div>


                      {/* Details */}

                      <div className="min-w-0 flex-1">

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
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
                              {product.name}
                            </h3>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#9B92B4]
                              "
                            >
                              {product.category}
                              {" • "}
                              {product.unit}
                            </p>

                          </div>

                          <p
                            className="
                              text-sm
                              font-black
                              text-[#5B3FC4]
                            "
                          >
                            ₹{product.price}
                          </p>

                        </div>


                        {/* Stock */}

                        <div
                          className="
                            mt-3
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
                              Stock
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                font-black
                                text-[#211B38]
                              "
                            >
                              {product.stock}
                            </p>

                          </div>


                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-[9px]
                              font-black
                              ${stockStatus.className}
                            `}
                          >
                            {stockStatus.label}
                          </span>

                        </div>


                        {/* Actions */}

                        <div
                          className="
                            mt-3
                            flex
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/products/edit/${product.id}`
                              )
                            }
                            className="
                              flex
                              flex-1
                              items-center
                              justify-center
                              gap-1.5
                              rounded-lg
                              border
                              border-[#E3DDF5]
                              py-2
                              text-[10px]
                              font-bold
                              text-[#5B3FC4]
                            "
                          >

                            <Edit3 size={13} />

                            Edit

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              setDeleteProduct(
                                product
                              )
                            }
                            className="
                              flex
                              flex-1
                              items-center
                              justify-center
                              gap-1.5
                              rounded-lg
                              border
                              border-red-100
                              bg-red-50
                              py-2
                              text-[10px]
                              font-bold
                              text-red-500
                            "
                          >

                            <Trash2 size={13} />

                            Delete

                          </button>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>


          {/* Empty */}

          {filteredProducts.length === 0 && (

            <div
              className="
                flex
                min-h-60
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
                "
              >
                <Search
                  size={25}
                  className="text-[#6B4FD3]"
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
                No products found
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9B92B4]
                "
              >
                Try changing your search
                or category filter.
              </p>

            </div>

          )}

        </section>

      </main>


      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      {deleteProduct && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#211B38]/40
            px-4
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
              w-full
              max-w-sm
              rounded-2xl
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
                rounded-xl
                bg-red-50
                text-red-500
              "
            >
              <Trash2 size={20} />
            </div>


            <h3
              className="
                mt-5
                text-lg
                font-black
                text-[#211B38]
              "
            >
              Delete Product?
            </h3>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#81799C]
              "
            >
              Are you sure you want to delete{" "}
              <span
                className="
                  font-black
                  text-[#211B38]
                "
              >
                {deleteProduct.name}
              </span>
              ? This action cannot be undone.
            </p>


            <div
              className="
                mt-6
                flex
                gap-2
              "
            >

              <button
                type="button"
                onClick={() =>
                  setDeleteProduct(null)
                }
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E3DDF5]
                  py-3
                  text-xs
                  font-bold
                  text-[#81799C]
                "
              >
                <X size={15} />
                Cancel
              </button>


              <button
                type="button"
                onClick={handleDelete}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  py-3
                  text-xs
                  font-black
                  text-white
                "
              >
                <Trash2 size={15} />
                Delete
              </button>

            </div>

          </motion.div>

        </div>

      )}

    </div>
  );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  title,
  value,
  icon: Icon,
}) {

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="
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
          <Icon size={18} />
        </div>

      </div>

      <p
        className="
          mt-4
          text-[9px]
          font-bold
          uppercase
          tracking-wider
          text-[#9B92B4]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-xl
          font-black
          text-[#211B38]
          sm:text-2xl
        "
      >
        {value}
      </p>

    </motion.div>
  );
}


// ======================================================
// ACTION BUTTON
// ======================================================

function ActionButton({
  icon: Icon,
  label,
  danger,
  onClick,
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        transition
        ${
          danger
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-[#F0ECFF] text-[#5B3FC4] hover:bg-[#E7E0FF]"
        }
      `}
    >
      <Icon size={15} />
    </button>
  );
}


export default Products;