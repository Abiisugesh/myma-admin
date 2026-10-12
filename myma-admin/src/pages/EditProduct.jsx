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

import { useNavigate, useParams } from "react-router-dom";

import api from "../api/api";

// ======================================================

// EDIT PRODUCT

// Same structure as AddProduct:

// - Variant: quantity + price

// - Product: mrp + showPrice + showDiscount

// ======================================================

function EditProduct() {

  const navigate = useNavigate();

  const { id } = useParams();

  // ====================================================

  // LOADING / SAVING

  // ====================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ====================================================

  // PRODUCT FORM

  // ====================================================

  const [productName, setProductName] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);

  // ====================================================

  // PRICE / DISCOUNT - SAME AS ADD PRODUCT

  // ====================================================


  const [showDiscount, setShowDiscount] = useState(false);

  const [showPrice, setShowPrice] = useState(false);

  // ====================================================

  // STOCK / STATUS

  // ====================================================

  const [stockStatus, setStockStatus] = useState("IN_STOCK");

  const [status, setStatus] = useState("Active");

  // ====================================================

  // IMAGE

  // ====================================================

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  // ====================================================

  // VARIANTS - SAME AS ADD PRODUCT

  // ====================================================

  const [variants, setVariants] = useState([]);

  // ====================================================

  // MESSAGES

  // ====================================================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ====================================================

  // LOAD PRODUCT + CATEGORIES

  // ====================================================

  useEffect(() => {

    if (!id) {

      setError("Invalid product ID.");

      setLoading(false);

      return;

    }

    loadProduct();

    loadCategories();

  }, [id]);

  // ====================================================

  // QUANTITY HELPERS

  // ====================================================

  // Backend stores quantity as:

  // name  = "500 g"

  // value = "500"

  // unit  = "G"

  //

  // Edit screen uses the same single field as Add Product:

  // quantity = "500 g"

  const buildQuantity = (variant) => {

    const name = String(variant?.name || "").trim();

    if (name) {

      return name.replace(/\s+/g, " ");

    }

    const value = String(variant?.value ?? "").trim();

    const unit = String(variant?.unit ?? "").trim();

    return [value, unit]

      .filter(Boolean)

      .join(" ")

      .replace(/\s+/g, " ")

      .trim();

  };

  const parseQuantity = (quantity) => {

    const cleaned = String(quantity || "")

      .trim()

      .replace(/\s+/g, " ");

    const parts = cleaned ? cleaned.split(" ") : [];

    const value = parts[0] || "";

    const unit = parts

      .slice(1)

      .join(" ")

      .trim()

      .toUpperCase();

    return {

      name: cleaned,

      value,

      unit: unit || null,

    };

  };

  // ====================================================

  // LOAD PRODUCT

  // ====================================================

  const loadProduct = async () => {

    try {

      setLoading(true);

      setError("");

      setSuccess("");

      const response = await api.get(`/admin/products/${id}`);

      const product = response.data;

      if (!product) {

        setError("Product not found.");

        return;

      }

      // ------------------------------------------------

      // BASIC INFO

      // ------------------------------------------------

      setProductName(product.name || "");

      setCategory(product.category || "");

      setDescription(product.description || "");

      // ------------------------------------------------

      // PRODUCT-LEVEL PRICE / DISCOUNT

      // Same fields as AddProduct

      // ------------------------------------------------


      setShowPrice(product.showPrice === true);

      setShowDiscount(product.showDiscount === true);

      // ------------------------------------------------

      // PRODUCT STATUS

      // ------------------------------------------------

      setStatus(product.active === true ? "Active" : "Inactive");

      // ------------------------------------------------

      // PRODUCT STOCK STATUS

      // ------------------------------------------------

      setStockStatus(

        product.stockStatus === "OUT_OF_STOCK"

          ? "OUT_OF_STOCK"

          : "IN_STOCK"

      );

      // ------------------------------------------------

      // IMAGE

      // ------------------------------------------------

      setImagePreview(

        product.imageUrl ||

          product.imageUrl2 ||

          product.imageUrl3 ||

          product.imageUrl4 ||

          ""

      );

      // ------------------------------------------------

      // VARIANTS

      // Same structure as AddProduct after loading:

      // { id, quantity, price }

      // ------------------------------------------------

      const backendVariants = Array.isArray(product.variants)

        ? product.variants

        : [];

      if (backendVariants.length > 0) {

        setVariants(

          backendVariants.map((variant, index) => ({

            id: variant.id ?? `existing-${index}-${Date.now()}`,

            quantity: buildQuantity(variant),

            price: variant.price ?? "",

            mrp: variant.mrp ?? "",

          }))

        );

      } else {

        // Fallback for products without variants.

        // Use product-level price/unit when available.

        const fallbackQuantity = [

          product.value,

          product.unit,

        ]

          .filter(Boolean)

          .join(" ")

          .trim();

        setVariants([

          {

            id: `new-${Date.now()}`,

            quantity: fallbackQuantity,

            price: product.price ?? "",

            mrp: product.mrp ?? "",

          },

        ]);

      }

    } catch (err) {

      console.error("Unable to load product:", err);

      setError(

        err.response?.data?.message ||

          err.response?.data?.error ||

          err.message ||

          "Unable to load product."

      );

    } finally {

      setLoading(false);

    }

  };

  // ====================================================

  // LOAD CATEGORIES

  // ====================================================

  const loadCategories = async () => {

    try {

      const response = await api.get("/admin/categories");

      const data = Array.isArray(response.data)

        ? response.data

        : [];

      setCategories(

        data.filter(

          (item) => item && item.active !== false

        )

      );

    } catch (err) {

      console.error("Unable to load categories:", err);

    }

  };

  // ====================================================

  // IMAGE CHANGE

  // ====================================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [

      "image/png",

      "image/jpeg",

      "image/webp",

    ];

    if (!allowedTypes.includes(file.type)) {

      setError("Only PNG, JPG or WEBP images are allowed.");

      e.target.value = "";

      return;

    }

    // Keep the same 5 MB limit as AddProduct.

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      setError("Image size must be less than 5 MB.");

      e.target.value = "";

      return;

    }

    setError("");

    setImage(file);

    setImagePreview(URL.createObjectURL(file));

  };

  // ====================================================

  // ADD VARIANT

  // ====================================================

  const addVariant = () => {

    setVariants((currentVariants) => [

      ...currentVariants,

      {

        id: `new-${Date.now()}-${Math.random()}`,

        quantity: "",

        price: "",

        mrp: "",

      },

    ]);

  };

  // ====================================================

  // REMOVE VARIANT

  // ====================================================

  const removeVariant = (variantId) => {

    if (variants.length === 1) {

      setError("At least one variant is required.");

      return;

    }

    setVariants((currentVariants) =>

      currentVariants.filter(

        (variant) => variant.id !== variantId

      )

    );

  };

  // ====================================================

  // UPDATE VARIANT

  // ====================================================

  const updateVariant = (variantId, field, value) => {

    setVariants((currentVariants) =>

      currentVariants.map((variant) =>

        variant.id === variantId

          ? { ...variant, [field]: value }

          : variant

      )

    );

  };

  // ====================================================

  // VALIDATE FORM

  // Same rules as AddProduct

  // ====================================================

  const validateForm = () => {

    if (!productName.trim()) {

      return "Please enter the product name.";

    }

    if (!category) {

      return "Please select a category.";

    }

    if (!description.trim()) {

      return "Please enter the product description.";

    }

    if (

      !stockStatus ||

      !["IN_STOCK", "OUT_OF_STOCK"].includes(stockStatus)

    ) {

      return "Please select a valid stock status.";

    }

    if (variants.length === 0) {

      return "Please add at least one variant.";

    }

    // ------------------------------------------------

    // Variant validation - same as AddProduct

    // ------------------------------------------------

    const invalidVariant = variants.some((variant) => {

      const quantity = String(variant.quantity || "").trim();

      const quantityParts = quantity.split(/\s+/);

      return (

        !quantity ||

        quantityParts.length < 2 ||

        !variant.price ||

        Number(variant.price) <= 0 ||

        (variant.mrp !== "" && variant.mrp != null && (Number(variant.mrp) < 0 || Number(variant.mrp) < Number(variant.price)))

      );

    });

    if (invalidVariant) {

      return "Enter quantity and a valid selling price for every variant. Each MRP must be greater than or equal to its selling price.";

    }

    if (

      !variants[0]?.price ||

      Number(variants[0].price) <= 0

    ) {

      return "Please enter a valid price for the first variant.";

    }

    return "";

  };

  // ====================================================

  // SAVE / UPDATE PRODUCT

  // ====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (saving) return;

    setError("");

    setSuccess("");

    const validationError = validateForm();

    if (validationError) {

      setError(validationError);

      return;

    }

    try {

      setSaving(true);

      // ------------------------------------------------

      // Convert quantity field to backend structure

      // Same conversion as AddProduct

      // ------------------------------------------------

      const parsedVariants = variants.map((variant) => {

        const parsedQuantity = parseQuantity(variant.quantity);

        return {

          ...(typeof variant.id === "number"

            ? { id: variant.id }

            : {}),

          name: parsedQuantity.name,

          value: parsedQuantity.value,

          unit: parsedQuantity.unit,

          price: Number(variant.price),

          mrp: variant.mrp !== "" && variant.mrp != null ? Number(variant.mrp) : null,

          stockStatus:

            stockStatus === "OUT_OF_STOCK"

              ? "OUT_OF_STOCK"

              : "IN_STOCK",

          lowStockLimit: 5,

          available: stockStatus === "IN_STOCK",

        };

      });

      // ------------------------------------------------

      // PRODUCT DATA

      // Same product-level structure as AddProduct

      // ------------------------------------------------

      const updatedProduct = {

        name: productName.trim(),

        category,

        description: description.trim(),

        // First variant price

        price: Number(variants[0].price),

        // Backward compatibility: use the first variant MRP at product level.

        mrp: variants[0]?.mrp !== "" ? Number(variants[0]?.mrp) : null,

        // Product-level display flags

        showPrice: showPrice === true,

        showDiscount: showDiscount === true,

        // Product stock

        stockStatus:

          stockStatus === "OUT_OF_STOCK"

            ? "OUT_OF_STOCK"

            : "IN_STOCK",

        // First variant unit

        unit: parsedVariants[0]?.unit || null,

        active: status === "Active",

        available: stockStatus === "IN_STOCK",

        // Keep existing variants

        variants: parsedVariants,

      };

      console.log("Updating Product:", updatedProduct);

      // ------------------------------------------------

      // MULTIPART FORM DATA

      // ------------------------------------------------

      const formData = new FormData();

      formData.append(

        "product",

        new Blob([JSON.stringify(updatedProduct)], {

          type: "application/json",

        })

      );

      if (image) {

        formData.append("image", image);

        console.log("Uploading new image:", image.name);

      }

      console.log("Product ID:", id);

      console.log("Has new image:", !!image);

      // ------------------------------------------------

      // UPDATE API

      // ------------------------------------------------

      const response = await api.put(

        `/admin/products/${id}`,

        formData

      );

      console.log(

        "Product updated successfully:",

        response.data

      );

      setSuccess(

        image

          ? "Product and image updated successfully!"

          : "Product updated successfully!"

      );

      setTimeout(() => {

        navigate("/products");

      }, 1000);

    } catch (err) {

      console.error("Unable to update product:", err);

      console.error("Response:", err.response?.data);

      setError(

        err.response?.data?.message ||

          err.response?.data?.error ||

          err.message ||

          "Unable to update product."

      );

    } finally {

      setSaving(false);

    }

  };

  // ====================================================

  // CLEAN IMAGE PREVIEW

  // ====================================================

  useEffect(() => {

    return () => {

      if (imagePreview?.startsWith("blob:")) {

        URL.revokeObjectURL(imagePreview);

      }

    };

  }, [imagePreview]);

  // ====================================================

  // LOADING SCREEN

  // ====================================================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#F8F6FF]">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E7E0FF] border-t-[#6B4FD3]" />

          <p className="mt-4 text-xs font-bold text-[#81799C]">

            Loading product...

          </p>

        </div>

      </main>

    );

  }

  // ====================================================

  // RENDER

  // ====================================================

  return (

    <main className="min-h-screen bg-[#F8F6FF]">

      {/* ==================================================

          HEADER

      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#E6DFFF] bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">

          <button

            type="button"

            onClick={() => navigate("/products")}

            disabled={saving}

            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E3DDF5] bg-white text-[#6B4FD3] transition hover:bg-[#F4F0FF] disabled:cursor-not-allowed disabled:opacity-50"

          >

            <ArrowLeft size={18} />

          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">

              MYMA Admin

            </p>

            <h1 className="mt-1 text-xl font-black text-[#211B38]">

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

        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"

      >

        {/* ERROR */}

        {error && (

          <motion.div

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}

            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600"

          >

            <span>{error}</span>

            <button

              type="button"

              onClick={() => setError("")}

              className="shrink-0"

            >

              <X size={16} />

            </button>

          </motion.div>

        )}

        {/* SUCCESS */}

        {success && (

          <motion.div

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}

            className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs font-bold text-green-600"

          >

            {success}

          </motion.div>

        )}

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">

          {/* ==================================================

              IMAGE

          ================================================== */}

          <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm">

            <div className="mb-4">

              <h2 className="text-sm font-black text-[#211B38]">

                Product Image

              </h2>

              <p className="mt-1 text-[10px] text-[#9B92B4]">

                Change the product image if needed

              </p>

            </div>

            <label className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DCD4F5] bg-[#FBFAFF] transition hover:border-[#8B6CFF]">

              {imagePreview ? (

                <>

                  <img

                    src={imagePreview}

                    alt={productName || "Product"}

                    className="h-full w-full object-contain p-5"

                  />

                  <div className="absolute inset-x-0 bottom-0 bg-[#211B38]/70 px-4 py-3 text-center text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">

                    Change Image

                  </div>

                </>

              ) : (

                <div className="flex flex-col items-center text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6B4FD3]">

                    <ImagePlus size={25} />

                  </div>

                  <p className="mt-4 text-xs font-black text-[#211B38]">

                    Upload Product Image

                  </p>

                  <p className="mt-1 text-[9px] text-[#9B92B4]">

                    PNG, JPG or WEBP

                  </p>

                </div>

              )}

              <input

                type="file"

                accept="image/png,image/jpeg,image/webp"

                onChange={handleImageChange}

                disabled={saving}

                className="hidden"

              />

            </label>

            {image && (

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7F4FF] px-3 py-2">

                <Upload size={13} className="text-[#6B4FD3]" />

                <span className="truncate text-[9px] font-semibold text-[#81799C]">

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

                BASIC INFORMATION

            ================================================== */}

            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">

                <h2 className="text-sm font-black text-[#211B38]">

                  Product Information

                </h2>

                <p className="mt-1 text-[10px] text-[#9B92B4]">

                  Update your product details

                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* PRODUCT NAME */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-xs font-bold text-[#211B38]">

                    Product Name

                    <span className="text-red-500"> *</span>

                  </label>

                  <input

                    type="text"

                    value={productName}

                    onChange={(e) => setProductName(e.target.value)}

                    disabled={saving}

                    className="h-12 w-full rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-medium text-[#211B38] outline-none transition placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10"

                    placeholder="e.g. Fresh Apples"

                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#211B38]">

                    Category

                    <span className="text-red-500"> *</span>

                  </label>

                  <select

                    value={category}

                    onChange={(e) => setCategory(e.target.value)}

                    disabled={saving}

                    className="h-12 w-full rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-bold text-[#211B38] outline-none focus:border-[#6B4FD3]"

                  >

                    <option value="">Select category</option>

                    {categories.map((item) => (

                      <option

                        key={item.id ?? item.name}

                        value={item.name ?? item.id}

                      >

                        {item.name}

                      </option>

                    ))}

                  </select>

                </div>

                {/* STOCK STATUS */}

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#211B38]">

                    Stock Status

                    <span className="text-red-500"> *</span>

                  </label>

                  <select

                    value={stockStatus}

                    onChange={(e) => setStockStatus(e.target.value)}

                    disabled={saving}

                    className="h-12 w-full rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-bold text-[#211B38] outline-none focus:border-[#6B4FD3]"

                  >

                    <option value="IN_STOCK">In Stock</option>

                    <option value="OUT_OF_STOCK">Out of Stock</option>

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-xs font-bold text-[#211B38]">

                    Description

                    <span className="text-red-500"> *</span>

                  </label>

                  <textarea

                    rows={5}

                    value={description}

                    onChange={(e) => setDescription(e.target.value)}

                    disabled={saving}

                    className="w-full resize-none rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 py-3 text-xs font-medium leading-5 text-[#211B38] outline-none focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10"

                    placeholder="Enter product description"

                  />

                </div>

              </div>

            </section>

            {/* ==================================================

                QUANTITY & PRICING

            ================================================== */}

            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-sm font-black text-[#211B38]">

                    Quantity & Pricing

                  </h2>

                  <p className="mt-1 text-[10px] text-[#9B92B4]">

                    Update available product variants

                  </p>

                </div>

                <button

                  type="button"

                  onClick={addVariant}

                  disabled={saving}

                  className="flex w-fit items-center gap-1.5 rounded-lg bg-[#F0ECFF] px-3 py-2 text-[10px] font-black text-[#5B3FC4] transition hover:bg-[#E7E0FF] disabled:opacity-50"

                >

                  <Plus size={14} />

                  Add Variant

                </button>

              </div>

              <div className="mt-5 space-y-4">

                {variants.map((variant, index) => (

                  <motion.div

                    key={variant.id}

                    initial={{ opacity: 0, y: 8 }}

                    animate={{ opacity: 1, y: 0 }}

                    className="rounded-xl border border-[#EDE8F8] bg-[#FCFBFF] p-4"

                  >

                    <div className="mb-4 flex items-center justify-between">

                      <p className="text-xs font-black text-[#211B38]">

                        Variant {index + 1}

                      </p>

                      <button

                        type="button"

                        onClick={() => removeVariant(variant.id)}

                        disabled={variants.length === 1 || saving}

                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-30"

                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* QUANTITY */}

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4]">

                          Quantity / Unit

                        </label>

                        <input

                          type="text"

                          value={variant.quantity}

                          onChange={(e) =>

                            updateVariant(

                              variant.id,

                              "quantity",

                              e.target.value

                            )

                          }

                          disabled={saving}

                          placeholder="e.g. 500 g"

                          className="h-11 w-full rounded-xl border border-[#E2DCF4] bg-white px-3 text-xs font-bold text-[#211B38] outline-none placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10"

                        />

                      </div>

                      {/* PRICE */}

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4]">

                          Price

                        </label>

                        <div className="relative">

                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9B92B4]">

                            ₹

                          </span>

                          <input

                            type="number"

                            min="0"

                            step="0.01"

                            value={variant.price}

                            onChange={(e) =>

                              updateVariant(

                                variant.id,

                                "price",

                                e.target.value

                              )

                            }

                            disabled={saving}

                            placeholder="0"

                            className="h-11 w-full rounded-xl border border-[#E2DCF4] bg-white pl-8 pr-3 text-xs font-bold text-[#211B38] outline-none placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10"

                          />

                        </div>

                      </div>

                    </div>

                    {/* MRP FOR THIS VARIANT */}
                    <div className="mt-4">
                      <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4]">
                        MRP (for this quantity)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9B92B4]">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.mrp ?? ""}
                          onChange={(e) => updateVariant(variant.id, "mrp", e.target.value)}
                          disabled={saving}
                          placeholder="Enter MRP"
                          className="h-11 w-full rounded-xl border border-[#E2DCF4] bg-white pl-8 pr-3 text-xs font-bold text-[#211B38] outline-none placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10"
                        />
                      </div>
                      {variant.mrp !== "" && Number(variant.mrp) > Number(variant.price) && Number(variant.price) > 0 && (
                        <p className="mt-1 text-[10px] font-semibold text-green-600">
                          {Math.round(((Number(variant.mrp) - Number(variant.price)) / Number(variant.mrp)) * 100)}% discount
                        </p>
                      )}
                    </div>

                  </motion.div>

                ))}

              </div>

              {/* ==================================================

                  MRP + PRICE DISPLAY OPTIONS

                  SAME AS ADD PRODUCT

              ================================================== */}

              <div className="mt-5 grid gap-4 rounded-xl border border-[#EDE8F8] bg-[#FAF8FF] p-4 sm:grid-cols-2">

                {/* SHOW PRICE */}

                <div className="flex items-center">

                  <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E2DCF4] bg-white px-4 py-3">

                    <input

                      type="checkbox"

                      checked={showPrice}

                      onChange={(e) => setShowPrice(e.target.checked)}

                      disabled={saving}

                      className="h-4 w-4 cursor-pointer accent-[#6B4FD3]"

                    />

                    <div>

                      <p className="text-xs font-black text-[#211B38]">

                        Show Price

                      </p>

                      <p className="mt-0.5 text-[9px] text-[#9B92B4]">

                        Show MRP with our selling price

                      </p>

                    </div>

                  </label>

                </div>

                {/* SHOW DISCOUNT */}

                <div className="flex items-center">

                  <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E2DCF4] bg-white px-4 py-3">

                    <input

                      type="checkbox"

                      checked={showDiscount}

                      onChange={(e) =>

                        setShowDiscount(e.target.checked)

                      }

                      disabled={saving}

                      className="h-4 w-4 cursor-pointer accent-[#6B4FD3]"

                    />

                    <div>

                      <p className="text-xs font-black text-[#211B38]">

                        Show Discount

                      </p>

                      <p className="mt-0.5 text-[9px] text-[#9B92B4]">

                        Show discount percentage on product card

                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* EXAMPLE */}

              <div className="mt-5 rounded-xl border border-dashed border-[#DDD5F5] bg-[#FAF8FF] px-4 py-3">

                <p className="text-[9px] font-bold text-[#9B92B4]">

                  Example

                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#81799C]">

                  250 g → ₹35 &nbsp; • &nbsp; 500 g → ₹65 &nbsp; • &nbsp; 1 kg → ₹120

                </p>

              </div>

            </section>

            {/* ==================================================

                PRODUCT STATUS

            ================================================== */}

            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-sm font-black text-[#211B38]">

                    Product Status

                  </h2>

                  <p className="mt-1 text-[10px] text-[#9B92B4]">

                    Control whether customers can see this product

                  </p>

                </div>

                <select

                  value={status}

                  onChange={(e) => setStatus(e.target.value)}

                  disabled={saving}

                  className="h-11 rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-bold text-[#211B38] outline-none focus:border-[#6B4FD3]"

                >

                  <option value="Active">Active</option>

                  <option value="Inactive">Inactive</option>

                </select>

              </div>

            </section>

            {/* ==================================================

                BUTTONS

            ================================================== */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button

                type="button"

                disabled={saving}

                onClick={() => navigate("/products")}

                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DDD6F2] bg-white px-6 text-xs font-bold text-[#81799C] transition hover:bg-[#F8F6FF] disabled:opacity-50"

              >

                <X size={16} />

                Cancel

              </button>

              <motion.button

                type="submit"

                disabled={saving}

                whileHover={{ scale: saving ? 1 : 1.01 }}

                whileTap={{ scale: saving ? 1 : 0.97 }}

                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B3FC4] to-[#8B6CFF] px-7 text-xs font-black text-white shadow-lg shadow-purple-300/30 disabled:cursor-not-allowed disabled:opacity-60"

              >

                <Save size={17} />

                {saving ? "Updating..." : "Update Product"}

              </motion.button>

            </div>

          </div>

        </div>

      </form>

    </main>

  );

}

export default EditProduct;
