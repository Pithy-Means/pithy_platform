import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function StarRating() {
  return (
    <div className="flex text-green-500 border border-solid border-green-500  rounded-md px-6 py-2 w-fit gap-2 ">
      <FaStar size={20}/>
      <FaStar size={20}/>
      <FaStar size={20}/>
      <FaStar size={20}/>
      <FaStarHalfAlt size={20}/>
    </div>
  );
}
