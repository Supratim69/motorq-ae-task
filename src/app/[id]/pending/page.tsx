import Link from "next/link";
import React from "react";
import Pending from "../../components/pending";

export default function Page({params}: {params: {id: string}}) {
    return (
        <div className="h-[90vh] flex flex-col items-center justify-start mt-8">
            <nav className="bg-gray-200 lg:w-[40%] w-[70%] p-4 flex justify-around rounded-3xl text-xl">
                <Link className={`px-4 py-2 bg-slate-800 rounded-3xl text-white`}
                    href={`/${params.id}/pending`}
                >
                    Pending
                </Link>
                <Link
                    href={`/${params.id}/approved`}
                    className={`px-4 py-2 transparent text-slate-800 font-semibold`}
                >
                    Approved
                </Link>
            </nav>
            <div className="p-4"><Pending driverID={params.id} /> </div>
        </div>
    );
}
