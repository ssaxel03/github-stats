"use client";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";

export default function HomeButton() {

    const router = useRouter();

    const handleButton: FormEventHandler = (e) => {
        e.preventDefault();
        router.push("/");
    }

    return (
        <button
            onClick={handleButton}
            className="cursor-pointer absolute left-4 top-4 h-[36px] aspect-square flex items-center justify-center dark:bg-second-dark bg-second-light dark:hover:bg-third-dark hover:bg-light px-1 py-1 rounded-md border-b-2 border-r-2 border-solid dark:border-third-dark border-dark"
        >

            <svg className="w-full h-full dark:fill-light fill-dark stroke-3 dark:stroke-light stroke-dark" viewBox="0 0 330.242 330.242" strokeWidth="0.0033024200000000004">
                <path d="M324.442,129.811l-41.321-33.677V42.275c0-6.065-4.935-11-11-11h-26c-6.065,0-11,4.935-11,11v14.737l-55.213-44.999 c-3.994-3.254-9.258-5.047-14.822-5.047c-5.542,0-10.781,1.782-14.753,5.019L5.8,129.81c-6.567,5.351-6.173,10.012-5.354,12.314 c0.817,2.297,3.448,6.151,11.884,6.151h19.791v154.947c0,11.058,8.972,20.053,20,20.053h62.5c10.935,0,19.5-8.809,19.5-20.053 v-63.541c0-5.446,5.005-10.405,10.5-10.405h42c5.238,0,9.5,4.668,9.5,10.405v63.541c0,10.87,9.388,20.053,20.5,20.053h61.5 c11.028,0,20-8.996,20-20.053V148.275h19.791c8.436,0,11.066-3.854,11.884-6.151C330.615,139.822,331.009,135.161,324.442,129.811z"></path>
            </svg>

        </button>
    );
}
