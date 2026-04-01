import Joi from 'joi'

export const updateProfileSchema = {
  body: Joi.object({
    fullName: Joi.string().allow('', null).optional(),
    avatar: Joi.string().allow('', null).optional(),
    phone: Joi.string().allow('', null).optional(),
    address: Joi.string().allow('', null).optional(),
    
    // Candidate fields
    skills: Joi.array().items(Joi.string()).optional(),
    education: Joi.array().items(
      Joi.object({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        field: Joi.string().required(),
        from: Joi.date().iso().required(),
        to: Joi.date().iso().allow(null).optional()
      })
    ).optional(),
    experience: Joi.array().items(
      Joi.object({
        company: Joi.string().required(),
        position: Joi.string().required(),
        from: Joi.date().iso().required(),
        to: Joi.date().iso().allow(null).optional(),
        description: Joi.string().allow('', null).optional()
      })
    ).optional(),
    portfolioLinks: Joi.array().items(Joi.string().uri()).optional(),
    expectedSalary: Joi.number().min(0).optional(),
    preferredLocation: Joi.string().allow('', null).optional(),
    
    // HR fields
    roleTitle: Joi.string().allow('', null).optional()
  })
}

export const changePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  })
}
