import ProductCard from "../../../../components/ProductCard";
import { getAllProductsOfUser, getUser } from "../../../../utils/utils";
import '../../../../components/css/index.css'

const Profile = async ({ params }: { params: { profileID: string } }) => {

    const user = await getUser(params.profileID.toString())
    const products = await getAllProductsOfUser(params.profileID)

    return (
        <div className="px-[10rem]">
            <div className="flex justify-around">
                <div className="w-[20rem] flex flex-col justify-start mt-[2rem] items-center">
                    <img src={user.photoURL} className='rounded-[50%] border-4 border-black' alt="" />
                    <p className="text-center text-[40px]">{user.name}</p>
                </div>

                <div className="w-[10rem]"></div>

                <div className="mx-[3rem] w-full bg-blue-300 p-4 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-center">All Products of This User</span>
                    <div className="mx-[3rem] w-full p-4 rounded-xl grid grid-cols-4">
                        {products.map((product) => (<div className="m-2" key={product.id}><ProductCard params={product} /></div>))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;