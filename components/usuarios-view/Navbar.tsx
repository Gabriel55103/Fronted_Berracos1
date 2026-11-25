"use client";

import type { UsuarioSesion } from "@/lib/sesion";

type NavbarProps = {
  cambiarVista: (vista: string) => void;
  usuario: UsuarioSesion | null;
  cerrarSesion: () => void;
  vistaActual: string;
};

export default function Navbar({
  cambiarVista,
  usuario,
  cerrarSesion,
  vistaActual,
}: NavbarProps) {
  const navegar = (vista: string) => cambiarVista(vista);

  const enlaces = [
    { vista: "inicio", etiqueta: "INICIO" },
    { vista: "servicios", etiqueta: "SERVICIOS" },
    { vista: "barberos", etiqueta: "BARBEROS" },
    { vista: "cortes", etiqueta: "CORTES" },
    { vista: "calendario", etiqueta: "DISPONIBILIDAD" },
    { vista: "ubicacion", etiqueta: "UBICACIÓN" },
  ];

  if (usuario?.rol === "CLIENTE") {
    enlaces.push(
      { vista: "reservar", etiqueta: "RESERVAR CITA" },
      { vista: "mis-reservaciones", etiqueta: "MIS RESERVACIONES" }
    );
  }

  if (usuario?.rol === "BARBERO") {
    enlaces.push({ vista: "panel-barbero", etiqueta: "MI PANEL" });
  }

  if (usuario?.rol === "ADMIN") {
    enlaces.push({ vista: "panel-admin", etiqueta: "ADMINISTRACIÓN" });
  }

  if (!usuario) {
    enlaces.push({ vista: "reservar", etiqueta: "RESERVAR CITA" });
  }

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <button
        type="button"
        className="navbar-logo"
        onClick={() => navegar("inicio")}
        aria-label="Berracos Barber, ir al inicio"
      >
        BERRACOS<span>BARBER</span>
      </button>

      <div className="navbar-menu-contenido">
        <ul className="navbar-links">
          {enlaces.map((enlace) => (
            <li key={enlace.vista}>
              <button
                type="button"
                className={vistaActual === enlace.vista ? "activo" : ""}
                aria-current={vistaActual === enlace.vista ? "page" : undefined}
                onClick={() => navegar(enlace.vista)}
              >
                {enlace.etiqueta}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-usuario">
          {usuario ? (
            <>
              <span>HOLA, {usuario.nombre.toUpperCase()}</span>
              <button
                type="button"
                className="navbar-login navbar-cerrar"
                onClick={cerrarSesion}
              >
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            <button
              type="button"
              className="navbar-login"
              onClick={() => navegar("login")}
            >
              INICIAR SESIÓN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
