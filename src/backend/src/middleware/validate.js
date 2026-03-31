import ApiError from '../common/ApiError.js'

/**
 * Validate request body/query/params bằng Joi schema
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), controller.register)
 *
 * Schema dạng:
 *   { body: JoiSchema }
 *   { query: JoiSchema }
 *   { params: JoiSchema }
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = []

    for (const [source, joiSchema] of Object.entries(schema)) {
      if (!req[source]) continue

      const { error, value } = joiSchema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      })

      if (error) {
        const messages = error.details.map((d) => d.message)
        errors.push(...messages)
      } else {
        req[source] = value // gán lại giá trị đã strip unknown fields
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors))
    }

    next()
  }
}

export default validate
