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

import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";


// ======================================================
// DEMO CATEGORIES
// Later Java + MySQL API-la replace pannuvom
// ======================================================

const initialCategories = [
  {
    id: 1,
    name: "Fruits",
    description:
      "Fresh and healthy fruits",
    image: "🍎",
    status: "Active",
    productCount: 24,
  },

  {
    id: 2,
    name: "Vegetables",
    description:
      "Fresh vegetables for everyday cooking",
    image: "🥕",
    status: "Active",
    productCount: 36,
  },

  {
    id: 3,
    name: "Dairy",
    description:
      "Milk, curd, butter and other dairy products",
    image: "🥛",
    status: "Active",
    productCount: 18,
  },

  {
    id: 4,
    name: "Groceries",
    description:
      "Daily essential grocery products",
    image: "🛒",
    status: "Active",
    productCount: 52,
  },

  {
    id: 5,
    name: "Snacks",
    description:
      "Tasty snacks and quick bites",
    image: "🍿",
    status: "Active",
    productCount: 31,
  },

  {
    id: 6,
    name: "Beverages",
    description:
      "Juices, soft drinks and beverages",
    image: "🥤",
    status: "Inactive",
    productCount: 12,
  },
];


// ======================================================
// CATEGORIES
// ======================================================

function Categories() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] =
    useState(initialCategories);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [deleteCategory, setDeleteCategory] =
    useState(null);


  // ====================================================
  // FILTERED CATEGORIES
  // ====================================================

  const filteredCategories =
    useMemo(() => {

      return categories.filter(
        (category) => {

          const matchesSearch =
            category.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            statusFilter === "All" ||
            category.status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      categories,
      search,
      statusFilter,
    ]);


  // ====================================================
  // ADD CATEGORY
  // ====================================================

  const handleAddCategory = (
    categoryData
  ) => {

    const newCategory = {

      id:
        Date.now(),

      name:
        categoryData.name,

      description:
        categoryData.description,

      image:
        categoryData.image,

      status:
        categoryData.status,

      productCount: 0,

    };


    setCategories(
      (currentCategories) => [
        ...currentCategories,
        newCategory,
      ]
    );

    setShowAddModal(false);
  };


  // ====================================================
  // UPDATE CATEGORY
  // ====================================================

  const handleUpdateCategory = (
    categoryData
  ) => {

    setCategories(
      (currentCategories) =>
        currentCategories.map(
          (category) =>
            category.id ===
            editingCategory.id
              ? {
                  ...category,
                  name:
                    categoryData.name,
                  description:
                    categoryData.description,
                  image:
                    categoryData.image,
                  status:
                    categoryData.status,
                }
              : category
        )
    );

    setEditingCategory(null);
  };


  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = () => {

    if (!deleteCategory) {
      return;
    }


    setCategories(
      (currentCategories) =>
        currentCategories.filter(
          (category) =>
            category.id !==
            deleteCategory.id
        )
    );


    setDeleteCategory(null);
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

        {/* ==================================================
            SUMMARY
        ================================================== */}

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


        {/* ==================================================
            SEARCH
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
                      bg-[#F5F2FF]
                    "
                  >

                    <span
                      className="
                        text-6xl
                      "
                    >
                      {category.image}
                    </span>

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
                          setEditingCategory(
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

          /* ==================================================
              EMPTY
          ================================================== */

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

  const [name, setName] =
    useState(
      initialData?.name || ""
    );

  const [description, setDescription] =
    useState(
      initialData?.description || ""
    );

  const [image, setImage] =
    useState(
      initialData?.image || "📦"
    );

  const [status, setStatus] =
    useState(
      initialData?.status || "Active"
    );

  const [error, setError] =
    useState("");


  // ====================================================
  // IMAGE
  // ====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const preview =
      URL.createObjectURL(file);

    setImage(preview);
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


    onSubmit({
      name:
        name.trim(),

      description:
        description.trim(),

      image,

      status,
    });
  };


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

        {/* ==================================================
            MODAL HEADER
        ================================================== */}

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


        {/* ==================================================
            FORM
        ================================================== */}

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
              Category Icon
            </label>


            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  bg-[#F0ECFF]
                  text-4xl
                "
              >

                {image.startsWith(
                  "blob:"
                ) ? (

                  <img
                    src={image}
                    alt="Category"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  image

                )}

              </div>


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

                Change Image

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
              placeholder="e.g. Fruits"
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