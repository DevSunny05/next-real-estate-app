"use client"

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-slate-200  shadow-md">
      <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-lg flex flex-wrap">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form className="flex items-center p-3 rounded-lg bg-slate-100">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link href={"/"}>
            <li className="hidden md:inline text-slate-700 hover:text-slate-500">
              Home
            </li>
          </Link>

          <Link href={"/about"}>
            <li className="hidden md:inline text-slate-700 hover:text-slate-500">
              About
            </li>
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link href={"/sign-in"}>
              <li className="hidden md:inline text-slate-700 hover:text-slate-500">
                Sign In
              </li>
            </Link>
          </SignedOut>
        </ul>
      </div>
    </header>
  );
};

export default Header;
