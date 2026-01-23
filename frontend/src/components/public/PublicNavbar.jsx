import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/icons/i-logo.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import IconButton from "../ui/IconButton.jsx";

const MotionSpan = motion.span;
const MotionDiv = motion.div;

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <header className="fixed z-40 w-full border-b border-surface bg-background/95 px-6 py-3 backdrop-blur-md">
      <div className="relative z-40 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary focus-visible:outline-none cursor-pointer">
          <div className="h-4 w-4">
            <Logo className="h-full w-full" aria-hidden="true" focusable="false" />
          </div>
          <div className="text-md">PlanifyAI</div>
        </Link>

        <nav className="hidden text-md md:flex md:gap-4">
          <a
            href="#how"
            className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer"
          >
            Como funciona
          </a>
          <a
            href="#features"
            className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer"
          >
            Recursos
          </a>
          <a
            href="#cta"
            className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer"
          >
            Comecar
          </a>
        </nav>

        <Button
          as={Link}
          to="/login"
          size="sm"
          className="hidden md:inline-flex"
          aria-label="Entrar na sua conta"
        >
          Login
        </Button>

        <IconButton
          type="button"
          className="text-primary md:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={handleToggle}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <MotionSpan
                key="icon-close"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </MotionSpan>
            ) : (
              <MotionSpan
                key="icon-menu"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </MotionSpan>
            )}
          </AnimatePresence>

        </IconButton>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <MotionDiv
              className="fixed inset-0 z-40 cursor-pointer"
              onClick={handleClose}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <MotionDiv
              id={menuId}
              className="absolute left-0 right-0 top-full z-50 border-b border-surface px-6 py-4 md:hidden backdrop-blur-md bg-background"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <nav className="flex flex-col gap-4 text-sm items-center">
                <a href="#how" onClick={handleClose} className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer">
                  Como funciona
                </a>
                <a href="#features" onClick={handleClose} className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer">
                  Recursos
                </a>
                <a href="#cta" onClick={handleClose} className="transition-all duration-500 ease-out hover:text-text-titles active:text-primary focus-visible:outline-none focus-visible:text-text-titles cursor-pointer">
                  Comecar
                </a>
                <Button
                  as={Link}
                  to="/login"
                  onClick={handleClose}
                  size="sm"
                >
                  Login
                </Button>
              </nav>
            </MotionDiv>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
