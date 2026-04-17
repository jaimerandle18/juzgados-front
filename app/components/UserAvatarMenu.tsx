"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOut, User, Star, ChevronDown } from "lucide-react";
import { api } from "../../src/lib/api";
import { showLoader } from "./globalLoader";
import { clearGuestMode } from "../utils/AuthGuard";
import { hapticLight } from "../utils/haptics";

type DjUser = {
  nombre?: string;
  apellido?: string;
  email?: string;
};

function iniciales(u: DjUser | null) {
  if (!u) return "?";
  const n = (u.nombre ?? "").trim();
  const a = (u.apellido ?? "").trim();
  if (n && a) return (n[0] + a[0]).toUpperCase();
  if (n) return n.slice(0, 2).toUpperCase();
  if (u.email) return u.email.slice(0, 2).toUpperCase();
  return "?";
}

function nombreCompleto(u: DjUser | null) {
  if (!u) return "";
  const n = (u.nombre ?? "").trim();
  const a = (u.apellido ?? "").trim();
  if (n || a) return [n, a].filter(Boolean).join(" ");
  return u.email ?? "";
}

export default function UserAvatarMenu() {
  const [user, setUser] = useState<DjUser | null>(null);

  useEffect(() => {
    let cancel = false;
    api
      .get("/usuarios/me")
      .then((res) => {
        if (!cancel) setUser(res.data);
      })
      .catch(() => {
        /* sin cuenta o sin red; el dropdown igual funciona con iniciales "?" */
      });
    return () => {
      cancel = true;
    };
  }, []);

  const logout = () => {
    showLoader("Cerrando sesión…");
    clearGuestMode();
    try {
      localStorage.removeItem("es_admin");
      localStorage.removeItem("user_id");
    } catch {}
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.location.href = "/logout";
      }, 50);
    });
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton
        onClick={() => hapticLight()}
        className="
          flex items-center gap-2 px-1.5 py-1 rounded-full
          hover:bg-gray-100 transition active:scale-95
        "
      >
        <span
          className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            bg-gradient-to-br from-blue-500 to-blue-700
            text-white font-bold text-sm
            shadow
          "
        >
          {iniciales(user)}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="
          z-[99999] mt-2 w-64
          rounded-2xl bg-white/95 backdrop-blur-xl
          border border-gray-200 shadow-2xl
          py-1
          focus:outline-none
        "
      >
        {/* Cabecera con nombre/email */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {nombreCompleto(user) || "Mi cuenta"}
          </p>
          {user?.email && nombreCompleto(user) !== user.email && (
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          )}
        </div>

        <MenuItem>
          {({ focus }) => (
            <Link
              href="/perfil"
              onClick={() => showLoader()}
              className={`
                flex items-center gap-3 px-4 py-2.5 text-sm
                ${focus ? "bg-blue-50 text-blue-700" : "text-gray-800"}
              `}
            >
              <User className="w-4 h-4" />
              Mi perfil
            </Link>
          )}
        </MenuItem>

        <MenuItem>
          {({ focus }) => (
            <Link
              href="/mis-evaluaciones"
              onClick={() => showLoader()}
              className={`
                flex items-center gap-3 px-4 py-2.5 text-sm
                ${focus ? "bg-blue-50 text-blue-700" : "text-gray-800"}
              `}
            >
              <Star className="w-4 h-4" />
              Mis evaluaciones
            </Link>
          )}
        </MenuItem>

        <div className="my-1 border-t border-gray-100" />

        <MenuItem>
          {({ focus }) => (
            <button
              type="button"
              onClick={logout}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                ${focus ? "bg-red-50 text-red-700" : "text-red-600"}
              `}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
