"use client";  // This component is now a client component

import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const project = searchParams.get('project') || 'wildcat';

    return (
        <main className={"bg-[#f3eeda] h-screen flex flex-col justify-between"}>
            <div className={"grid justify-items-end w-full pr-24"}>
                <img className={"w-48 pt-8"} src={"images/pop-icon.svg"} alt={"pop"} />
            </div>
            <div className={"flex justify-between items-center"}>
                <div className={"w-[400px]"}>
                    <div className={""}><img src={"images/pop-char-small.png"} alt={"pop"} /></div>
                </div>
                <div className={"pr-12"}>
                    <div className={"w-96"}><img src={"images/proof-of-project-soon.svg"} alt={"pop"} /></div>
                </div>
            </div>
        </main>
    );
}
