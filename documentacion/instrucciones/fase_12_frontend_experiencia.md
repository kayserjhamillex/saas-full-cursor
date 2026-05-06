# fase_12_frontend_experiencia.md

Fase 12 — Frontend Experiencia (Demo, Admin SaaS y Panel Clínico)

---

1. Descripción de la fase

Esta fase implementa la capa de experiencia de usuario del sistema, estructurada en tres aplicaciones frontend independientes, cada una con propósito claro dentro del ecosistema SaaS:

* Aplicación Demo (captación de clientes)
* Panel Administrador SaaS (gestión del sistema)
* Panel Clínico (operación diaria de las clínicas)

Se prioriza diseño UI/UX de nivel producto comercial, orientado a conversión, usabilidad, rendimiento y escalabilidad visual.

Depende de:

* Todas las fases backend (1–11)
* /documentacion/reglas
* /documentacion/database

---

2. Objetivo técnico

Diseñar e implementar interfaces que:

* Sean visualmente atractivas (nivel producto SaaS competitivo)
* Mejoren la conversión (demo → cliente)
* Sean altamente usables en entorno clínico
* Soporten múltiples roles y flujos
* Implementen modo oscuro y personalización
* Mantengan coherencia visual en todo el sistema

---

3. Aplicaciones frontend

/frontend/demo-app
/frontend/angular-app (admin SaaS)
/frontend/react-app (panel clínico)

Rutas finales documentadas en:

/documentacion/rutasfront.md

---

4. Responsabilidades por aplicación

/frontend/demo-app

* Landing page del producto
* Simulación del sistema (demo interactiva)
* Registro de clientes potenciales
* Presentación de módulos
* UX orientado a conversión

---

/frontend/angular-app (Admin SaaS)

* Gestión de tenants
* Suscripciones
* Pagos
* Activación de módulos
* Dashboard global
* Métricas del sistema

---

/frontend/react-app (Clínico)

* Gestión de pacientes
* Historia clínica
* Agendamiento
* Inventario
* IA (resultados)
* RRHH (uso interno)

---

5. Lineamientos de diseño UI

Estilo visual recomendado:

* Base: minimalista + moderno
* Paleta:

  * Pastel (confianza, salud, claridad)
  * Neon (tecnología, innovación)

Ejemplo:

* Fondo claro: gris muy suave / blanco roto
* Primario: azul pastel o cyan
* Secundario: morado suave / verde clínico
* Accent: neon (hover / botones clave)

---

Modo oscuro (OBLIGATORIO)

* Fondo: gris oscuro / negro suave
* Contraste alto pero no agresivo
* Colores adaptativos (no invertir sin control)
* Persistencia de preferencia del usuario

---

Tipografía:

* Sans-serif moderna (Inter, Poppins)
* Jerarquía clara (H1–H6)
* Espaciado consistente

---

6. Experiencia de usuario (UX)

Principios:

* Tiempo de acción mínimo (menos clics)
* Navegación clara y consistente
* Feedback inmediato (loading, éxito, error)
* Formularios simples
* Acciones visibles

---

Flujos clave:

* Login rápido
* Registro guiado (demo)
* Creación de cita en menos de 5 pasos
* Acceso rápido a paciente frecuente
* Dashboard con información crítica inmediata

---

7. Animaciones e interacción

Uso controlado (no excesivo):

* Transiciones suaves (150ms–300ms)
* Hover states
* Skeleton loaders
* Microinteracciones (botones, inputs)
* Animaciones de entrada (fade, slide)

Framework recomendado:

* Framer Motion (React)
* Angular Animations

---

8. Arquitectura frontend

React (Clínico):

* components
* pages
* services (API)
* state management
* hooks personalizados

---

Angular (Admin):

* modules
* components
* services
* guards
* interceptors

---

Demo App:

* landing + simulación
* estado local
* datos mockeados

---

9. Consumo de APIs

* Todo pasa por API Gateway
* Manejo centralizado de tokens
* Interceptors para:

  * JWT
  * errores
  * logs

---

10. Reglas de negocio

* UI no contiene lógica crítica
* Roles determinan vistas
* Módulos visibles según suscripción
* Consistencia con backend obligatoria

---

11. Validaciones

* Formularios reactivos
* Validación en cliente + servidor
* Manejo de errores visual

---

12. Seguridad

* Protección de rutas
* Manejo seguro de JWT
* Logout automático por expiración
* No exponer datos sensibles

---

13. Testing

BDD (principal)

* flujos de usuario
* navegación
* interacción

Integración:

* consumo de APIs

---

14. Dependencias técnicas

* React (Vite)
* Angular
* Zustand / Context
* Axios
* TailwindCSS (recomendado)
* Framer Motion

---

15. Riesgos técnicos

* UI inconsistente entre apps
* mala experiencia de usuario
* sobrecarga visual
* duplicación de lógica

---

16. Resultado esperado

* Producto visualmente atractivo
* Experiencia fluida
* Sistema usable en entorno real
* Alta conversión en demo
* Interfaces coherentes y escalables

---

17. Registro de avance (documentacion/avance)

/documentacion/avance/fase_12.md

Contenido:

* Aplicaciones desarrolladas:

  * demo-app
  * admin-app
  * clinical-app
* Funcionalidades UI implementadas
* Sistema de diseño aplicado
* Modo oscuro implementado
* Animaciones integradas
* Integración con backend validada
* Pruebas ejecutadas
* Decisiones de diseño tomadas

---

18. Entregable documental obligatorio

Al cerrar esta fase se debe mantener sincronizado:

* /documentacion/rutasfront.md con el estado real de rutas de navegacion por frontend:

  * demo-app
  * angular-app
  * react-app
* /documentacion/manualdeusuario.md con:

  * estado actual real de implementacion
  * pasos de levantamiento disponibles
  * URLs locales base esperadas
  * referencia cruzada a /documentacion/rutasfront.md

---
