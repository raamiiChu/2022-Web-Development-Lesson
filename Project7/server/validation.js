import Joi from "joi";

const registerValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string().min(3).max(50).required(),
        email: Joi.string()
            .min(6)
            .max(100)
            .required()
            .email({ minDomainSegments: 2 }),
        password: Joi.string().min(6).max(1024).required(),
        role: Joi.string().valid("student", "instructor"),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .max(100)
            .required()
            .email({ minDomainSegments: 2 }),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
};

const courseValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
    });

    return schema.validate(data);
};

export { registerValidation, loginValidation, courseValidation };
