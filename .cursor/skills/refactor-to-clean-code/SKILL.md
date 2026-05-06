---
name: refactor-to-clean-code
description: >-
  Refactors existing code toward Clean Code: SOLID, DRY, clear separation of
  concerns, better naming and structure, removal of duplication and oversized
  functions, while preserving observable behavior. Use when the user asks for
  refactoring, clean code, deduplication, shorter functions, readability
  improvements, or mentions refactor_to_clean_code / SOLID / DRY in a
  maintainability context.
---

# Refactor a Clean Code

## Rol

Actuar como experto en **refactor hacia Clean Code**: mejorar diseño y legibilidad **sin cambiar el comportamiento observable**, salvo que el usuario pida explícitamente un cambio de contrato o de requisitos.

## Flujo obligatorio (orden)

1. **Inventario**  
   Leer el código afectado, su contexto, dependencias y, si existen, pruebas relacionadas.

2. **Línea base de comportamiento**  
   Si el repositorio tiene suite de pruebas, usarla como comprobación antes y después. Si no hay pruebas, fijar criterios mínimos de equivalencia o pedir al usuario qué debe seguir siendo cierto tras el cambio.

3. **Aplicar mejoras** (priorizar refactors mecánicos y seguros primero)  
   - **SOLID**: sobre todo **una responsabilidad** por módulo/función y dependencias razonables.  
   - **DRY**: unificar lógica duplicada con abstracciones adecuadas al dominio.  
   - **Separación de responsabilidades**: capas y archivos alineados con el estilo del proyecto (UI vs lógica vs integración, etc.).

4. **Mejorar**  
   - **Naming**: nombres que expresen intención.  
   - **Estructura**: organización clara de archivos y funciones.  
   - **Legibilidad**: flujos lineales, niveles de abstracción consistentes.

5. **Eliminar o reducir**  
   - Código duplicado.  
   - Funciones demasiado largas (extraer con criterio).  
   - Organización confusa o acoplamiento innecesario.  
   Preferir **nombres y estructura** a comentarios que compensen nombres malos.

## Restricciones

- **No** añadir funcionalidad nueva ni “de paso” ampliar el alcance fuera de lo pedido.  
- **No** reescribir el stack del proyecto: respetar convenciones (imports, estilo, arquitectura existente).  
- **TDD / nuevas pruebas**: no es el foco de esta skill; si ya hay tests, **mantenerlos en verde**. Añadir pruebas mínimas solo si el usuario lo pide o es imprescindible para demostrar equivalencia.

## Entregable (obligatorio)

1. **Código refactorizado** (cambios concretos en archivos o diff claro).  
2. **Explicación breve de mejoras**: viñetas por tipo (p. ej. SRP, DRY, nombres, extracción de bloques), sin documentación extensa.

## Comprobación final

- [ ] Comportamiento equivalente al acordado (tests en verde o criterio explícito).  
- [ ] Duplicación y funciones desmesuradas abordadas donde correspondía.  
- [ ] Nombres y estructura alineados con el resto del repositorio.  
- [ ] Sin refactors o archivos ajenos al alcance.

## Combinar con otras skills

Según la capa: `frontend-expert`, `backend-expert` o `qa-testing-expert` cuando haga falta criterio fino de stack, dominio o pruebas adicionales.
