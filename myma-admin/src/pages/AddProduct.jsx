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

import { useState } from "react";
import { useNavigate } from "react-router-dom";


function AddProduct() {

  const navigate = useNavigate();


  // ======================================================
  // PRODUCT FORM
  // ======================================================

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


  // ======================================================
  // IMAGE
  // ======================================================

  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");


  // ======================================================
  // VARIANTS
  // ======================================================
  // Admin evlo quantity venalum add pannalam.
  //
  // Example:
  // 250 g  ₹35
  // 500 g  ₹65
  // 1 kg   ₹120
  // ======================================================

  const [variants, setVariants] =
    useState([
      {
        id: Date.now(),
        quantity: "",
        price: "",
      },
    ]);


  // ======================================================
  // ERROR
  // ======================================================

  const [error, setError] =
    useState("");


  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

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


  // ======================================================
  // ADD VARIANT
  // ======================================================

  const addVariant = () => {

    setVariants(
      (currentVariants) => [
        ...currentVariants,
        {
          id: Date.now(),
          quantity: "",
          price: "",
        },
      ]
    );
  };


  // ======================================================
  // REMOVE VARIANT
  // ======================================================

  const removeVariant = (id) => {

    if (variants.length === 1) {
      return;
    }

    setVariants(
      (currentVariants) =>
        currentVariants.filter(
          (variant) =>
            variant.id !== id
        )
    );
  };


  // ======================================================
  // UPDATE VARIANT
  // ======================================================

  const updateVariant = (
    id,
    field,
    value
  ) => {

    setVariants(
      (currentVariants) =>
        currentVariants.map(
          (variant) =>
            variant.id === id
              ? {
                  ...variant,
                  [field]: value,
                }
              : variant
        )
    );
  };


  // ======================================================
  // SAVE PRODUCT
  // ======================================================

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");


    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

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


    // ------------------------------------------
    // VARIANT VALIDATION
    // ------------------------------------------

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


    // ------------------------------------------
    // STOCK
    // ------------------------------------------

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );

      return;
    }


    // ------------------------------------------
    // PRODUCT OBJECT
    // ------------------------------------------

    const productData = {

      name: productName.trim(),

      category,

      description: description.trim(),

      stock: Number(stock),

      status,

      image,

      variants:
        variants.map(
          (variant) => ({
            quantity:
              variant.quantity.trim(),

            price:
              Number(variant.price),
          })
        ),

    };


    // ------------------------------------------
    // TEMPORARY
    // ------------------------------------------
    // Later:
    // POST /api/products
    //
    // Java Spring Boot
    //        ↓
    // MySQL
    // ------------------------------------------

    console.log(
      "Product Data:",
      productData
    );


    alert(
      "Product added successfully!"
    );


    navigate(
      "/products"
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
            <ArrowLeft size={18} />
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
              Add Product
            </h1>

          </div>

        </div>

      </header>


      {/* ==================================================
          CONTENT
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
              LEFT - IMAGE
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
                Upload a clear product image
              </p>

            </div>


            {/* Image Preview */}

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
                hover:bg-[#F7F4FF]
              "
            >

              {imagePreview ? (

                <>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="
                      h-full
                      w-full
                      object-contain
                      p-5
                    "
                  />

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
                    <ImagePlus size={25} />
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
                onChange={handleImageChange}
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
              RIGHT - DETAILS
          ================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                BASIC INFORMATION
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
                  Basic details about your product
                </p>

              </div>


              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >

                {/* Product Name */}

                <div className="sm:col-span-2">

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
                    placeholder="e.g. Fresh Apples"
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
                      transition
                      placeholder:text-[#AAA3BC]
                      focus:border-[#6B4FD3]
                      focus:ring-4
                      focus:ring-[#6B4FD3]/10
                    "
                  />

                </div>


                {/* Category */}

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


                {/* Stock */}

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
                    placeholder="e.g. 100"
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


                {/* Description */}

                <div className="sm:col-span-2">

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
                    placeholder="Describe your product..."
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
                QUANTITY VARIANTS
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
                    Add the sizes available for this product
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


              {/* Variant Header */}

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


              {/* Variants */}

              <div className="mt-3 space-y-3">

                {variants.map(
                  (variant, index) => (

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

                      {/* Quantity */}

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


                      {/* Price */}

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


                      {/* Remove */}

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
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </motion.div>

                  )
                )}

              </div>


              {/* Example */}

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-dashed
                  border-[#DDD5F5]
                  bg-[#FAF8FF]
                  px-4
                  py-3
                "
              >

                <p
                  className="
                    text-[9px]
                    font-bold
                    text-[#9B92B4]
                  "
                >
                  Example
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-semibold
                    text-[#81799C]
                  "
                >
                  250 g → ₹35 &nbsp; • &nbsp;
                  500 g → ₹65 &nbsp; • &nbsp;
                  1 kg → ₹120
                </p>

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
                ACTIONS
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

                Save Product

              </motion.button>

            </div>

          </div>

        </div>

      </form>

    </main>
  );
}


export default AddProduct;