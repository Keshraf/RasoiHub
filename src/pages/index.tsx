import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>RasoiHub - One stop solution for your cloud kitchen</title>
        <meta
          name="description"
          content="One stop solution for your cloud kitchen"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Link
          href={"/dashboard"}
          className={buttonVariants({ variant: "outline" })}
        >
          Click here
        </Link>
      </main>
    </>
  );
}
