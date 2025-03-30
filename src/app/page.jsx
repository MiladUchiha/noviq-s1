import Features from "@/components/Home/Features/Features";
import Hero from "@/components/Home/Hero/Hero";
import SecondaryCTA from "@/components/Home/Second/Second";
import Solution from "@/components/Home/Solution/Solution";
import Steps from "@/components/Home/Steps/Steps";
import WhoIsItFor from "@/components/Home/Use/Use";
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';

export default function Home() {
  gsap.registerPlugin(ScrollTrigger)
  return (
    <>
      <Hero />
    
      <Solution />  
      <Steps />
      <Features />
      <WhoIsItFor />
      <SecondaryCTA />
    </>
  );
}
