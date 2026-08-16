import { Prisma } from "@/generated/prisma";
import { Serialized } from "./product";

export type SerializedFavorite = Serialized<Prisma.FavoriteGetPayload<{ include: { item: true } }>> & {
    owner?: Serialized<Prisma.UserGetPayload<{}>>;
};