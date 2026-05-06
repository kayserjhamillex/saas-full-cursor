# Matriz BDD (GIVEN / WHEN / THEN)

Estado actual de cobertura funcional para los flujos principales.

## Feature: Auth

### Login

- **Escenario feliz**  
  **GIVEN** usuario en `/login` con credenciales validas  
  **WHEN** envia formulario  
  **THEN** se ejecuta `submitLogin` y el sistema prepara acceso al shell  
  **Estado:** Cubierto

- **Escenario error de credenciales**  
  **GIVEN** credenciales invalidas  
  **WHEN** se intenta login  
  **THEN** se muestra `authMessage` con error  
  **Estado:** Cubierto (hook)

- **Escenario loading de login**  
  **GIVEN** request de login en curso  
  **WHEN** UI renderiza el estado  
  **THEN** boton deshabilitado y `aria-busy=true`  
  **Estado:** Parcial (recomendado reforzar a nivel componente)

### Recover password

- **Escenario feliz**  
  **GIVEN** email y tenant cargados  
  **WHEN** envia recover  
  **THEN** se llama `submitRecover` y mensaje de exito  
  **Estado:** Cubierto

- **Escenario error recover**  
  **GIVEN** fallo en servicio recover  
  **WHEN** envia formulario  
  **THEN** `authMessage` muestra error recibido  
  **Estado:** Cubierto (hook)

### Verify code

- **Escenario feliz**  
  **GIVEN** email + codigo validos  
  **WHEN** verifica codigo  
  **THEN** se llama `submitVerifyCode` y flujo continua a update password  
  **Estado:** Cubierto

- **Escenario codigo invalido**  
  **GIVEN** codigo invalido  
  **WHEN** verifica  
  **THEN** se informa error en `authMessage`  
  **Estado:** Cubierto (hook)

### Update password

- **Escenario feliz**  
  **GIVEN** codigo + nueva password + confirmacion valida  
  **WHEN** envia update  
  **THEN** se llama `submitUpdatePassword` y mensaje de exito  
  **Estado:** Cubierto

- **Escenario mismatch passwords**  
  **GIVEN** password y confirmacion diferentes  
  **WHEN** envia update  
  **THEN** no llama API y muestra `Las passwords no coinciden`  
  **Estado:** Cubierto

- **Escenario error API update**  
  **GIVEN** fallo backend update password  
  **WHEN** envia update  
  **THEN** se muestra mensaje de error  
  **Estado:** Cubierto (hook)

### Navegacion y proteccion de rutas

- **Escenario sin token**  
  **GIVEN** usuario sin sesion  
  **WHEN** entra a ruta protegida  
  **THEN** redirecciona a login  
  **Estado:** Cubierto

- **Escenario con token**  
  **GIVEN** usuario autenticado  
  **WHEN** entra a `/`  
  **THEN** accede al shell  
  **Estado:** Cubierto

- **Escenario navegacion auth por links**  
  **GIVEN** usuario en login/recover/verify/update  
  **WHEN** navega por links del flujo  
  **THEN** cambia correctamente de pantalla  
  **Estado:** Cubierto

---

## Feature: External Services

### Email

- **Escenario feliz**  
  **GIVEN** payload de email valido  
  **WHEN** envia correo  
  **THEN** estado success `Correo enviado correctamente.`  
  **Estado:** Cubierto

- **Escenario loading**  
  **GIVEN** request pendiente  
  **WHEN** renderiza formulario  
  **THEN** muestra estado loading  
  **Estado:** Cubierto

- **Escenario error**  
  **GIVEN** fallo de servicio  
  **WHEN** envia correo  
  **THEN** muestra estado error  
  **Estado:** Cubierto (page integration)

### WhatsApp

- **Escenario feliz**  
  **GIVEN** payload valido  
  **WHEN** envia WhatsApp  
  **THEN** estado success `WhatsApp enviado correctamente.`  
  **Estado:** Cubierto

- **Escenario error**  
  **GIVEN** fallo de servicio  
  **WHEN** envia  
  **THEN** mensaje de error visible  
  **Estado:** Cubierto (card/page)

### File upload

- **Escenario feliz con fileId**  
  **GIVEN** payload valido y respuesta con `id`  
  **WHEN** sube archivo  
  **THEN** success incluye `fileId` y actualiza `fileIdQuery`  
  **Estado:** Cubierto

- **Escenario seleccion archivo vacia**  
  **GIVEN** sin archivo en input  
  **WHEN** dispara `handleFileSelection`  
  **THEN** no modifica `filePayload`  
  **Estado:** Cubierto

- **Escenario lectura base64 exitosa**  
  **GIVEN** `FileReader.onload` retorna data URL  
  **WHEN** procesa archivo  
  **THEN** setea `fileName`, `mimeType`, `fileBase64`  
  **Estado:** Cubierto

- **Escenario error FileReader**  
  **GIVEN** `FileReader.onerror`  
  **WHEN** procesa archivo  
  **THEN** propaga error  
  **Estado:** Cubierto

### File metadata

- **Escenario feliz**  
  **GIVEN** `fileId` valido  
  **WHEN** consulta metadata  
  **THEN** guarda `fileMeta` y success  
  **Estado:** Cubierto

- **Escenario error metadata**  
  **GIVEN** fallo de consulta  
  **WHEN** consulta metadata  
  **THEN** muestra error  
  **Estado:** Cubierto

- **Escenario empty state**  
  **GIVEN** sin metadata cargada  
  **WHEN** renderiza card  
  **THEN** muestra mensaje de estado vacio  
  **Estado:** Cubierto

---

## Escenarios recomendados (faltantes)

1. **Auth UI loading detallado en pages**  
   GIVEN login en curso / WHEN renderiza `LoginPage` / THEN verifica texto `Ingresando...` y boton disabled.

2. **External Services fallback errors por tipo**  
   GIVEN error sin `message` / WHEN ejecuta feedback / THEN usa `fallbackErrorMessage` correspondiente.

3. **Accesibilidad ampliada en auth y servicios**  
   GIVEN error/success visible / WHEN renderiza / THEN validar `role` + `aria-live` en todos los formularios.

4. **Persistencia real de sesion + tema integrada**  
   GIVEN recarga de app / WHEN inicializa hooks / THEN toma valores de storage y aplica tema correcto.
