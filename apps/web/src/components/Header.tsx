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
import { IoCalendarSharp } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';

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
  const [data, setData] = React.useState({
    username: '',
    email: '',
    role: '',
    token: '',
  });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [event, setEvent] = React.useState<IEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
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
            setData({
              username,
              email,
              role,
              token,
            });
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
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const filterData = event.filter((val: any) =>
    val.title.toLowerCase().startsWith(search),
  );

  return (
    <nav className={`w-full max-w-[1920px] relative z-[30]`}>
      {/* LOADING SCREEN */}

      {loading && (
        <div className="absolute left-0 top-0 z-[36] h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm backdrop-filter">
          <span className="absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2  p-0.5 px-2 text-center text-xs font-medium leading-none text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </span>
        </div>
      )}

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
          <div
            className="block my-auto ml-6 md:hidden cursor-pointer"
            onClick={() => {
              router.push('/');
            }}
          >
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
                placeholder=""
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

        <div className="mt-6 gap-2 mr-4 text-3xl text-white md:hidden flex relative">
          <SlMagnifier />
          <IoMenu
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* DROP DOWN MENU FOR MOBILE */}

        <div className="md:hidden absolute top-[75px] left-0 w-full">
          <div
            className={`bg-slate-300  pt-2 h-[60px] text-center cursor-pointer hover:bg-blue-500 ${
              !isLoggedIn && menuOpen ? 'block' : 'hidden'
            }`}
          >
            <button
              className="rounded-lg w-[7rem] h-[2.5rem] mr-4 bg-white border-2 border-white text-[#F40841] font-bold hover:bg-orange-500 hover:text-white hover:border-none"
              onClick={() => {
                router.push('/signup');
                setMenuOpen(false);
              }}
            >
              Register
            </button>
            <button
              className="rounded-lg w-[7rem] h-[2.5rem] bg-white border-2 border-white text-[#F40841] font-bold hover:bg-orange-500 hover:text-white hover:border-none"
              onClick={() => {
                router.push('/signin');
                setMenuOpen(false);
              }}
            >
              Login
            </button>
          </div>

          {/*  FOR CUSTOMER */}
          {data.role === 'customer' && (
            <div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/customer/${data.token}/profile`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Dashboard Customer</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/customer/${data.token}/voucher`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Vouchers</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/customer/${data.token}/purchased-event`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Purchased Events</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/customer/${data.token}/review`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Review & Ratings</h1>
              </div>
            </div>
          )}

          {/* FOR ORGANIZER  */}

          {data.role === 'organizer' && (
            <div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/organizer/${data.token}/profile`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Dashboard Organizer</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/organizer/${data.token}/create-event`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Create Event</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/organizer/${data.token}/transaction`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Transaction</h1>
              </div>
              <div
                className={`bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
                  isLoggedIn && menuOpen ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  {
                    router.push(`/organizer/${data.token}/events`);
                    setMenuOpen(false);
                  }
                }}
              >
                <h1>Events</h1>
              </div>
            </div>
          )}

          <div
            className={` bg-slate-300 pt-4 h-[50px] text-center cursor-pointer hover:bg-blue-500 ${
              isLoggedIn && menuOpen ? 'block' : 'hidden'
            }`}
            onClick={() => {
              dispatch(logout());
              router.push('/');
            }}
          >
            Sign Out
          </div>
        </div>

        {/* profile icon */}
        <div
          className={` gap-4  mr-4 text-3xl text-white hidden ${
            isLoggedIn ? 'md:flex' : 'md:hidden'
          }`}
        >
          {data.role === 'organizer' && (
            <div
              className="text-white flex items-center mr-10 cursor-pointer"
              onClick={() =>
                router.push(`/organizer/${data.token}/create-event`)
              }
            >
              <IoCalendarSharp className=" text-3xl mr-2" />
              <h1 className="text-lg">Create Event</h1>
            </div>
          )}
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
                <div className="font-medium truncate">{data.username}</div>
                <div className="font-medium text-sm truncate">{data.email}</div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownUserAvatarButton"
              >
                <li>
                  <a
                    className={`block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white `}
                    onClick={() => {
                      router.push(`/${data.role}/${data.token}/profile`);
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
              <div className="py-2">
                <a
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                  onClick={() => {
                    dispatch(logout());
                    router.push('/');
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
