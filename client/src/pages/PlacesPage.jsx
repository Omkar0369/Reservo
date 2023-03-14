import { Link, useParams } from "react-router-dom";

export default function PlacesPage(){
    const {action}=useParams();
    
    return (
        <div>
            {action!='new' && (
            <div className="text-center mb-4 ">
                <Link className="inline-flex gap-1 bg-red-500 text-white 
                py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            )}
            {
                action==='new' && (
                    <div className="">
                        <form action="">
                            <h2 className="text-2xl mt-4 text-left">Title</h2>
                            <p className='text-gray-500 text-left text-sm'>Title for your place, should be short and catchy</p>
                            <input type="text" placeholder="title,eg: My Lovely Apt " />
                            <h2 className="text-2xl mt-4 text-left">Address</h2>
                            <p className='text-gray-500 text-left text-sm'>Address of the place</p>
                            <input type="text" placeholder="address" /> 
                            <h2 className="text-2xl mt-4 text-left">Photos</h2>
                            <p className='text-gray-500 text-left text-sm'>more=better</p>
                            <div className="mt-4 text-left grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                <button className="border border-black bg-transparent p-8 rounded-2xl text-3xl text-gray-600">+</button>
                            </div>
                            
                        </form>
                    </div>
                 )
            }
        </div>
    );
}