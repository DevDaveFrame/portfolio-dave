import Head from "next/head";
import favicon from "../../public/favicon.ico";

export default function Index(){
  return (
    <>
      <Head>
        <title>Home -- Dave</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="row">
          <section className="page">
            <h1 className="page__label">Well, hello there!</h1>
            <p className="body">I see you've found my homepage. I'm sorry, I wasn't expecting company yet, but feel free to look around...</p>
          </section>
        </div>
      </div>
    </>
  )
}
