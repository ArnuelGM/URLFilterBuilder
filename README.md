## Documentación de Uso

La clase `URLFilterBuilder` proporciona una forma segura y estructurada de construir filtros para consultas de backend a través de los query parameters de la URL.
Evita la manipulación manual de cadenas y asegura que los filtros se formateen correctamente según las reglas especificadas.

### Métodos Disponibles

| Método                          | Descripción                    | Ejemplo de uso                            |
| ------------------------------- | ------------------------------ | ----------------------------------------- |
| `.equals(key, val)`             | Igual a                        | `.equals("city", "madrid")`               |
| `.notEquals(key, val)`          | Distinto de                    | `.notEqual("status", "inactive")`         |
| `.greaterThan(key, val)`        | Mayor que                      | `.greaterThan("edad", 21)`                |
| `.greaterThanOrEqual(key, val)` | Mayor o igual que              | `.greaterThanOrEqual("edad", 18)`         |
| `.lessThan(key, val)`           | Menor que                      | `.lessThan("price", 100)`                 |
| `.lessThanOrEqual(key, val)`    | Menor o igual que              | `.lessThanOrEqual("price", 500)`          |
| `.like(key, val)`               | Búsqueda con `LIKE`            | `.like("name", "juan")`                   |
| `.notLike(key, val)`            | Búsqueda con `NOT LIKE`        | `.notLike("name", "admin")`               |
| `.in(key, array)`               | Lista de valores (IN)          | `.in("id", [1, 2, 3])`                    |
| `.notIn(key, array)`            | Lista excluida (NOT IN)        | `.notIn("status", ["banned", "deleted"])` |
| `.between(key, [a, b])`         | Rango entre valores            | `.between("edad", [18, 30])`              |
| `.toString()`                   | Devuelve la query string final | `"edad=%3E%3D:18&city=madrid"`            |

---

## Ejemplos de Uso

```javascript
const filters = new URLFilterBuilder();

const query = filters
  .greaterThanOrEqual("edad", 18)
  .equals("city", "madrid")
  .like("name", "juan")
  .in("id", [1, 2, 3, 4])
  .toString();

console.log(query);
// Resultado:
// edad=%3E%3D:18&city=madrid&name=%7E:juan&id=in%3A1%2C2%2C3%2C4
```

### URL Final

```http
GET /usuarios?edad=%3E%3D:18&city=madrid&name=%7E:juan&id=in%3A1%2C2%2C3%2C4
```

---

### Unicidad de Propiedades

Cada propiedad (o clave) utilizada en los filtros es **única** dentro de una instancia de `URLFilterBuilder`. Esto significa que **no se permite repetir la misma propiedad**, incluso si se intenta aplicar con un método diferente.

Si se invoca un nuevo método con una clave ya utilizada previamente, el valor y operador anteriores serán **reemplazados** por el nuevo. Esta decisión de diseño garantiza que la URL resultante no contenga parámetros duplicados, lo cual podría generar ambigüedad en el backend.

**Ejemplo:**

```javascript
filters
  .equals("status", "active")
  .notEquals("status", "inactive"); // reemplaza el filtro anterior
```

Resultado final:

```
status=!=:inactive
```

---

## Consideraciones sobre Strings

Cuando se utilizan valores de tipo `string` en cualquiera de los métodos u operadores disponibles, **es un error encerrarlos entre comillas simples o dobles**.
Esto aplica para todos los métodos: `.equals()`, `.like()`, `.in()`, `.between()`, etc.

**Ejemplo válido:**

```javascript
.equals("status", "active") // ✅ correcto
```

**Causa error:**

```javascript
.equals("status", "'active'") // 🚫 error
```

---

## Validaciones

* `.between()` lanza error si no se pasan exactamente dos valores.
* Todos los valores son convertidos a string automáticamente.
* Se utiliza `encodeURIComponent` para evitar conflictos de caracteres especiales.
