import {
  motion,
} from "framer-motion";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // DEMO ADMIN CREDENTIALS
  // ==========================================

  const ADMIN_USERNAME = "admin";

  const ADMIN_PASSWORD = "admin123";


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (e) => {

    e.preventDefault();

    setError("");

    if (!username.trim()) {
      setError(
        "Please enter your username."
      );

      return;
    }

    if (!password.trim()) {
      setError(
        "Please enter your password."
      );

      return;
    }


    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {

      setError(
        "Invalid admin username or password."
      );

      return;
    }


    setLoading(true);


    // Save admin login

    localStorage.setItem(
      "myma_admin_authenticated",
      "true"
    );

    localStorage.setItem(
      "myma_admin_user",
      JSON.stringify({
        username: "admin",
        name: "MYMA Admin",
      })
    );


    setTimeout(() => {

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    }, 500);
  };


  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#FAF9FF]
        px-4
        py-8
      "
    >

      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-[#DCD2FF]/50
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-[#C9BAFF]/40
          blur-3xl
        "
      />


      {/* ======================================
          LOGIN CARD
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-[2rem]
          border
          border-[#E5DFFF]
          bg-white
          shadow-2xl
          shadow-purple-200/40
        "
      >

        {/* ==================================
            TOP BRAND AREA
        ================================== */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#4B32A8]
            via-[#6B4FD3]
            to-[#9274F7]
            px-6
            py-8
            text-center
            sm:px-10
          "
        >

          {/* Decorative circle */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-48
              w-48
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-16
              h-44
              w-44
              rounded-full
              border
              border-white/10
            "
          />


          {/* Logo */}

<motion.div
  initial={{
    scale: 0.7,
    opacity: 0,
  }}
  animate={{
    scale: 1,
    opacity: 1,
  }}
  transition={{
    type: "spring",
    stiffness: 180,
  }}
  className="
    relative
    mx-auto
    flex
    h-20
    w-20
    items-center
    justify-center
    overflow-hidden
    rounded-3xl
    bg-white
    p-2
    shadow-xl
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
</motion.div>


          <p
            className="
              relative
              mt-3
              text-[9px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-white/70
            "
          >
            SUPERMARKET
          </p>


          <h1
            className="
              relative
              mt-3
              text-2xl
              font-black
              text-white
            "
          >
            Admin Panel
          </h1>


          <p
            className="
              relative
              mt-1
              text-xs
              text-white/70
            "
          >
            Manage your MYMA supermarket
          </p>

        </div>


        {/* ==================================
            FORM
        ================================== */}

        <div
          className="
            px-6
            py-7
            sm:px-10
            sm:py-9
          "
        >

          {/* Security badge */}

          <div
            className="
              mb-6
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[#E8E2FF]
              bg-[#F8F6FF]
              px-4
              py-3
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
                bg-[#EDE8FF]
              "
            >
              <ShieldCheck
                size={18}
                className="text-[#6B4FD3]"
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
                Secure Admin Access
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-[#81799C]
                "
              >
                Authorized personnel only
              </p>

            </div>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Username */}

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
                Username
              </label>

              <div className="relative">

                <User
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#9187B0]
                  "
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#E1DAF7]
                    bg-[#FCFBFF]
                    pl-11
                    pr-4
                    text-sm
                    font-medium
                    text-[#211B38]
                    outline-none
                    transition
                    placeholder:text-[#B0A8C5]
                    focus:border-[#6B4FD3]
                    focus:ring-4
                    focus:ring-[#6B4FD3]/10
                  "
                />

              </div>

            </div>


            {/* Password */}

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
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#9187B0]
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#E1DAF7]
                    bg-[#FCFBFF]
                    pl-11
                    pr-12
                    text-sm
                    font-medium
                    text-[#211B38]
                    outline-none
                    transition
                    placeholder:text-[#B0A8C5]
                    focus:border-[#6B4FD3]
                    focus:ring-4
                    focus:ring-[#6B4FD3]/10
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-[#9187B0]
                    hover:bg-[#F0ECFF]
                    hover:text-[#5B3FC4]
                  "
                >

                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>

            </div>


            {/* Error */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3
                  text-xs
                  font-semibold
                  text-red-600
                "
              >
                {error}
              </motion.div>
            )}


            {/* Login */}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{
                scale: loading
                  ? 1
                  : 1.01,
              }}
              whileTap={{
                scale: loading
                  ? 1
                  : 0.97,
              }}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[#5B3FC4]
                to-[#8B6CFF]
                text-sm
                font-black
                text-white
                shadow-lg
                shadow-purple-300/30
                transition
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >

              {loading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />

                  Login to Admin Panel
                </>
              )}

            </motion.button>

          </form>


          {/* Demo credentials */}

          <div
            className="
              mt-6
              rounded-xl
              border
              border-dashed
              border-[#DDD5F7]
              bg-[#FBFAFF]
              p-4
            "
          >

            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-[#7C5CFC]
              "
            >
              Development Login
            </p>

            <div
              className="
                mt-2
                grid
                grid-cols-2
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-[9px]
                    text-[#9B92B4]
                  "
                >
                  Username
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-black
                    text-[#211B38]
                  "
                >
                  admin
                </p>

              </div>

              <div>

                <p
                  className="
                    text-[9px]
                    text-[#9B92B4]
                  "
                >
                  Password
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-black
                    text-[#211B38]
                  "
                >
                  admin123
                </p>

              </div>

            </div>

          </div>


          <p
            className="
              mt-6
              text-center
              text-[10px]
              text-[#A19AB4]
            "
          >
            © 2026 MYMA Supermarket
          </p>

        </div>

      </motion.div>

    </main>
  );
}

export default AdminLogin;