// Shared GSAP setup — registers ScrollTrigger + CustomEase once and defines
// the brand "ArcadiaEase" curve (a silky ease-out, the same control points as
// the site's existing cubic-bezier(.16,1,.3,1) entrance easing).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

let registered = false;

export function setupGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    // cubic-bezier(0.16, 1, 0.3, 1) → SVG path the CustomEase plugin wants.
    CustomEase.create('ArcadiaEase', 'M0,0 C0.16,1 0.3,1 1,1');
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
