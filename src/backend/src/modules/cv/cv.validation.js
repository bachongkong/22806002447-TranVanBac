import Joi from 'joi'

export const createOnlineCvSchema = Joi.object({
  title: Joi.string().required().max(100),
  parsedData: Joi.object({
    summary: Joi.string().allow('', null),
    skills: Joi.array().items(Joi.string()).default([]),
    education: Joi.array().items(
      Joi.object({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        field: Joi.string().required(),
        from: Joi.date().iso().required(),
        to: Joi.date().iso().allow(null).optional(),
      })
    ).default([]),
    experience: Joi.array().items(
      Joi.object({
        company: Joi.string().required(),
        position: Joi.string().required(),
        from: Joi.date().iso().required(),
        to: Joi.date().iso().allow(null).optional(),
        description: Joi.string().allow('', null).optional(),
      })
    ).default([]),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('', null).optional(),
        url: Joi.string().uri().allow('', null).optional(),
      })
    ).default([]),
  }).required(),
})

export const updateOnlineCvSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  parsedData: Joi.object({
    summary: Joi.string().allow('', null),
    skills: Joi.array().items(Joi.string()),
    education: Joi.array().items(
      Joi.object({
        school: Joi.string(),
        degree: Joi.string(),
        field: Joi.string(),
        from: Joi.date().iso(),
        to: Joi.date().iso().allow(null),
      })
    ),
    experience: Joi.array().items(
      Joi.object({
        company: Joi.string(),
        position: Joi.string(),
        from: Joi.date().iso(),
        to: Joi.date().iso().allow(null),
        description: Joi.string().allow('', null),
      })
    ),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        description: Joi.string().allow('', null),
        url: Joi.string().uri().allow('', null),
      })
    ),
  }).optional(),
})

export const cvIdParamSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
})
