import dynamic from 'next/dynamic';

const SignupForm = dynamic(() => import('@/components/SignupForm'), { ssr: false });

const SignUp = () => {
  return <SignupForm />;
};
export default SignUp;
