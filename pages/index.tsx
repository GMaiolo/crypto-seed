import { useRouter } from "next/router";
import { useRef } from "react";
import { FaLock } from "react-icons/fa";
import { Dither } from "../components/Dither";

export default function Register() {
  const router = useRouter();
  const addressRef = useRef(null);

  const navigate = () => {
    if (!addressRef.current.value) return;
    router.push(`/${addressRef.current.value}`);
  };

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Dither width={150} height={150} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter your wallet address
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">Wallet address</label>
              <input
                ref={addressRef}
                id="wallet_address"
                name="Wallet address"
                type="text"
                className="appearance-none relative w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Wallet address"
              />
            </div>
          </div>

          <div>
            <button
              onClick={navigate}
              type="submit"
              className="group relative w-full text-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-400 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <figure className="absolute left-3 inset-y-0 flex items-center">
                <FaLock className="text-green-500 group-hover:text-green-600" />
              </figure>
              <span>Let's go</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
