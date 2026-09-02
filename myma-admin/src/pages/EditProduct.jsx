import { motion } from "framer-motion";

import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


// ======================================================
// DEMO PRODUCTS
// Later Java + MySQL API-la replace pannuvom
// ======================================================

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    description:
      "Fresh and juicy apples, carefully selected for quality and taste.",
    stock: 85,
    status: "Active",
    image: "🍎",
    variants: [
      {
        id: 101,
        quantity: "250 g",
        price: 35,
      },
      {
        id: 102,
        quantity: "500 g",
        price: 65,
      },
      {
        id: 103,
        quantity: "1 kg",
        price: 120,
      },
    ],
  },

  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    description:
      "Fresh red tomatoes suitable for everyday cooking.",
    stock: 120,
    status: "Active",
    image: "🍅",
    variants: [
      {
        id: 201,
        quantity: "500 g",
        price: 40,
      },
      {
        id: 202,
        quantity: "1 kg",
        price: 80,
      },
    ],
  },

  {
    id: 3,
    name: "Fresh Milk",
    category: "Dairy",
    description:
      "Fresh dairy milk with rich taste and quality.",
    stock: 45,
    status: "Active",
    image: "🥛",
    variants: [
      {
        id: 301,
        quantity: "500 ml",
        price: 32,
      },
      {
        id: 302,
        quantity: "1 L",
        price: 62,
      },
    ],
  },

  {
    id: 4,
    name: "Bananas",
    category: "Fruits",
    description:
      "Fresh naturally ripened bananas.",
    stock: 8,
    status: "Active",
    image: "🍌",
    variants: [
      {
        id: 401,
        quantity: "6 pcs",
        price: 30,
      },
      {
        id: 402,
        quantity: "12 pcs",
        price: 60,
      },
    ],
  },

  {
    id: 5,
    name: "Potatoes",
    category: "Vegetables",
    description:
      "Fresh quality potatoes for everyday cooking.",
    stock: 0,
    status: "Inactive",
    image: "🥔",
    variants: [
      {
        id: 501,
        quantity: "500 g",
        price: 22,
      },
      {
        id: 502,
        quantity: "1 kg",
        price: 40,
      },
    ],
  },

  {
    id: 6,
    name: "Carrots",
    category: "Vegetables",
    description:
      "Fresh crunchy carrots with natural taste.",
    stock: 65,
    status: "Active",
    image: "🥕",
    variants: [
      {
        id: 601,
        quantity: "500 g",
        price: 48,
      },
      {
        id: 602,
        quantity: "1 kg",
        price: 95,
      },
    ],
  },
];


// ======================================================
// EDIT PRODUCT
// ======================================================

