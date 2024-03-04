'use client'
import { useEffect, useState } from "react";
import { ProductParams, ReviewParams } from "../../../../constants/constants";
import { getReviews, } from "../../../../utils/utils";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { IconType } from "react-icons";
import Loader from "../../../../components/Loader";

const Reviews = ({ currentProduct }: { currentProduct: ProductParams }) => {

    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const update = async () => {
            try {
                const revs = await getReviews(currentProduct.id);
                console.log("Fetched Reviews:", revs);
                setReviews(revs);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }

        update();
    }, []);

    // Use useEffect to log the reviews whenever the reviews state changes

    return (
        <div className="flex flex-col justify-center items-center m-[2rem]">
            <div className="bg-blue-500 p-[1rem] rounded-xl"><span className="text-center font-semibold text-[27px]">REVIEWS</span></div>
            {reviews.length === 0 ? (
                <div className="py-4"><Loader/></div>
            ) : (
                reviews.map((review: ReviewParams, i: number) => {

                    const user = review.userObj
                    const stars = []
                    for (let i = 0; i < 5; i++) {
                        stars.push(
                            i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                        );
                    }

                    return (<div key={i} className="relative flex p-4 gap-4 m-4 items-center justify-center bg-white rounded-xl w-[50vw] h-[25vh]">

                        <div className="flex flex-col items-center justify-center mx-4 w-[6.8vw]">
                            <a href={`/profile/${user.userID}`}><img src={user.photoURL} className="w-[6.8vw] rounded-full" alt="" /></a>
                            <span className="text-[20px] font-semibold">{user.name}</span>
                        </div>

                        <div className="w-full">
                            <p className="text-[25px] overflow-auto">{review.text}</p>
                        </div>


                        <div className="flex absolute items-center top-4 right-[30px] w-auto text-center">
                        <span className="flex items-center justify-center text-[25px] text-yellow-400">{stars}</span>
                        </div>
                        

                    </div>)
                }
                )
            )}
        </div>
    );
}

export default Reviews;