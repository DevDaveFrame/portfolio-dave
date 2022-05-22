import Head from "next/head";
import favicon from "../../public/favicon.ico";

export default function Index(){
  return (
    <>
      <Head>
        <title>Home -- Dave</title>
        <link rel="icon" href="/davicon.ico" />
      </Head>
      <div className="container">
        <div className="row">
          <section className="welcome">
            <h1 className="title">Well, hello there!</h1>
            <p className="body">I see you've found my homepage. I'm sorry, I wasn't expecting company yet, but feel free to look around...</p>
          </section>
        </div>
      </div>
    </> 
  )
}
