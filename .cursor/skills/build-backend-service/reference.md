# Referencia: estructuras sugeridas

Ajustar nombres a lo que ya exista en el repositorio. Estas plantillas son orientativas.

## NestJS (módulo por feature)

```text
src/
  {feature}/
    {feature}.module.ts
    {feature}.controller.ts
    dto/
      create-{entity}.dto.ts
      update-{entity}.dto.ts
    {feature}.service.ts
    {feature}.repository.ts    # o infrastructure/repositories/
    entities/                 # o domain/ según el repo
      {entity}.entity.ts
```

- El `Module` importa `TypeOrmModule.forFeature([...])` u orquestación equivalente.
- Filtro de excepciones o interceptor global: según el proyecto.

## Laravel (por feature bajo `app` o módulo)

```text
app/
  Http/
    Controllers/{Feature}Controller.php
    Requests/Store{Entity}Request.php
    Resources/{Entity}Resource.php          # si el proyecto usa API Resources
  Models/{Entity}.php
  Services/{Feature}Service.php
  Repositories/{Entity}Repository.php       # o Eloquent restringido a esta capa
```

- Rutas en `routes/api.php` o archivos de rutas modulares.
- Policies o Gates si hay autorización; no mezclar con reglas de negocio de dominio en el controller.

## Nombres y REST (referencia)

- Recurso en plural: `/api/{resources}`.
- Verbos: GET/POST/PUT|PATCH/DELETE mapeados a intención clara; códigos 201 en creación, 204 en borrado sin cuerpo, 404/409/422 según el caso.