function EditProduct() {

  const navigate = useNavigate();

  const { id } = useParams();


  // ====================================================
  // FIND PRODUCT
  // ====================================================

  const product = products.find(
    (item) =>
      item.id === Number(id)
  );


  // ====================================================
  // FORM STATE
  // ====================================================

  const [productName, setProductName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [status, setStatus] =
    useState("Active");


  // ====================================================
  // IMAGE
  // ====================================================

  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");


  // ====================================================
  // VARIANTS
  // ====================================================

  const [variants, setVariants] =
    useState([]);


  // ====================================================
  // ERROR
  // ====================================================

  const [error, setError] =
    useState("");


  // ====================================================
  // LOAD PRODUCT
  // ====================================================

  useEffect(() => {

    if (!product) {
      return;
    }

    setProductName(
      product.name
    );

    setCategory(
      product.category
    );

    setDescription(
      product.description
    );

    setStock(
      String(product.stock)
    );

    setStatus(
      product.status
    );

    setImagePreview(
      product.image
    );

    setVariants(
      product.variants.map(
        (variant) => ({
          ...variant,
        })
      )
    );

  }, [id]);


  // ====================================================
  // IMAGE CHANGE
  // ====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  };


  // ====================================================
  // ADD VARIANT
  // ====================================================

  const addVariant = () => {

    setVariants(
      (currentVariants) => [
        ...currentVariants,
        {
          id:
            Date.now(),
          quantity: "",
          price: "",
        },
      ]
    );
  };


  // ====================================================
  // REMOVE VARIANT
  // ====================================================

  const removeVariant = (variantId) => {

    if (variants.length === 1) {
      return;
    }

    setVariants(
      (currentVariants) =>
        currentVariants.filter(
          (variant) =>
            variant.id !==
            variantId
        )
    );
  };


  // ====================================================
  // UPDATE VARIANT
  // ====================================================

  const updateVariant = (
    variantId,
    field,
    value
  ) => {

    setVariants(
      (currentVariants) =>
        currentVariants.map(
          (variant) =>
            variant.id ===
            variantId
              ? {
                  ...variant,
                  [field]:
                    value,
                }
              : variant
        )
    );
  };


  // ====================================================
  // SAVE
  // ====================================================

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");


    // -----------------------------------------------
    // PRODUCT VALIDATION
    // -----------------------------------------------

    if (!productName.trim()) {

      setError(
        "Please enter the product name."
      );

      return;
    }


    if (!category) {

      setError(
        "Please select a category."
      );

      return;
    }


    if (!description.trim()) {

      setError(
        "Please enter the product description."
      );

      return;
    }


    // -----------------------------------------------
    // VARIANT VALIDATION
    // -----------------------------------------------

    const invalidVariant =
      variants.some(
        (variant) =>
          !variant.quantity.trim() ||
          !variant.price ||
          Number(variant.price) <= 0
      );


    if (invalidVariant) {

      setError(
        "Please enter quantity and valid price for every variant."
      );

      return;
    }


    // -----------------------------------------------
    // STOCK VALIDATION
    // -----------------------------------------------

    if (
      stock === "" ||
      Number(stock) < 0
    ) {

      setError(
        "Please enter a valid stock quantity."
      );

      return;
    }


    // -----------------------------------------------
    // UPDATED PRODUCT
    // -----------------------------------------------

    const updatedProduct = {

      id: Number(id),

      name:
        productName.trim(),

      category,

      description:
        description.trim(),

      stock:
        Number(stock),

      status,

      image,

      imagePreview,

      variants:
        variants.map(
          (variant) => ({
            id: variant.id,

            quantity:
              variant.quantity.trim(),

            price:
              Number(
                variant.price
              ),
          })
        ),

    };


    // -----------------------------------------------
    // TEMPORARY
    // Later Java + MySQL
    // -----------------------------------------------

    console.log(
      "Updated Product:",
      updatedProduct
    );


    alert(
      "Product updated successfully!"
    );


    navigate(
      "/products"
    );
  };


  // ====================================================
  // PRODUCT NOT FOUND
  // ====================================================

  if (!product) {

    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#F8F6FF]
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-sm
            rounded-2xl
            border
            border-[#E5DFFF]
            bg-white
            p-6
            text-center
            shadow-sm
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-500
            "
          >
            <X size={25} />
          </div>

          <h2
            className="
              mt-5
              text-lg
              font-black
              text-[#211B38]
            "
          >
            Product Not Found
          </h2>

          <p
            className="
              mt-2
              text-xs
              text-[#81799C]
            "
          >
            The product you are trying
            to edit does not exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-5
              rounded-xl
              bg-[#5B3FC4]
              px-5
              py-3
              text-xs
              font-black
              text-white
            "
          >
            Back to Products
          </button>

        </div>

      </main>
    );
  }


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
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <button
            type="button"
            onClick={() =>
              navigate("/products")
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
              "
            >
              Edit Product
            </h1>

          </div>

        </div>

      </header>


      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
        className="
          mx-auto
          max-w-6xl
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
        "
      >

        {/* ==================================================
            ERROR
        ================================================== */}

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
              mb-5
              flex
              items-center
              justify-between
              gap-3
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-xs
              font-bold
              text-red-600
            "
          >

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="
                shrink-0
                text-red-400
              "
            >
              <X size={16} />
            </button>

          </motion.div>

        )}


        <div
          className="
            grid
            gap-6
            lg:grid-cols-[340px_1fr]
          "
        >

          {/* ==================================================
              IMAGE
          ================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-[#E5DFFF]
              bg-white
              p-5
              shadow-sm
            "
          >

            <div className="mb-4">

              <h2
                className="
                  text-sm
                  font-black
                  text-[#211B38]
                "
              >
                Product Image
              </h2>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9B92B4]
                "
              >
                Change the product image if needed
              </p>

            </div>


            <label
              className="
                group
                relative
                flex
                aspect-square
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border-2
                border-dashed
                border-[#DCD4F5]
                bg-[#FBFAFF]
                transition
                hover:border-[#8B6CFF]
              "
            >

              {/* Emoji preview */}

              {imagePreview ? (

                <>

                  {typeof imagePreview ===
                    "string" &&
                  imagePreview.startsWith(
                    "blob:"
                  ) ? (

                    <img
                      src={imagePreview}
                      alt="Product"
                      className="
                        h-full
                        w-full
                        object-contain
                        p-5
                      "
                    />

                  ) : (

                    <div
                      className="
                        text-7xl
                      "
                    >
                      {imagePreview}
                    </div>

                  )}


                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      bg-[#211B38]/70
                      px-4
                      py-3
                      text-center
                      text-[10px]
                      font-bold
                      text-white
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  >
                    Change Image
                  </div>

                </>

              ) : (

                <div
                  className="
                    flex
                    flex-col
                    items-center
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

                    <ImagePlus
                      size={25}
                    />

                  </div>

                  <p
                    className="
                      mt-4
                      text-xs
                      font-black
                      text-[#211B38]
                    "
                  >
                    Upload Product Image
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-[#9B92B4]
                    "
                  >
                    PNG, JPG or WEBP
                  </p>

                </div>

              )}


              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>


            {image && (

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#F7F4FF]
                  px-3
                  py-2
                "
              >

                <Upload
                  size={13}
                  className="text-[#6B4FD3]"
                />

                <span
                  className="
                    truncate
                    text-[9px]
                    font-semibold
                    text-[#81799C]
                  "
                >
                  {image.name}
                </span>

              </div>

            )}

          </section>


          {/* ==================================================
              DETAILS
          ================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                BASIC INFO
            ================================================== */}

            <section
              className="
                rounded-2xl
                border
                border-[#E5DFFF]
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >

              <div className="mb-5">

                <h2
                  className="
                    text-sm
                    font-black
                    text-[#211B38]
                  "
                >
                  Product Information
                </h2>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-[#9B92B4]
                  "
                >
                  Update your product details
                </p>

              </div>


              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >

                {/* NAME */}

                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-[#211B38]
                    "
                  >
                    Product Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    value={productName}
                    onChange={(e) =>
                      setProductName(
                        e.target.value
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#E2DCF4]
                      bg-[#FCFBFF]
                      px-4
                      text-xs
                      font-medium
                      text-[#211B38]
                      outline-none
                      focus:border-[#6B4FD3]
                      focus:ring-4
                      focus:ring-[#6B4FD3]/10
                    "
                  />

                </div>


                {/* CATEGORY */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-[#211B38]
                    "
                  >
                    Category
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#E2DCF4]
                      bg-[#FCFBFF]
                      px-4
                      text-xs
                      font-medium
                      text-[#211B38]
                      outline-none
                      focus:border-[#6B4FD3]
                    "
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Fruits">
                      Fruits
                    </option>

                    <option value="Vegetables">
                      Vegetables
                    </option>

                    <option value="Dairy">
                      Dairy
                    </option>

                    <option value="Groceries">
                      Groceries
                    </option>

                    <option value="Snacks">
                      Snacks
                    </option>

                    <option value="Beverages">
                      Beverages
                    </option>

                  </select>

                </div>


                {/* STOCK */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-[#211B38]
                    "
                  >
                    Stock
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) =>
                      setStock(
                        e.target.value
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#E2DCF4]
                      bg-[#FCFBFF]
                      px-4
                      text-xs
                      font-medium
                      text-[#211B38]
                      outline-none
                      focus:border-[#6B4FD3]
                      focus:ring-4
                      focus:ring-[#6B4FD3]/10
                    "
                  />

                </div>


                {/* DESCRIPTION */}

                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-[#211B38]
                    "
                  >
                    Description
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-[#E2DCF4]
                      bg-[#FCFBFF]
                      px-4
                      py-3
                      text-xs
                      font-medium
                      leading-5
                      text-[#211B38]
                      outline-none
                      focus:border-[#6B4FD3]
                      focus:ring-4
                      focus:ring-[#6B4FD3]/10
                    "
                  />

                </div>

              </div>

            </section>


            {/* ==================================================
                VARIANTS
            ================================================== */}

            <section
              className="
                rounded-2xl
                border
                border-[#E5DFFF]
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                    Quantity & Pricing
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-[#9B92B4]
                    "
                  >
                    Update available product sizes and prices
                  </p>

                </div>


                <button
                  type="button"
                  onClick={addVariant}
                  className="
                    flex
                    w-fit
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-[#F0ECFF]
                    px-3
                    py-2
                    text-[10px]
                    font-black
                    text-[#5B3FC4]
                    transition
                    hover:bg-[#E7E0FF]
                  "
                >

                  <Plus size={14} />

                  Add Variant

                </button>

              </div>


              {/* DESKTOP HEADER */}

              <div
                className="
                  mt-5
                  hidden
                  grid-cols-[1fr_1fr_40px]
                  gap-3
                  px-1
                  sm:grid
                "
              >

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#9B92B4]
                  "
                >
                  Quantity / Unit
                </p>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#9B92B4]
                  "
                >
                  Price
                </p>

                <span />

              </div>


              {/* VARIANTS */}

              <div className="mt-3 space-y-3">

                {variants.map(
                  (variant) => (

                    <motion.div
                      key={variant.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                        grid
                        grid-cols-1
                        gap-3
                        rounded-xl
                        border
                        border-[#EDE8F8]
                        bg-[#FCFBFF]
                        p-3
                        sm:grid-cols-[1fr_1fr_40px]
                        sm:border-0
                        sm:bg-transparent
                        sm:p-0
                      "
                    >

                      {/* QUANTITY */}

                      <div>

                        <label
                          className="
                            mb-1.5
                            block
                            text-[9px]
                            font-bold
                            text-[#9B92B4]
                            sm:hidden
                          "
                        >
                          Quantity / Unit
                        </label>

                        <input
                          type="text"
                          value={
                            variant.quantity
                          }
                          onChange={(e) =>
                            updateVariant(
                              variant.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 500 g"
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#E2DCF4]
                            bg-white
                            px-3
                            text-xs
                            font-bold
                            text-[#211B38]
                            outline-none
                            placeholder:text-[#AAA3BC]
                            focus:border-[#6B4FD3]
                            focus:ring-4
                            focus:ring-[#6B4FD3]/10
                          "
                        />

                      </div>


                      {/* PRICE */}

                      <div>

                        <label
                          className="
                            mb-1.5
                            block
                            text-[9px]
                            font-bold
                            text-[#9B92B4]
                            sm:hidden
                          "
                        >
                          Price
                        </label>

                        <div
                          className="
                            relative
                          "
                        >

                          <span
                            className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              text-xs
                              font-bold
                              text-[#9B92B4]
                            "
                          >
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              variant.price
                            }
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-[#E2DCF4]
                              bg-white
                              pl-8
                              pr-3
                              text-xs
                              font-bold
                              text-[#211B38]
                              outline-none
                              placeholder:text-[#AAA3BC]
                              focus:border-[#6B4FD3]
                              focus:ring-4
                              focus:ring-[#6B4FD3]/10
                            "
                          />

                        </div>

                      </div>


                      {/* DELETE */}

                      <div
                        className="
                          flex
                          items-center
                          justify-end
                          sm:justify-center
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(
                              variant.id
                            )
                          }
                          disabled={
                            variants.length ===
                            1
                          }
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-red-400
                            transition
                            hover:bg-red-50
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                          "
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </motion.div>

                  )
                )}

              </div>

            </section>


            {/* ==================================================
                STATUS
            ================================================== */}

            <section
              className="
                rounded-2xl
                border
                border-[#E5DFFF]
                bg-white
                p-5
                shadow-sm
                sm:p-6
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

                <div>

                  <h2
                    className="
                      text-sm
                      font-black
                      text-[#211B38]
                    "
                  >
                    Product Status
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-[#9B92B4]
                    "
                  >
                    Control whether customers can see this product
                  </p>

                </div>


                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="
                    h-11
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
                  "
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </section>


            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#DDD6F2]
                  bg-white
                  px-6
                  text-xs
                  font-bold
                  text-[#81799C]
                  transition
                  hover:bg-[#F8F6FF]
                "
              >

                <X size={16} />

                Cancel

              </button>


              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#5B3FC4]
                  to-[#8B6CFF]
                  px-7
                  text-xs
                  font-black
                  text-white
                  shadow-lg
                  shadow-purple-300/30
                "
              >

                <Save size={17} />

                Update Product

              </motion.button>

            </div>

          </div>

        </div>

      </form>

    </main>
  );
}


export default EditProduct;