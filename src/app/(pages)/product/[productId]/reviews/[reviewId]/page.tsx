import { notFound } from "next/navigation"

const ReviewDetail = ({
    params,
}:{
    params:{
        productId:string,
        reviewId:string
    }
}) => {

    const reviewId=params.reviewId
    const productId=params.productId

    if(parseInt(params.reviewId)>1000){
        notFound()
    }

    return (
        <div>
            Review no. {reviewId} of product no. {productId}
        </div>
    );
}

export default ReviewDetail;