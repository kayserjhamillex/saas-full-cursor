# Manual de Desarrollo

## 1. Objetivo

Definir el proceso estandar para preparar el entorno local de desarrollo del proyecto `saasodontologico`, desde la clonacion del repositorio hasta la validacion inicial del sistema.

## 2. Alcance

Este manual esta orientado al equipo tecnico (desarrolladores backend, frontend, QA tecnico y DevOps).

## 3. Prerrequisitos

- Git instalado.
- Node.js 20+.
- pnpm instalado globalmente.
- Docker Desktop instalado y en ejecucion.
- Python 3.11+ (para `ai-service`).
- PowerShell (Windows) o terminal equivalente.

## 4. Clonacion del repositorio

Desde una carpeta de trabajo local:

```bash
git clone <URL_DEL_REPOSITORIO> saasodontologico
cd saasodontologico
```

Si el repositorio usa ramas de trabajo:

```bash
git checkout -b feature/mi-cambio
```

## 5. Estructura principal del proyecto

- `apps/`: microservicios backend.
- `frontend/`: aplicaciones frontend (demo, React y Angular).
- `services/`: servicios externos (email, WhatsApp, archivos).
- `ai-service/`: servicio de IA en Python.
- `docker/`: archivos de infraestructura local.
- `documentacion/`: guias, fases y manuales.

## 6. Configuracion de variables de entorno

1. Crear o verificar el archivo `.env` en la raiz.
2. Confirmar al menos estas variables base:

- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=123`
- `DB_NAME=saasodontologico`
- `JWT_SECRET=<valor_local_seguro>`

3. Ajustar URLs de servicios segun puertos activos en tu entorno.

## 7. Levantar dependencias base (Docker)

Levantar infraestructura local:

```bash
docker compose -f docker/docker-compose.yml up -d
docker ps
```

Validar que PostgreSQL este en estado `Up`.

## 8. Instalacion de dependencias

Ejecutar por cada modulo que vayas a trabajar:

```bash
cd apps/auth-service
pnpm install
```

Repetir el mismo patron para los demas servicios en `apps/`, `frontend/` y `services/`.

## 9. Ejecucion de servicios en desarrollo

### 9.1 Backend principal

Ejemplo de arranque de servicios clave (en terminales separadas):

```bash
cd apps/auth-service
pnpm start:dev
```

```bash
cd apps/core-service
pnpm start:dev
```

```bash
cd apps/api-gateway
pnpm start:dev
```

### 9.2 AI service

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 9.3 Frontend

Iniciar segun app objetivo:

- `frontend/demo-app`
- `frontend/react-app`
- `frontend/angular-app`

## 10. Verificaciones iniciales

- Confirmar endpoints de salud (`/health`) en servicios activos.
- Validar que el gateway responda en `http://localhost:3000`.
- Validar que frontend cargue sin errores de compilacion.
- Validar conexion a base de datos sin errores en logs.

## 11. Flujo de trabajo recomendado

1. Actualizar rama base:

```bash
git pull origin <rama_base>
```

2. Crear rama de trabajo:

```bash
git checkout -b feature/<descripcion-corta>
```

3. Desarrollar y probar cambios localmente.
4. Ejecutar pruebas y validaciones.
5. Crear commit con mensaje claro.
6. Abrir Pull Request con contexto tecnico y plan de pruebas.

## 12. Convenciones minimas

- No subir secretos ni credenciales reales al repositorio.
- Mantener cambios acotados por PR.
- Documentar cambios relevantes en `documentacion/` cuando aplique.
- Evitar mezclar refactor grande con cambios funcionales no relacionados.

## 13. Solucion de problemas frecuentes

- **Puerto ocupado**: detener proceso previo o cambiar puerto en configuracion local.
- **Error de conexion a DB**: revisar `docker ps`, `.env` y estado de contenedor PostgreSQL.
- **Error de dependencias**: eliminar `node_modules` del modulo afectado y reinstalar.
- **Fallo en AI service**: verificar entorno virtual activo e instalacion de `requirements.txt`.

## 14. Referencias

- `documentacion/manualdeusuario.md`
- `documentacion/instrucciones/`
- `documentacion/avance/`
