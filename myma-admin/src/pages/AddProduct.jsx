import { motion } from "framer-motion";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";

function AddProduct() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [description, setDescription] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [stockStatus, setStockStatus] = useState("IN_STOCK");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [variants, setVariants] = useState([
    { id: Date.now(), quantity: "", price: "", mrp: "" },
  ]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.get("/admin/categories");
        const data = response.data;
        setCategories(
          Array.isArray(data)
            ? data.filter((item) => item && item.active !== false)
            : []
        );
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to load categories.";
        setError(message);
        toast.error(message);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const message = "Please select a PNG, JPG or WEBP image.";
      setError(message);
      toast.error(message);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Image size must be less than 5 MB.";
      setError(message);
      toast.error(message);
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      { id: Date.now() + Math.random(), quantity: "", price: "", mrp: "" },
    ]);
  };

  const removeVariant = (id) => {
    if (variants.length === 1) return;
    setVariants((current) => current.filter((variant) => variant.id !== id));
  };

  const updateVariant = (id, field, value) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError("");

    const fail = (message) => {
      setError(message);
      toast.error(message);
    };

    if (!productName.trim()) return fail("Please enter the product name.");
    if (!category) return fail("Please select a category.");
    if (!description.trim()) return fail("Please enter the product description.");
    if (!image) return fail("Please upload a product image.");

    const invalidVariant = variants.some((variant) => {
      const quantity = variant.quantity.trim();
      const price = Number(variant.price);
      return (
        !quantity ||
        quantity.split(/\s+/).length < 2 ||
        variant.price === "" ||
        !Number.isFinite(price) ||
        price <= 0
      );
    });

    if (invalidVariant) {
      return fail("Please enter a quantity (e.g. 50 g) and a valid selling price for every variant.");
    }

    // MRP is required for each variant when Show Price or Show Discount is enabled.
    const invalidMrp = variants.some((variant) => {
      if (!showPrice && !showDiscount && variant.mrp === "") return false;
      if (variant.mrp === "") return true;
      const mrpValue = Number(variant.mrp);
      const sellingPrice = Number(variant.price);
      return (
        !Number.isFinite(mrpValue) ||
        mrpValue < 0 ||
        mrpValue < sellingPrice
      );
    });

    if (invalidMrp) {
      return fail(
        "Enter an MRP greater than or equal to the selling price for every variant."
      );
    }

    const parseQuantity = (quantity) => {
      const cleaned = quantity.trim().replace(/\s+/g, " ");
      const parts = cleaned.split(" ");
      return {
        name: cleaned,
        value: parts[0],
        unit: parts.slice(1).join(" ").trim().toUpperCase() || null,
      };
    };

    const parsedVariants = variants.map((variant) => {
      const parsedQuantity = parseQuantity(variant.quantity);
      return {
        name: parsedQuantity.name,
        value: parsedQuantity.value,
        unit: parsedQuantity.unit,
        price: Number(variant.price),
        mrp: variant.mrp !== "" ? Number(variant.mrp) : null,
        stockStatus: stockStatus === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
        lowStockLimit: 5,
        available: stockStatus === "IN_STOCK",
      };
    });

    const productData = {
      name: productName.trim(),
      category,
      description: description.trim(),
      // Kept for compatibility with a backend that uses product.price as its base price.
      price: Number(variants[0].price),
      showPrice,
      showDiscount,
      stockStatus: stockStatus === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK",
      unit: parsedVariants[0]?.unit || null,
      active: status === "Active",
      available: stockStatus === "IN_STOCK",
      imageUrl: null,
      variants: parsedVariants,
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    formData.append("image", image);

    setIsSaving(true);
    try {
      const response = await api.post("/admin/products", formData);
      console.log("Product created successfully:", response.data);
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 2500,
      });
      setTimeout(() => navigate("/products"), 700);
    } catch (err) {
      console.error("Unable to add product:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to add product.";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-medium text-[#211B38] outline-none transition placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 disabled:cursor-not-allowed disabled:opacity-60";
  const variantInputClass =
    "h-11 w-full rounded-xl border border-[#E2DCF4] bg-white px-3 text-xs font-bold text-[#211B38] outline-none placeholder:text-[#AAA3BC] focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 disabled:opacity-60";

  return (
    <main className="min-h-screen bg-[#F8F6FF]">
      <header className="sticky top-0 z-30 border-b border-[#E6DFFF] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={isSaving}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E3DDF5] bg-white text-[#6B4FD3] transition hover:bg-[#F4F0FF] disabled:opacity-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7C5CFC]">MYMA Admin</p>
            <h1 className="mt-1 text-xl font-black text-[#211B38]">Add Product</h1>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600"
          >
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="shrink-0 text-red-400">
              <X size={16} />
            </button>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Product image */}
          <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-black text-[#211B38]">Product Image</h2>
              <p className="mt-1 text-[10px] text-[#9B92B4]">Upload a clear product image</p>
            </div>
            <label className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DCD4F5] bg-[#FBFAFF] transition hover:border-[#8B6CFF] hover:bg-[#F7F4FF]">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Product preview" className="h-full w-full object-contain p-5" />
                  <div className="absolute inset-x-0 bottom-0 bg-[#211B38]/70 px-4 py-3 text-center text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">Change Image</div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6B4FD3]"><ImagePlus size={25} /></div>
                  <p className="mt-4 text-xs font-black text-[#211B38]">Upload Product Image</p>
                  <p className="mt-1 text-[9px] text-[#9B92B4]">PNG, JPG or WEBP · Max 5 MB</p>
                </div>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} disabled={isSaving} className="hidden" />
            </label>
            {image && <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7F4FF] px-3 py-2"><Upload size={13} className="text-[#6B4FD3]" /><span className="truncate text-[9px] font-semibold text-[#81799C]">{image.name}</span></div>}
          </section>

          <div className="space-y-6">
            {/* Product information */}
            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-sm font-black text-[#211B38]">Product Information</h2>
                <p className="mt-1 text-[10px] text-[#9B92B4]">Basic details about your product</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-[#211B38]">Product Name <span className="text-red-500">*</span></label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Fresh Apples" disabled={isSaving} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#211B38]">Category <span className="text-red-500">*</span></label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isSaving || loadingCategories} className={inputClass}>
                    <option value="">{loadingCategories ? "Loading categories..." : categories.length ? "Select category" : "No categories available"}</option>
                    {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#211B38]">Stock Status <span className="text-red-500">*</span></label>
                  <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} disabled={isSaving} className={`${inputClass} font-bold`}>
                    <option value="IN_STOCK">IN STOCK</option>
                    <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-[#211B38]">Description <span className="text-red-500">*</span></label>
                  <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSaving} placeholder="Describe your product..." className="w-full resize-none rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 py-3 text-xs font-medium leading-5 text-[#211B38] outline-none focus:border-[#6B4FD3] focus:ring-4 focus:ring-[#6B4FD3]/10 disabled:opacity-60" />
                </div>
              </div>
            </section>

            {/* Quantity, selling price and MRP variants */}
            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-black text-[#211B38]">Quantity & Pricing</h2>
                  <p className="mt-1 text-[10px] text-[#9B92B4]">Set a separate selling price and MRP for each size</p>
                </div>
                <button type="button" onClick={addVariant} disabled={isSaving} className="flex w-fit items-center gap-1.5 rounded-lg bg-[#F0ECFF] px-3 py-2 text-[10px] font-black text-[#5B3FC4] transition hover:bg-[#E7E0FF] disabled:opacity-50"><Plus size={14} /> Add Variant</button>
              </div>

              <div className="mt-5 hidden grid-cols-[1fr_1fr_1fr_40px] gap-3 px-1 sm:grid">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">Quantity / Unit</p>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">Selling Price (₹)</p>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#9B92B4]">MRP (₹)</p>
                <span />
              </div>

              <div className="mt-3 space-y-3">
                {variants.map((variant) => (
                  <motion.div key={variant.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-3 rounded-xl border border-[#EDE8F8] bg-[#FCFBFF] p-3 sm:grid-cols-[1fr_1fr_1fr_40px] sm:border-0 sm:bg-transparent sm:p-0">
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4] sm:hidden">Quantity / Unit</label>
                      <input type="text" value={variant.quantity} onChange={(e) => updateVariant(variant.id, "quantity", e.target.value)} disabled={isSaving} placeholder="e.g. 50 g" className={variantInputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4] sm:hidden">Selling Price (₹)</label>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9B92B4]">₹</span><input type="number" min="0.01" step="0.01" value={variant.price} onChange={(e) => updateVariant(variant.id, "price", e.target.value)} disabled={isSaving} placeholder="0" className={`${variantInputClass} pl-8`} /></div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[9px] font-bold text-[#9B92B4] sm:hidden">MRP (₹)</label>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9B92B4]">₹</span><input type="number" min="0" step="0.01" value={variant.mrp} onChange={(e) => updateVariant(variant.id, "mrp", e.target.value)} disabled={isSaving} placeholder="Enter MRP" className={`${variantInputClass} pl-8`} /></div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-center">
                      <button type="button" onClick={() => removeVariant(variant.id)} disabled={variants.length === 1 || isSaving} aria-label="Remove variant" className="flex h-10 w-10 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 rounded-xl border border-[#EDE8F8] bg-[#FAF8FF] p-4 sm:grid-cols-2">
                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E2DCF4] bg-white px-4 py-3">
                  <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} disabled={isSaving} className="h-4 w-4 cursor-pointer accent-[#6B4FD3]" />
                  <span><span className="block text-xs font-black text-[#211B38]">Show Price</span><span className="mt-0.5 block text-[9px] text-[#9B92B4]">Show MRP with selling price</span></span>
                </label>
                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E2DCF4] bg-white px-4 py-3">
                  <input type="checkbox" checked={showDiscount} onChange={(e) => setShowDiscount(e.target.checked)} disabled={isSaving} className="h-4 w-4 cursor-pointer accent-[#6B4FD3]" />
                  <span><span className="block text-xs font-black text-[#211B38]">Show Discount</span><span className="mt-0.5 block text-[9px] text-[#9B92B4]">Show discount percentage per variant</span></span>
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-[#DDD5F5] bg-[#FAF8FF] px-4 py-3">
                <p className="text-[9px] font-bold text-[#9B92B4]">Example</p>
                <p className="mt-1 text-[10px] font-semibold text-[#81799C]">50 g → ₹10 (MRP ₹12) &nbsp; • &nbsp; 100 g → ₹18 (MRP ₹22) &nbsp; • &nbsp; 250 g → ₹40 (MRP ₹45)</p>
              </div>
            </section>

            {/* Product status */}
            <section className="rounded-2xl border border-[#E5DFFF] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-sm font-black text-[#211B38]">Product Status</h2><p className="mt-1 text-[10px] text-[#9B92B4]">Control whether customers can see this product</p></div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={isSaving} className="h-11 rounded-xl border border-[#E2DCF4] bg-[#FCFBFF] px-4 text-xs font-bold text-[#211B38] outline-none focus:border-[#6B4FD3]"><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => navigate("/products")} disabled={isSaving} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DDD6F2] bg-white px-6 text-xs font-bold text-[#81799C] transition hover:bg-[#F8F6FF] disabled:opacity-50"><X size={16} /> Cancel</button>
              <motion.button type="submit" disabled={isSaving} whileHover={!isSaving ? { scale: 1.01 } : {}} whileTap={!isSaving ? { scale: 0.97 } : {}} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B3FC4] to-[#8B6CFF] px-7 text-xs font-black text-white shadow-lg shadow-purple-300/30 disabled:cursor-not-allowed disabled:opacity-70">
                {isSaving ? <><Loader2 size={17} className="animate-spin" /> Adding Product...</> : <><Save size={17} /> Save Product</>}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default AddProduct;
