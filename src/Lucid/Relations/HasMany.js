'use strict'

/**
 * adonis-lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Relation = require('./Relation')
const NE = require('node-exceptions')
const helpers = require('../QueryBuilder/helpers')
class ModelRelationException extends NE.LogicalException {}
class ModelRelationSaveException extends NE.LogicalException {}

class HasMany extends Relation {

  constructor (parent, related, primaryKey, foriegnKey) {
    super()
    this.parent = parent
    this.related = related
    this.relatedQuery = this.related.query()
    this.fromKey = primaryKey
    this.toKey = foriegnKey
  }

  /**
   * will eager load the relation for multiple values on related
   * model and returns an object with values grouped by foreign
   * key.
   *
   * @param {Array} values
   * @return {Object}
   *
   * @public
   *
   */
  * eagerLoad (values, scopeMethod) {
    if (typeof (scopeMethod) === 'function') {
      scopeMethod(this.relatedQuery)
    }
    const results = yield this.relatedQuery.whereIn(this.toKey, values).fetch()
    return results.groupBy((item) => {
      return item[this.toKey]
    }).mapValues(function (value) {
      return helpers.toCollection(value)
    })
    .value()
  }

  /**
   * will eager load the relation for multiple values on related
   * model and returns an object with values grouped by foreign
   * key. It is equivalent to eagerLoad but query defination
   * is little different.
   *
   * @param  {Mixed} value
   * @return {Object}
   *
   * @public
   *
   */
  * eagerLoadSingle (value, scopeMethod) {
    if (typeof (scopeMethod) === 'function') {
      scopeMethod(this.relatedQuery)
    }
    const results = yield this.relatedQuery.where(this.toKey, value).fetch()
    const response = {}
    response[value] = results
    return response
  }

}

module.exports = HasMany
