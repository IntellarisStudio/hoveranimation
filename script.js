import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

  CustomEase.create(
    "hop",
    "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
  );

  initTextReveal();

  const clientsPreview = document.querySelector(".clients-preview");
  const clientNames = document.querySelectorAll(".client-name");

  let activeClientIndex = -1;

  clientNames.forEach((client, index) => {
    let activeClientImgWrapper = null;
    let activeClientImg = null;

    client.addEventListener("mouseover", () => {
      if (activeClientIndex === index) return;

      if (activeClientIndex !== -1) {
        const previousClient = clientNames[activeClientIndex];
        const mouseoutEvent = new Event("mouseout");
        previousClient.dispatchEvent(mouseoutEvent);
      }

      activeClientIndex = index;

      const clientImgWrapper = document.createElement("div");
      clientImgWrapper.className = "client-img-wrapper";

      const clientImg = document.createElement("img");
      clientImg.src = `img${index + 1}.jpg`;
      gsap.set(clientImg, { scale: 1.25, opacity: 0 });

      clientImgWrapper.appendChild(clientImg);
      clientsPreview.appendChild(clientImgWrapper);

      activeClientImgWrapper = clientImgWrapper;
      activeClientImg = clientImg;

      gsap.to(clientImgWrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        ease: "hop",
      });

      gsap.to(clientImg, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(clientImg, {
        scale: 1,
        duration: 1.25,
        ease: "hop",
      });
    });

    client.addEventListener("mouseout", (event) => {
      if (event.relatedTarget && client.contains(event.relatedTarget)) {
        return;
      }

      if (activeClientIndex === index) {
        activeClientIndex = -1;
      }

      if (activeClientImg && activeClientImgWrapper) {
        const clientImgToRemove = activeClientImg;
        const clientImgWrapperToRemove = activeClientImgWrapper;

        activeClientImg = null;
        activeClientImgWrapper = null;

        gsap.to(clientImgToRemove, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.out",
          onComplete: () => {
            clientImgWrapperToRemove.remove();
          },
        });
      }
    });
  });
});

function initTextReveal() {
  const elements = document.querySelectorAll("h1, p, a");

  elements.forEach((element) => {
    // Nested split for reveal effect
    const splitChild = new SplitText(element, {
      type: "lines",
      linesClass: "split-child",
    });

    const splitParent = new SplitText(element, {
      type: "lines",
      linesClass: "split-parent",
    });

    // Apply styles to parent for masking
    splitParent.lines.forEach((line) => {
      line.style.overflow = "hidden";
    });

    // Handle text indentation
    const computedStyle = window.getComputedStyle(element);
    const textIndent = computedStyle.textIndent;

    if (textIndent && textIndent !== "0px") {
      if (splitChild.lines.length > 0) {
        splitChild.lines[0].style.paddingLeft = textIndent;
      }
      element.style.textIndent = "0";
    }

    gsap.set(splitChild.lines, { y: "100%" });

    gsap.to(splitChild.lines, {
      y: -1,
      duration: 1.5,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play none none none",
      },
    });
  });
}
