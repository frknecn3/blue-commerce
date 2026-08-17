import bcrypt from "bcryptjs";
import { Category, Prisma, PrismaClient, User, Store, Product, Cart } from "../src/generated/prisma";
import { prisma } from "../src/lib/prisma";
import { faker } from '@faker-js/faker';

async function main() {
    console.log("Starting Seeding...")
    console.log("Clearing old data...");

    await prisma.review.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.store.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();


    const users: User[] = [];
    let ids: string[] = [];
    const stores: Store[] = [];
    const products: Product[] = [];

    // * CREATE USERS
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data:
            {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: await bcrypt.hash("123456",10),
                avatar: faker.image.avatar(),
                newsletter: true,
                phone: faker.phone.number(),
                country: faker.location.countryCode('alpha-2'),
                defaultDeliveryLocation: faker.location.streetAddress(),
            }
        })

        users.push(user)
        ids.push(user.id)
    }

    // * CREATE STORES

    for (let i = 0; i < 5; i++) {

        const randomIndex = Math.floor(Math.random() * ids.length)

        // remove the id that has already been picked
        const [oId] = ids.splice(randomIndex, 1)

        const store: Store = await prisma.store.create({
            data: {
                ownerId: oId,
                storeName: faker.company.name(),
                avatar: faker.image.avatarGitHub()
            }
        })

        stores.push(store)


    }

    const categories: Category[] = [];

    // * CREATE CATEGORIES

    for (let i = 0; i < 10; i++) {
        const cat = await prisma.category.create({
            data: {
                name: faker.commerce.department(),
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.urlPicsumPhotos({width: 1000, height: 500})
            }
        })

        categories.push(cat);
    }


    // * CREATE PRODUCTS
    for (let i = 0; i < 20; i++) {
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 200 })).toFixed(2),
                imageUrl: faker.image.urlPicsumPhotos({width: 1000, height: 500}),
                categoryId: categories[Math.floor(Math.random() * categories.length)].id,
                stock: faker.number.int({ min: 3, max: 200 }),
                sellerId: stores[Math.floor(Math.random() * stores.length)].id,
                status: "ACTIVE"
            },
            include: {
                category: true
            }
        })

        products.push(product)
    }

    // * CREATE REVIEWS

    for (let product of products) {
        await prisma.review.create({
            data: {
                ownerId: users[Math.floor(Math.random() * users.length)].id,
                rating: faker.number.int({
                    min: 1,
                    max: 5
                }),
                text: faker.lorem.sentences({ min: 3, max: 5 }),
                productId: product.id
            }
        })
    }



    // * CREATE CARTS

    let carts: Cart[] = [];

    for (let user of users) {
        const cart = await prisma.cart.create({
            data: {
                userId: user.id,
            }
        })

        carts.push(cart);

        console.log("creating cart for user: ", user.id, " cart: ", cart)
    }

    // * CREATE CART ITEMS

    for (let cart of carts) {
        console.log(cart)
        const itemCount = [...Array(Math.floor(Math.random() * 5) + 1)]

        const addedItemIDs = new Set<string>()

        while (addedItemIDs.size < itemCount.length) {
            {
                let randomID = products[Math.floor(Math.random() * products.length)].id
                if (addedItemIDs.has(randomID)) {
                    console.log("already have it")
                    continue
                };

                const item = await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: randomID,
                    }
                })

                addedItemIDs.add(randomID);
                console.log(item)
            }
        }
    }

    // CREATE AN ADMIN USER

    const password = await bcrypt.hash("123456", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@bluecommerce.com" },
        update: {},
        create: {
            name: "Admin Ayya",
            email: "admin@bluecommerce.com",
            password: password,
            role: "ADMIN",
            avatar: "https://i.pravatar.cc/150?u=admin",
        },
    });

    const demoUser = await prisma.user.upsert({
        where: { email: "user@bluecommerce.com" },
        update: {},
        create: {
            name: "Demo Customer",
            email: "user@bluecommerce.com",
            password: password,
            role: "USER",
            avatar: "https://i.pravatar.cc/150?u=demouser",
        },
    });

    console.log("Seeding Finished (Admin & Demo Customer ready)")
}

// const allUsers: User[] = await prisma.user.findMany({
//     include: {
//         reviews: true,
//         orders: true
//     }
// })

// console.log("ALL USERS: ", allUsers)


main()
    .then(async (): Promise<void> => {
        await prisma.$disconnect()
    })
    .catch(async (e): Promise<Error | void> => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })