import Link from 'next/link'
import React from 'react'

const SignInPage = () => {
  return (
    <div className='flex justify-between w-full items-center text-base bg-white/85'>
      <div className='text-black mx-4'>
        <div className=''>
          <h1>Welcome back!</h1>
        </div>
        <div>
          <form>
            <div>
              <label>Email</label>
              <input type="email" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" />
            </div>
            <Link href="/auth/forgot-password">Forgot Password?</Link>
            <button type="submit">Login</button>
          </form>
        </div>
        <div>
          <div></div>
          <p>or continue with</p>
          <div></div>
        </div>
        <div>
          <button>Google</button>
          <button>Facebook</button>
          <button>Apple</button>
        </div>
        <div>
          <p>Don&lsquo;t have an account?</p>
          <Link href="/auth/signup">Sign Up</Link>
        </div>
      </div>
      <div>
        <div>
          <svg>
            <image xlinkHref="./public/assets/C05_6.png"  height="100" width="100" />
          </svg>
        </div>
        <div>
          <svg>
            <image xlinkHref="./public/assets/C12_22.png"  height="100" width="100" />
          </svg>
        </div>
        <div>
          <svg>
            <image xlinkHref="./public/assets/C2_15.png"  height="100" width="100" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SignInPage