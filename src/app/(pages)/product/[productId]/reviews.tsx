'use client'
import { useEffect, useState } from "react";
import { ProductParams, ReviewParams } from "../../../../constants/constants";
import { getReviews, } from "../../../../utils/utils";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { IconType } from "react-icons";
import Loader from "../../../../components/Loader";
import Review from "../../../../components/Review";

const Reviews = ({ currentProduct }: { currentProduct: ProductParams }) => {

    const [reviews, setReviews] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const revs = await getReviews(currentProduct.id);
                console.log("Fetched Reviews:", revs);
                setReviews(revs);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        })();
    }, []);

    // Use useEffect to log the reviews whenever the reviews state changes

    return (
        <div className="flex flex-col justify-center items-center m-[2rem]">
            {reviews.length === 0 ? (
                <div className="py-4"><Loader/></div>
            ) : (
                reviews.map((review: ReviewParams, i: number) => {
                    const user = review.userObj

                    return (<Review key={i} userRef={user} i={i} review={review}/> )
                }
                )
            )}
        </div>
    );
}

export default Reviews;