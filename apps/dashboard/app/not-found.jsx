import { QuestionMarkCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
 return (
  <div className="flex h-screen flex-col items-center justify-center gap-4">
   <h1 className="flex items-start text-center  text-5xl font-bold">Sorry, page not found</h1>
   <h2 className="text-center  text-xl opacity-50">We're sorry we can't find the page you're looking for.</h2>
   <div className="flex gap-4">
    <Link href="/">
     <div className="flex cursor-pointer items-center rounded bg-button-primary px-4 py-2  leading-6 text-white duration-200 hover:bg-button-primary-hover motion-reduce:transition-none">
      <ArrowLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" role="img" /> Go back home
     </div>
    </Link>
    <Link href="/discord">
     <div className="flex cursor-pointer items-center rounded bg-button-secondary px-4 py-2  leading-6 text-white duration-200 hover:bg-button-secondary-hover motion-reduce:transition-none">
      <QuestionMarkCircleIcon className="mr-2 h-5 w-5" aria-hidden="true" role="img" /> Contact support
     </div>
    </Link>
   </div>
  </div>
 );
}