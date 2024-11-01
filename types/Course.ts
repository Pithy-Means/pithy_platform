 export default interface Course {
  _id: string | number;
  title: string;
  image: string;
  duration: string;
  learners: number;
  originalPrice: string;
  price?: string;
  description?: string;
  isFree?: string;
}
