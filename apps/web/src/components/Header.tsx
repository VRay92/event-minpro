'use client';
import * as React from 'react';
import Image from 'next/image';
import { SlMagnifier } from 'react-icons/sl';
import { IoMenu } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUser } from '@/lib/features/userSlice';
import axios from 'axios';
import Searchbar from './Searchbar';
import { initDropdowns } from 'flowbite';
import { logout } from '@/lib/features/userSlice';

interface IEvent {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  startDate: any;
  endDate: any;
  time: string;
  availableSeats: string;
  isFree: boolean;
  organizerId: number;
  createdAt: any;
  updatedAt: any;
  maxTicket: number;
}
export const Header = () => {
  const [search, setSearch] = React.useState('');
  const [event, setEvent] = React.useState<IEvent[]>([]);
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const keepLogin = async () => {
      try {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('Token from local storage:', token);
        if (token && !isLoggedIn) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}auth/keeplogin`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (response.data.success) {
            console.log('KeepLogin response:', response.data);
            const { username, email, role } = response.data.data;
            localStorage.setItem('role', role);
            dispatch(
              setUser({
                username,
                email,
                role,
                token,
                isLoggedIn: true,
              }),
            );
            console.log('Dispatched role:', role);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    keepLogin();
  }, [dispatch, isLoggedIn]);

  const getEvent = async () => {
    try {
      console.log(`${process.env.NEXT_PUBLIC_BASE_API_URL}event/`);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}event/`,
      );
      console.log('getEvent response:', response.data);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    getEvent();
    initDropdowns();
  }, []);

  const filterData = event.filter((val: any) =>
    val.title.toLowerCase().startsWith(search),
  );
  console.log(filterData);
  return (
    <nav className={`w-full max-w-[1920px] relative z-[30]`}>
      {/* top navbar */}

      <div className="hidden md:flex justify-end md:pr-16 h-[40px] bg-[#D9D9D9] py-2 ">
        <span className="px-4">
          <h1>About YOLO</h1>
        </span>
        <span className="px-4">
          <h1>Become Event Creator</h1>
        </span>
        <span className="px-4">
          <h1>Contact Us</h1>
        </span>
      </div>

      {/* red navbar */}

      <div className="flex h-[75px] md:h-[90px] bg-[#F40841]  justify-between relative">
        <div className="flex">
          <div
            className="my-auto ml-20 mr-[121px] min-w-[160px] hidden md:block cursor-pointer"
            onClick={() => {
              router.push('/');
            }}
          >
            <Image
              width={160}
              height={72}
              src="/logo_white.png"
              alt="logo"
            ></Image>
          </div>
          <div className="block my-auto ml-6 md:hidden">
            <Image
              width={119}
              height={54}
              src="/logo_white.png"
              alt="logo"
            ></Image>
          </div>
          {/* search bar */}
          <div className="hidden md:flex">
            <span className="w-[50px] h-[52px] bg-white mt-5 rounded-l-md">
              <SlMagnifier className="m-auto my-3 text-2xl" />
            </span>
            <div className="relative w-[685px] h-[40px] mt-5 mr-20">
              <input
                type="text"
                id="floating_filled"
                className="block rounded-r-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-[#d9d9d9] dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e) => setSearch(e.target.value)}
              />
              <label
                htmlFor="floating_filled"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                search here..
              </label>
            </div>
          </div>
          <div
            id="dropdown"
            className="bg-white w-[685px] absolute -bottom-7 left-[410px]"
          >
            {filterData.map((val, index) => (
              <div
                key={index}
                className="hover:bg-blue-500 cursor-pointer"
                onClick={() => router.push(`/${val.title}`)}
              >
                {val.title}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`hidden gap-5 my-auto mr-20 text-white ${
            isLoggedIn ? '' : 'md:flex'
          } font-poppins`}
        >
          <button
            className="rounded-lg w-[7rem] h-[3rem] bg-transparent border-2 border-white text-white hover:bg-orange-500 hover:text-white hover:border-none"
            onClick={() => router.push('/signup')}
          >
            Register
          </button>
          <button
            className="rounded-lg w-[7rem] h-[3rem] bg-white border-2 border-white text-[#F40841] font-bold hover:bg-orange-500 hover:text-white hover:border-none"
            onClick={() => router.push('/signin')}
          >
            Login
          </button>
        </div>

        {/* navbar menu */}
        {/* search bar mobile */}
        <div className="flex gap-4 my-auto mr-4 text-3xl text-white md:hidden">
          <SlMagnifier className="mt-4" />
          {isLoggedIn && (
            <div className="mr-2 md:mr-20 mt-2 md:mt-4">
              <button
                id="dropdownUserAvatarButton"
                data-dropdown-toggle="dropdownAvatar"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                type="button"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                  src="/28.jpg"
                  alt="user photo"
                />
              </button>

              <div
                id="dropdownAvatar"
                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div></div>
                  <div className="font-medium truncate">name@flowbite.com</div>
                </div>
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownUserAvatarButton"
                >
                  <li>
                    <a
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => router.push('/participant/123456/profile')}
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Earnings
                    </a>
                  </li>
                </ul>
                <div className="py-2">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                    onClick={() => dispatch(logout())}
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="hidden my-auto mr-20 text-white md:flex font-poppins">
          <div className="my-1 mr-3 text-4xl">
            <BsFillTicketPerforatedFill></BsFillTicketPerforatedFill>
          </div>
          <span className="my-2 mr-16 text-lg">My Tickets</span>
          <div className="text-5xl">
            <BsPersonCircle></BsPersonCircle>
          </div>
        </div> */}
      </div>
    </nav>
  );
};
