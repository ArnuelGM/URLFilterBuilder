## 📘 Documentación de Uso

La clase `URLFilterBuilder` proporciona una forma segura y estructurada de construir filtros para consultas de backend a través de los query parameters de la URL.
Evita la manipulación manual de cadenas y asegura que los filtros se formateen correctamente según las reglas especificadas.

### 🛠 Métodos Disponibles

| Método                              | Descripción                    | Ejemplo de uso                            |
| ----------------------------------- | ------------------------------ | ----------------------------------------- |
| `.equals(key, val)`                 | Igual a                        | `.equals("city", "madrid")`               |
| `.notEquals(key, val)`              | Distinto de                    | `.notEqual("status", "inactive")`         |
| `.greaterThan(key, val)`            | Mayor que                      | `.greaterThan("edad", 21)`                |
| `.greaterThanOrEqual(key, val)`     | Mayor o igual que              | `.greaterThanOrEqual("edad", 18)`         |
| `.lessThan(key, val)`               | Menor que                      | `.lessThan("price", 100)`                 |
| `.lessThanOrEqual(key, val)`        | Menor o igual que              | `.lessThanOrEqual("price", 500)`          |
| `.like(key, val)`                   | Búsqueda con `LIKE`            | `.like("name", "juan")`                   |
| `.in(key, array)`                   | Lista de valores (IN)          | `.in("id", [1, 2, 3])`                    |
| `.notIn(key, array)`                | Lista excluida (NOT IN)        | `.notIn("status", ["banned", "deleted"])` |
| `.between(key, [a, b])`             | Rango entre valores            | `.between("edad", [18, 30])`              |
| `.toString()`                       | Devuelve la query string final | `"edad=%3E%3D:18&city=madrid"`            |

---

## ✅ Ejemplos de Uso

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

### 🔗 URL Final

```http
GET /usuarios?edad=%3E%3D:18&city=madrid&name=%7E:juan&id=in%3A1%2C2%2C3%2C4
```

---

## ⚠️ Validaciones

* `.between()` lanza error si no se pasan exactamente dos valores.
* Todos los valores son convertidos a string automáticamente.
* Se utiliza `encodeURIComponent` para evitar conflictos de caracteres especiales.
