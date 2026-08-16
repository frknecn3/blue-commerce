import { z } from 'zod';

export const AddItemSchema =
    z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().positive()
    })

export type AddItemDto = z.infer<typeof AddItemSchema>;

export const RemoveItemSchema =
    z.object({
        cartItemId: z.string()
    })

export type RemoveItemDto = z.infer<typeof RemoveItemSchema>

export const ProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    seller: z.string().min(1),
    stock: z.coerce.number().int().default(1),
    price: z.coerce.number().positive(),
    status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('DRAFT')
});

export type ProductDto = z.infer<typeof ProductSchema>


export const UpdateProductSchema = ProductSchema.partial();

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export const RegisterUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    phone: z.string().min(10),
    country: z.string(),
    defaultDeliveryLocation: z.string(),
    newsletter: z.preprocess(
        (val) => {
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
        },
        z.boolean().optional()
    ),
    terms: z.preprocess(
        (val) => {
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
        },
        z.boolean().refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        })
    ),
    cart: z.array(z.object(({
        productId: z.string(),
        quantity: z.coerce.string()
    })))
})

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;