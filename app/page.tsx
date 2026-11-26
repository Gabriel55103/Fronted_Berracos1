"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/usuarios-view/Navbar";
import Hero from "../components/usuarios-view/Hero";
import Servicios from "../components/usuarios-view/Servicios";
import Barberos from "@/components/usuarios-view/Barberos";
import Cortes from "../components/usuarios-view/Cortes";
import Reservacion from "../components/usuarios-view/Reservacion";
import Ubicacion from "@/components/usuarios-view/Ubicacion";
import Calendario from "../components/usuarios-view/Calendario";
import Login from "@/components/usuarios-view/login";
import Footer from "../components/usuarios-view/Footer";
import MisReservaciones from "@/components/usuarios-view/MisReservaciones";
import PanelBarbero from "@/components/barberos-view/PanelBarbero";
import PanelAdmin from "@/components/admin/PanelAdmin";
import { obtenerSesion, cerrarSesion, type UsuarioSesion } from "@/lib/sesion";

const secciones = ["inicio", "servicios", "barberos", "cortes", "calendario", "ubicacion"];

export default function Page() {
  const [vista, setVista] = useState("inicio");
  const [servicioInicialId, setServicioInicialId] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setUsuario(obtenerSesion());
    setCargando(false);
  }, []);

  const actualizarUsuario = () => setUsuario(obtenerSesion());

  const cambiarVista = (nuevaVista: string) => {
    const sesionActual = obtenerSesion();
    setUsuario(sesionActual);

    if (nuevaVista === "reservar" && !sesionActual) {
      setVista("login");
      return;
    }
    if (nuevaVista === "panel-barbero" && sesionActual?.rol !== "BARBERO") {
      setVista("inicio");
      return;
    }
    if (nuevaVista === "panel-admin" && sesionActual?.rol !== "ADMIN") {
      setVista("inicio");
      return;
    }

    setVista(nuevaVista);
  };

  useEffect(() => {
    if (secciones.includes(vista)) {
      const destino = document.getElementById(`seccion-${vista}`);
      destino?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [vista]);

  const salir = () => {
    cerrarSesion();
    setUsuario(null);
    setVista("inicio");
  };

  if (cargando) return null;

  const vistaEspecial = ["login", "reservar", "mis-reservaciones", "panel-barbero", "panel-admin"].includes(vista);

  return (
    <>
      <Navbar cambiarVista={cambiarVista} usuario={usuario} cerrarSesion={salir} vistaActual={vista} />

      {!vistaEspecial && (
        <main className="inicio">
          <section id="seccion-inicio"><Hero cambiarVista={cambiarVista} /></section>
          <section id="seccion-servicios">
            <Servicios cambiarVista={cambiarVista} seleccionarServicio={(idServicio) => {
              setServicioInicialId(idServicio);
              cambiarVista("reservar");
            }} />
          </section>
          <section id="seccion-barberos"><Barberos cambiarVista={cambiarVista} /></section>
          <section id="seccion-cortes"><Cortes cambiarVista={cambiarVista} /></section>
          <section id="seccion-calendario"><Calendario cambiarVista={cambiarVista} /></section>
          <section id="seccion-ubicacion"><Ubicacion cambiarVista={cambiarVista} /></section>
        </main>
      )}

      {vista === "reservar" && usuario && <Reservacion cambiarVista={cambiarVista} servicioInicialId={servicioInicialId} />}
      {vista === "login" && <Login cambiarVista={cambiarVista} actualizarUsuario={actualizarUsuario} />}
      {vista === "mis-reservaciones" && usuario?.rol === "CLIENTE" && <MisReservaciones usuario={usuario} />}
      {vista === "panel-barbero" && usuario?.rol === "BARBERO" && <PanelBarbero usuario={usuario} />}
      {vista === "panel-admin" && usuario?.rol === "ADMIN" && <PanelAdmin />}

      <Footer cambiarVista={cambiarVista} />
    </>
  );
}
