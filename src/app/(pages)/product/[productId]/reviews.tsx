import { SerializedProductWithSeller } from "@/types/product";
import Review from "../../../../components/Review";
import { prisma } from "../../../../lib/prisma";

const Reviews = async ({ currentProduct }: { currentProduct: SerializedProductWithSeller | null }) => {
    if (!currentProduct) return null;

    const reviews = await prisma.review.findMany({
        where: {
            productId: currentProduct.id,
        },
        include: {
            owner: true,
        },
    });

    return (
        <section id="reviews" className="w-full mt-10">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Customer Feedback & Reviews</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Verified ratings and feedback from certified customers.
                    </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-xl border border-sky-100 p-8 text-center text-slate-500 text-xs font-medium">
                    No customer reviews yet for this product. Be the first to leave a review!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review, i: number) => (
                        <Review key={review.id || i} user={review.owner} i={i} review={review} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Reviews;