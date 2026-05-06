# Fase 5 — Inteligencia Artificial, Procesamiento de Imágenes e Integración Clínica

---

1. Descripción de la fase

Esta fase implementa el módulo de inteligencia artificial del sistema, orientado al procesamiento de imágenes clínicas odontológicas y generación de resultados asistidos (diagnóstico o apoyo diagnóstico).

El servicio de IA se desarrolla de forma desacoplada mediante FastAPI, permitiendo su integración con el dominio clínico sin afectar la arquitectura principal.

Esta fase permite:

* Procesamiento automatizado de imágenes
* Generación de resultados estructurados
* Integración directa con la historia clínica
* Soporte a decisiones clínicas

Depende estrictamente de:

* /documentacion/reglas
* /documentacion/database
* Fase 1 (seguridad y acceso)
* Fase 3 (dominio clínico)

---

2. Objetivo técnico

Implementar un servicio de IA que permita:

* Recepción de imágenes clínicas
* Procesamiento mediante modelos (CNN / U-Net)
* Generación de resultados diagnósticos
* Almacenamiento de resultados
* Integración con historia clínica
* Exposición mediante API REST

---

3. Carpetas involucradas

/ai-service
/apps/clinical-service
/apps/api-gateway
/documentacion/reglas
/documentacion/database
/documentacion/avance

---

4. Responsabilidades por carpeta

/ai-service

* Recepción de imágenes
* Procesamiento mediante modelos de IA
* Generación de resultados
* Exposición de endpoints REST
* Manejo de modelos de machine learning

/apps/clinical-service

* Envío de imágenes al servicio IA
* Recepción de resultados
* Integración en historia clínica
* Registro en cronología

/apps/api-gateway

* Validación de acceso (JWT + tenant)
* Enrutamiento hacia clinical-service

/documentacion/reglas

* Definición de arquitectura y separación de responsabilidades
* Validación de seguridad

/documentacion/database

* Tablas:

  * images
  * ai_results

/documentacion/avance

* Registro del progreso técnico

---

5. Flujo de datos

Procesamiento de imagen

1. Usuario carga imagen clínica
2. Request pasa por API Gateway
3. Llega a clinical-service
4. clinical-service envía imagen a ai-service
5. ai-service procesa la imagen
6. Se genera resultado
7. Resultado retorna a clinical-service
8. Se almacena en base de datos
9. Se vincula a historia clínica

---

Flujo de consulta de resultados

1. Usuario solicita resultados
2. clinical-service consulta ai_results
3. Se retorna información

---

6. Interacción entre microservicios

* api-gateway → clinical-service
* clinical-service → ai-service

Reglas:

* IA no accede directamente a base de datos principal
* clinical-service gestiona persistencia

---

7. Eventos (event-driven)

Eventos definidos:

* image_uploaded
* image_processed
* ai_result_generated

Uso:

* auditoría
* monitoreo
* integración futura

---

8. Estructura lógica interna

/ai-service

* routes:

  * prediction.route

* services:

  * ai_processing.service
  * image.service

* models:

  * cnn.model
  * unet.model

* utils:

  * preprocessing
  * postprocessing

---

9. Reglas de negocio

* Toda imagen debe estar asociada a un paciente
* Todo resultado debe vincularse a una consulta clínica
* No se permite resultado sin procesamiento
* Resultados deben ser auditables
* IA actúa como soporte, no reemplaza diagnóstico médico

---

10. Validaciones

* formato de imagen válido
* tamaño permitido
* integridad de datos
* correspondencia paciente-imagen
* consistencia con base de datos

---

11. Seguridad

* Validación JWT
* Validación tenant
* Control de acceso a imágenes
* Protección de datos sensibles
* Manejo seguro de archivos

---

12. Testing (TDD / BDD / DDD)

TDD

* procesamiento de imagen
* generación de resultados

Integración

* flujo completo clinical-service → ai-service

DDD

* validación dominio clínico + IA

---

13. Dependencias técnicas

* FastAPI
* Python
* TensorFlow / PyTorch
* OpenCV
* PostgreSQL
* Docker

---

14. Riesgos técnicos

* baja precisión del modelo
* procesamiento lento
* errores en integración
* manejo incorrecto de imágenes
* sobrecarga del servicio IA

---

15. Resultado esperado

* Servicio de IA funcional
* Integración completa con sistema clínico
* Procesamiento de imágenes operativo
* Resultados almacenados correctamente
* Base lista para evolución de modelos

---

16. Registro de avance (documentacion/avance)

Se debe generar:

/documentacion/avance/fase_5.md

Contenido:

* Fecha de implementación
* Servicios implementados:

  * ai-service
  * integración con clinical-service
* Funcionalidades completadas:

  * carga de imágenes
  * procesamiento IA
  * generación de resultados
* Integración con base de datos validada
* Reglas aplicadas
* Pruebas ejecutadas
* Problemas encontrados
* Decisiones técnicas

---
