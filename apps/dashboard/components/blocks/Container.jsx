import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Twemoji from "react-twemoji";
import { meta as headMeta, social } from "../../config";
import { Nav } from "../nav/Nav";

export function Container(props) {
 const { children, ...customMeta } = props;
 const router = useRouter();

 const meta = {
  ...headMeta,
  ...customMeta,
 };

 return (
  <>
   <Head>
    <title>{meta.title}</title>
    <meta content={meta.description} name="description" />
    <meta property="og:url" content={meta.url + router.asPath} />
    <link rel="canonical" href={meta.url + router.asPath} />
    <meta property="og:type" content={meta.type} />
    <meta property="og:site_name" content={meta.author} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:image" content={social.image} />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={social.image} />
    <meta name="copyright" content={`Copyright ${meta.author} ${new Date().getFullYear()}`}></meta>
    <meta name="theme-color" content={meta.theme_color} />
    <meta name="msapplication-TileColor" content={meta.theme_color} />
    {meta.twitter && <meta property="article:published_time" content={meta.twitter} />}
    {meta.date && <meta property="article:published_time" content={meta.date} />}
    {process.env.HOTJAR_ID && (
     <script
      dangerouslySetInnerHTML={{
       __html: `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${process.env.HOTJAR_ID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`,
      }}
     />
    )}
   </Head>
   <Nav />
   <Twemoji options={{ className: "twemoji" }}>
    <div className="flex w-full flex-col items-center bg-background-primary antialiased md:py-16 md:px-16 px-8 py-8">{children}</div>
    <div className="fixed z-50 bottom-0 left-0 rounded-xl right-0 w-fit mx-auto mb-6 backdrop-blur px-6 bg-button-secondary/80 border border-gray-700 text-white text-center py-4">
     Note: The site is still in development. Please report any bugs or issues to the{" "}
     <Link href="/discord" target={"_blank"} className="text-button-primary hover:underline">
      support server.
     </Link>
    </div>
   </Twemoji>
  </>
 );
}
