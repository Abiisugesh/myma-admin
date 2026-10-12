import { motion } from "framer-motion";

import {
  ArrowLeft,
  Edit3,
  FolderOpen,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/api";

// ======================================================
// CATEGORIES
// ======================================================

function Categories() {
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [deleteCategory, setDeleteCategory] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "error",
    message: "",
  });

  // ====================================================
  // TOAST
  // ====================================================

  const showToast = (message, type = "error") => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((current) => ({
        ...current,
        show: false,
      }));
    }, 3500);
  };

  // ====================================================
  // GET CATEGORIES
  // ====================================================

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");

      const data = response.data;

      const formattedCategories = Array.isArray(data)
        ? data.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description || "",

            // REAL S3 IMAGE URL
            image: category.imageUrl || null,

            // Keep original URL also
            imageUrl: category.imageUrl || null,

            status: category.active ? "Active" : "Inactive",

            productCount: 0,
          }))
        : [];

      setCategories(formattedCategories);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to load categories"
      );
    }
  };

  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ====================================================
  // FILTERED CATEGORIES
  // ====================================================

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        category.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    categories,
    search,
    statusFilter,
  ]);

  // ====================================================
  // ADD CATEGORY
  // ====================================================

  const handleAddCategory = async (
    categoryData
  ) => {
    try {
      const formData = new FormData();

      // CATEGORY JSON
      formData.append(
        "category",
        new Blob(
          [
            JSON.stringify({
              name: categoryData.name,
              description:
                categoryData.description,
              active:
                categoryData.status ===
                "Active",
            }),
          ],
          {
            type: "application/json",
          }
        )
      );

      // IMAGE FILE
      if (categoryData.imageFile) {
        formData.append(
          "image",
          categoryData.imageFile
        );
      }

      await api.post(
        "/admin/categories",
        formData
      );

      setShowAddModal(false);

      showToast(
        "Category added successfully",
        "success"
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Failed to add category:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add category"
      );
    }
  };

  // ====================================================
  // UPDATE CATEGORY
  // ====================================================

  const handleUpdateCategory = async (
    categoryData
  ) => {
    try {
      const formData = new FormData();

      // CATEGORY JSON
      formData.append(
        "category",
        new Blob(
          [
            JSON.stringify({
              name: categoryData.name,
              description:
                categoryData.description,
              active:
                categoryData.status ===
                "Active",
            }),
          ],
          {
            type: "application/json",
          }
        )
      );

      // ONLY SEND IMAGE IF USER SELECTED A NEW ONE
      if (categoryData.imageFile) {
        formData.append(
          "image",
          categoryData.imageFile
        );
      }

      await api.put(
        `/admin/categories/${editingCategory.id}`,
        formData
      );

      setEditingCategory(null);

      showToast(
        "Category updated successfully",
        "success"
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Failed to update category:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update category"
      );
    }
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = async () => {
    if (!deleteCategory) {
      return;
    }

    try {
      await api.delete(
        `/admin/categories/${deleteCategory.id}`
      );

      setDeleteCategory(null);

      showToast(
        "Category deleted successfully",
        "success"
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete category"
      );
    }
  };

  // ====================================================
  // OPEN EDIT
  // ====================================================

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <main className="min-h-screen bg-[#F8F6FF]">

      {/* ==================================================
          TOAST NOTIFICATION
      ================================================== */}

      {toast.show && (
        <motion.div
          initial={{
            opacity: 0,
            y: -35,
            x: 20,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 25,
          }}
          className="
            fixed
            right-4
            top-4
            z-[200]
            w-[calc(100%-2rem)]
            max-w-sm
            sm:right-6
            sm:top-6
          "
        >
          <div
            className={`
              relative
              overflow-hidden
              rounded-2xl
              border
              bg-white/95
              px-4
              py-4
              shadow-[0_18px_55px_rgba(48,35,95,0.18)]
              backdrop-blur-xl
              ${
                toast.type === "success"
                  ? "border-emerald-100"
                  : "border-rose-100"
              }
            `}
          >

            {/* ACCENT */}
            <div
              className={`
                absolute
                inset-y-0
                left-0
                w-1
                ${
                  toast.type === "success"
                    ? "bg-gradient-to-b from-emerald-300 via-emerald-500 to-teal-500"
                    : "bg-gradient-to-b from-rose-300 via-red-500 to-pink-500"
                }
              `}
            />

            <div className="flex items-start gap-3 pl-1">

              {/* ICON */}

              <motion.div
                initial={{
                  scale: 0.5,
                  rotate: -15,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 18,
                  delay: 0.05,
                }}
                className={`
                  relative
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-base
                  font-black
                  ${
                    toast.type === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-500"
                  }
                `}
              >

                <span
                  className={`
                    absolute
                    inset-0
                    rounded-xl
                    opacity-40
                    blur-md
                    ${
                      toast.type === "success"
                        ? "bg-emerald-200"
                        : "bg-rose-200"
                    }
                  `}
                />

                <span className="relative">
                  {toast.type === "success"
                    ? "✓"
                    : "!"}
                </span>

              </motion.div>

              {/* CONTENT */}

              <div className="min-w-0 flex-1 pt-0.5">

                <div className="flex items-center gap-2">

                  <p
                    className={`
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      ${
                        toast.type ===
                        "success"
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }
                    `}
                  >
                    MYMA • ADMIN
                  </p>

                  <span className="h-1 w-1 rounded-full bg-[#D8D0EA]" />

                  <p className="text-[9px] font-bold text-[#AAA3BC]">
                    {toast.type === "success"
                      ? "Success"
                      : "Error"}
                  </p>

                </div>

                <p className="mt-1 text-xs font-black leading-5 text-[#211B38]">
                  {toast.message}
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setToast((current) => ({
                    ...current,
                    show: false,
                  }))
                }
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-[#AAA3BC]
                  transition-all
                  hover:bg-[#F5F2FF]
                  hover:text-[#5B3FC4]
                "
              >
                <X size={14} />
              </button>

            </div>

            {/* PROGRESS */}

            <motion.div
              initial={{
                width: "100%",
              }}
              animate={{
                width: "0%",
              }}
              transition={{
                duration: 3.5,
                ease: "linear",
              }}
              className={`
                absolute
                bottom-0
                left-0
                h-[2px]
                ${
                  toast.type === "success"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : "bg-gradient-to-r from-rose-400 to-red-500"
                }
              `}
            />

          </div>
        </motion.div>
      )}

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
                  sm:text-2xl
                "
              >
                Categories
              </h1>

            </div>

          </div>

          {/* ADD CATEGORY */}

          <motion.button
            type="button"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>
              setShowAddModal(true)
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
            "
          >

            <Plus size={17} />

            <span className="hidden sm:block">
              Add Category
            </span>

            <span className="sm:hidden">
              Add
            </span>

          </motion.button>

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

        {/* SUMMARY */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
          "
        >

          <SummaryCard
            title="Total Categories"
            value={categories.length}
            icon={FolderOpen}
          />

          <SummaryCard
            title="Active"
            value={
              categories.filter(
                (category) =>
                  category.status ===
                  "Active"
              ).length
            }
            icon={FolderOpen}
          />

          <SummaryCard
            title="Inactive"
            value={
              categories.filter(
                (category) =>
                  category.status ===
                  "Inactive"
              ).length
            }
            icon={FolderOpen}
          />

        </div>

        {/* SEARCH */}

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
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* SEARCH */}

            <div
              className="
                relative
                w-full
                sm:max-w-md
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
                placeholder="Search categories..."
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

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
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

              <option value="All">
                All Status
              </option>

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
            CATEGORY GRID
        ================================================== */}

        {filteredCategories.length > 0 ? (

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            {filteredCategories.map(
              (category) => (

                <motion.article
                  key={category.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#E5DFFF]
                    bg-white
                    shadow-sm
                    transition
                    hover:shadow-md
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      flex
                      h-36
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[#F5F2FF]
                    "
                  >

                    {category.image ? (

                      <img
                        src={category.image}
                        alt={category.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-300
                          hover:scale-105
                        "
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                          text-[#9B92B4]
                        "
                      >
                        <ImagePlus
                          size={38}
                          strokeWidth={1.5}
                        />
                      </div>

                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="p-4">

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-2
                      "
                    >

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <h2
                          className="
                            truncate
                            text-sm
                            font-black
                            text-[#211B38]
                          "
                        >
                          {category.name}
                        </h2>

                        <p
                          className="
                            mt-1
                            line-clamp-2
                            min-h-8
                            text-[10px]
                            leading-4
                            text-[#9B92B4]
                          "
                        >
                          {category.description}
                        </p>

                      </div>

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-[8px]
                          font-black
                          ${
                            category.status ===
                            "Active"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }
                        `}
                      >
                        {category.status}
                      </span>

                    </div>

                    {/* PRODUCT COUNT */}

                    <div
                      className="
                        mt-4
                        rounded-xl
                        bg-[#FAF8FF]
                        px-3
                        py-2.5
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          text-[#9B92B4]
                        "
                      >
                        Products
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-sm
                          font-black
                          text-[#5B3FC4]
                        "
                      >
                        {category.productCount}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        mt-4
                        flex
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            category
                          )
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-1.5
                          rounded-xl
                          bg-[#F0ECFF]
                          py-2.5
                          text-[10px]
                          font-black
                          text-[#5B3FC4]
                          transition
                          hover:bg-[#E6DEFF]
                        "
                      >

                        <Edit3 size={14} />

                        Edit

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteCategory(
                            category
                          )
                        }
                        className="
                          flex
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          bg-red-50
                          text-red-500
                          transition
                          hover:bg-red-100
                        "
                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  </div>

                </motion.article>

              )
            )}

          </div>

        ) : (

          <div
            className="
              mt-6
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#E5DFFF]
              bg-white
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
              <Search size={25} />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-black
                text-[#211B38]
              "
            >
              No categories found
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                text-[#9B92B4]
              "
            >
              Try changing your search
              or status filter.
            </p>

          </div>

        )}

      </section>

      {/* ==================================================
          ADD MODAL
      ================================================== */}

      {showAddModal && (

        <CategoryModal
          title="Add Category"
          submitText="Save Category"
          onClose={() =>
            setShowAddModal(false)
          }
          onSubmit={
            handleAddCategory
          }
        />

      )}

      {/* ==================================================
          EDIT MODAL
      ================================================== */}

      {editingCategory && (

        <CategoryModal
          title="Edit Category"
          submitText="Update Category"
          initialData={
            editingCategory
          }
          onClose={() =>
            setEditingCategory(null)
          }
          onSubmit={
            handleUpdateCategory
          }
        />

      )}

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      {deleteCategory && (

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
              Delete Category?
            </h3>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#81799C]
              "
            >
              Are you sure you want to
              delete{" "}

              <span
                className="
                  font-black
                  text-[#211B38]
                "
              >
                {deleteCategory.name}
              </span>

              ?
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
                  setDeleteCategory(null)
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

    </main>
  );
}

// ======================================================
// CATEGORY MODAL
// ======================================================

function CategoryModal({
  title,
  submitText,
  initialData,
  onClose,
  onSubmit,
}) {

  const [name, setName] = useState(
    initialData?.name || ""
  );

  const [description, setDescription] =
    useState(
      initialData?.description || ""
    );

  // ACTUAL FILE
  const [imageFile, setImageFile] =
    useState(null);

  // PREVIEW URL
  const [imagePreview, setImagePreview] =
    useState(
      initialData?.imageUrl ||
        initialData?.image ||
        ""
    );

  const [status, setStatus] =
    useState(
      initialData?.status || "Active"
    );

  const [error, setError] =
    useState("");

  // ====================================================
  // IMAGE CHANGE
  // ====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    // VALIDATE TYPE
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please select PNG, JPEG or WEBP image."
      );

      return;
    }

    // VALIDATE SIZE - 5MB
    if (file.size > 5 * 1024 * 1024) {

      setError(
        "Image size must be less than 5MB."
      );

      return;
    }

    setError("");

    // Store actual file
    setImageFile(file);

    // Create preview
    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = (e) => {

    e.preventDefault();

    setError("");

    if (!name.trim()) {

      setError(
        "Please enter category name."
      );

      return;
    }

    if (!description.trim()) {

      setError(
        "Please enter category description."
      );

      return;
    }

    // Send actual File + form data
    onSubmit({
      name: name.trim(),

      description:
        description.trim(),

      imageFile,

      status,
    });
  };

  // ====================================================
  // RENDER
  // ====================================================

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
          w-full
          max-w-lg
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* MODAL HEADER */}

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

            <h2
              className="
                mt-1
                text-lg
                font-black
                text-[#211B38]
              "
            >
              {title}
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
              transition
              hover:bg-[#F5F2FF]
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >

          {/* ERROR */}

          {error && (

            <div
              className="
                mb-4
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
              {error}
            </div>

          )}

          {/* IMAGE */}

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
              Category Image
            </label>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              {/* PREVIEW */}

              <div
                className="
                  flex
                  h-24
                  w-24
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E3DDF5]
                  bg-[#F0ECFF]
                "
              >

                {imagePreview ? (

                  <img
                    src={imagePreview}
                    alt="Category Preview"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  <ImagePlus
                    size={30}
                    strokeWidth={1.5}
                    className="text-[#8B6CFF]"
                  />

                )}

              </div>

              {/* UPLOAD BUTTON */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#DDD6F2]
                  px-4
                  py-3
                  text-[10px]
                  font-bold
                  text-[#5B3FC4]
                  transition
                  hover:bg-[#F8F6FF]
                "
              >

                <ImagePlus size={15} />

                {imagePreview
                  ? "Change Image"
                  : "Choose Image"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />

              </label>

            </div>

            <p
              className="
                mt-2
                text-[9px]
                text-[#AAA3BC]
              "
            >
              PNG, JPEG or WEBP • Maximum 5MB
            </p>

          </div>

          {/* NAME */}

          <div className="mt-5">

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                text-[#211B38]
              "
            >
              Category Name

              <span className="text-red-500">
                {" "}*
              </span>

            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="e.g. Beverages"
              className="
                h-11
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
                placeholder:text-[#AAA3BC]
                focus:border-[#6B4FD3]
                focus:ring-4
                focus:ring-[#6B4FD3]/10
              "
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

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
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe this category..."
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
                placeholder:text-[#AAA3BC]
                focus:border-[#6B4FD3]
                focus:ring-4
                focus:ring-[#6B4FD3]/10
              "
            />

          </div>

          {/* STATUS */}

          <div className="mt-5">

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                text-[#211B38]
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
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

          {/* BUTTONS */}

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-2
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-11
                flex-1
                items-center
                justify-center
                rounded-xl
                border
                border-[#DDD6F2]
                text-xs
                font-bold
                text-[#81799C]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                flex
                h-11
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[#5B3FC4]
                to-[#8B6CFF]
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-purple-300/30
              "
            >

              <SaveIcon />

              {submitText}

            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
}

// ======================================================
// SAVE ICON
// ======================================================

function SaveIcon() {

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />

      <polyline points="17 21 17 13 7 13 7 21" />

      <polyline points="7 3 7 8 15 8" />

    </svg>
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

export default Categories;