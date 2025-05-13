/**
 * Clase para construir filtros de manera segura para URLs de backend.
 */
export class URLFilterBuilder {
  constructor() {
    this.filters = {};
    // this.allowedOperators = ['>', '>=', '<', '<=', '!=', '~', 'in', '!in', '><'];
  }

  /**
   * Agrega un filtro de igualdad.
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor a buscar.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  equals(key, value) {
    this.filters[key] = this._encodeValue(value);
    return this;
  }

  /**
   * Agrega un filtro "mayor que".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor de comparación.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  greaterThan(key, value) {
    this.filters[key] = `>:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "mayor o igual que".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor de comparación.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  greaterThanOrEqual(key, value) {
    this.filters[key] = `>=:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "menor que".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor de comparación.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  lessThan(key, value) {
    this.filters[key] = `<:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "menor o igual que".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor de comparación.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  lessThanOrEqual(key, value) {
    this.filters[key] = `<=:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "diferente a".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {any} value - Valor a comparar.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  notEquals(key, value) {
    this.filters[key] = `!=:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "like" (contiene).
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {string} value - Subcadena a buscar.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  like(key, value) {
    this.filters[key] = `~:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "not like" (no contiene).
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {string} value - Subcadena a buscar.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  notLike(key, value) {
    this.filters[key] = `!~:${this._encodeValue(value)}`;
    return this;
  }

  /**
   * Agrega un filtro "IN".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {Array<any>} values - Array de valores a buscar.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  in(key, values) {
    if (Array.isArray(values)) {
      this.filters[key] = `in:${values.map(this._encodeValue).join(',')}`;
    }
    return this;
  }

  /**
   * Agrega un filtro "NOT IN".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {Array<any>} values - Array de valores a excluir.
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   */
  notIn(key, values) {
    if (Array.isArray(values)) {
      this.filters[key] = `!in:${values.map(this._encodeValue).join(',')}`;
    }
    return this;
  }

  /**
   * Agrega un filtro "BETWEEN".
   * @param {string} key - Nombre del parámetro a filtrar.
   * @param {Array<any>} range - Array con dos valores representando el rango [min, max].
   * @returns {URLFilterBuilder} - La instancia actual para encadenar métodos.
   * @throws {Error} Si el rango no es un array de dos elementos.
   */
  between(key, range) {
    if (Array.isArray(range) && range.length === 2) {
      this.filters[key] = `><:${range.map(this._encodeValue).join(',')}`;
    } else {
      throw new Error('El rango para el operador BETWEEN debe ser un array de dos elementos.');
    }
    return this;
  }

  /**
   * Convierte los filtros construidos a una cadena de query params.
   * @returns {string} - Cadena de query params formateada.
   */
  toString() {
    return Object.keys(this.filters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.filters[key])}`)
      .join('&');
  }

  /**
   * Codifica un valor para ser utilizado en la URL.
   * @private
   * @param {any} value - El valor a codificar.
   * @returns {string} - El valor codificado.
   */
  _encodeValue(value) {
    return String(value);
  }
}

// Exporta la clase para su uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = URLFilterBuilder;
}
