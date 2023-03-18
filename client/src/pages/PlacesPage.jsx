import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Perks from '../Perks';
import axios from "axios";
export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4 text-left">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-left text-sm">{text}</p>;
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const {data:filename}=await axios.post('/upload-by-link', { link: photoLink });
    setAddedPhotos(prev=>{
        return [...prev,filename];
    });
    setPhotoLink(''); 
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  return (
    <div>
      {action != 'new' && (
        <div className="text-center mb-4 ">
          <Link
            className="inline-flex gap-1 bg-red-500 text-white 
                py-2 px-6 rounded-full"
            to={'/account/places/new'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === 'new' && (
        <div className="">
          <form action="">
            {preInput(
              'Title',
              'Title for your place, should be short and catchy'
            )}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title,eg: My Lovely Apt "
            />

            {preInput('Address', 'Address of the place')}
            <input
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address"
            />

            {preInput('Photos', 'more=better')}

            <div className="flex gap-2">
              <input
                type="text"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                placeholder="Add using a link....jpg"
              />
              <button
              onClick={addPhotoByLink}
                className=" bg-gray-300 
                py-2 px-4 rounded-2xl"
              >
                Add&nbsp;photo
              </button>
            </div>
            <div className="mt-4 text-left grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {
                    addedPhotos.length>0 && addedPhotos.map(link=>
                        <div>
                            {link}
                        </div>
                        )
                }
              <button className="flex justify-center gap-1 border border-black bg-transparent p-8 rounded-2xl text-3xl text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </button>
            </div>
            {preInput('Description', 'Description of the place')}

            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            {preInput('Perks', 'Select all the perks of your place')}

            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra Info', 'House rules, etc')}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />

            {preInput('Check in & out times', 'dd check in and check out time')}

            <div className="text-left grid sm:grid-cols-3 gap-2">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="14"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="text"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="11"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Maximum number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                  placeholder=""
                />
              </div>
            </div>

            <div className="">
              <button className="mt-4 py-2 px-16 bg-red-500 text-white rounded-full">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
