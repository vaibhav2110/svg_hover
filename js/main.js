document.addEventListener("DOMContentLoaded", () => {
  const lineEq = (y2, y1, x2, x1, currentVal) => {
    // y = mx + b
    var m = (y2 - y1) / (x2 - x1),
      b = y1 - m * x1;
    return m * currentVal + b;
  };

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  const distance = (x1, x2, y1, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.hypot(a, b);
  };

  const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;

    posx = e.pageX;
    posy = e.pageY;

    return { x: posx, y: posy };
  };

  const feDisplacementMapEl = document.querySelector("feDisplacementMap");

  class Menu {
    constructor() {
      this.DOM = {
        // The SVG element
        svg: document.querySelector("svg.distort"),
        // The menu element
        menu: document.querySelector(".options"),
        bg: document.getElementsByClassName("background")[0],
        menuBtn: document.getElementsByClassName("menu-btn")[0],
      };
      // The images (one per menu link)
      this.DOM.imgs = [...this.DOM.svg.querySelectorAll("g > image")];
      // The menu links
      this.DOM.menuLinks = [...this.DOM.menu.querySelectorAll(".text-wrapper")];
      // Mouse position
      this.mousePos = { x: 0, y: 0 };
      // Last mouse positions (one to consider for the image translation movement, another for the scale value of the feDisplacementMap element)
      this.lastMousePos = {
        translation: { x: 0, y: 0 },
        displacement: { x: 0, y: 0 },
      };
      // feDisplacementMap scale value
      this.dmScale = 0;
      // Current menu link position
      this.current = -1;

      this.initEvents();
      requestAnimationFrame(() => this.render());
    }
    reveal() {
      TweenMax.to(this.DOM.bg, 1, {
        ease: Power3.easeOut,
        top: "0%",
        rotationZ: 0,
        height: "80%",
      });
    }
    hide() {
      TweenMax.to(this.DOM.bg, 1.5, {
        ease: Power3.easeOut,
        top: "-140%",
        rotationZ: "10deg",
      });
    }
    initEvents() {
      // Update mouse position
      window.addEventListener(
        "mousemove",
        (ev) => { 
          this.mousePos = getMousePos(ev);
          // requestAnimationFrame(() => this.render());
        });

      this.DOM.menuBtn.addEventListener("mouseenter", () => {
        this.reveal();
        this.DOM.menuBtn.style.display = 'none';
      });

      this.DOM.bg.addEventListener("mouseleave", () => {
        this.hide();
        this.DOM.menuBtn.style.display = 'block';
      });

      this.DOM.menuLinks.forEach((item, pos) => {
        // Create spans for each letter

        const mouseenterFn = () => {
          // Hide the previous menu image.
          if (this.current !== -1) {
            TweenMax.set(this.DOM.imgs[this.current], { opacity: 0 });
          }
          // Update current.
          this.current = pos;

          TweenMax.to(this.DOM.imgs[this.current], 0.5, {
            ease: Quad.easeOut,
            opacity: 1,
          });
          TweenMax.set(item.querySelector(".back"), { color: "#fff" });
        };

        const mouseLeaveFn = () => {
          TweenMax.set(item.querySelector(".back"), { color: "transparent" });
        };
        item.addEventListener("mouseenter", mouseenterFn);
        item.addEventListener("mouseleave", mouseLeaveFn);
      });

      const mousemenuenterFn = () => (this.fade = true);
      const mousemenuleaveFn = () =>
        TweenMax.to(this.DOM.imgs[this.current], 0.2, {
          ease: Quad.easeOut,
          opacity: 0,
        });

      this.DOM.menu.addEventListener("mouseenter", mousemenuenterFn);
      this.DOM.menu.addEventListener("mouseleave", mousemenuleaveFn);
    }
    render() {
      // Translate the image on mousemove
      // this.lastMousePos.translation.x = lerp(
      //   this.lastMousePos.translation.x,
      //   this.mousePos.x,
      //   0.07
      // );
      // this.lastMousePos.translation.y = lerp(
      //   this.lastMousePos.translation.y,
      //   this.mousePos.y,
      //   0.07
      // );
      // this.DOM.svg.style.transform = `translateX(${
      //   this.lastMousePos.translation.x -
      //   this.DOM.svg.getBoundingClientRect().width / 2
      // }px) translateY(${
      //   this.lastMousePos.translation.y -
      //   this.DOM.svg.getBoundingClientRect().height / 2
      // }px)`;
      TweenMax.to(this.DOM.svg, 1, {
        left: this.mousePos.x - this.DOM.svg.getBoundingClientRect().width / 2,
        top: this.mousePos.y - this.DOM.svg.getBoundingClientRect().height / 2
      });
      //this.DOM.svg.style.left = "0px";
      //this.DOM.svg.style.top = "0px";
      // Scale goes from 0 to 50 for mouseDistance values between 0 to 140
      // this.lastMousePos.displacement.x = lerp(
      //   this.lastMousePos.displacement.x,
      //   this.mousePos.x,
      //   0.1
      // );
      // this.lastMousePos.displacement.y = lerp(
      //   this.lastMousePos.displacement.y,
      //   this.mousePos.y,
      //   0.1
      // );
      const mouseDistance = distance(
        this.lastMousePos.displacement.x,
        this.mousePos.x,
        this.lastMousePos.displacement.y,
        this.mousePos.y
      );
      this.lastMousePos.displacement.x = this.mousePos.x;
      this.lastMousePos.displacement.y = this.mousePos.y;
      //console.log("Mouse distance", mouseDistance);
      this.dmScale = Math.min(lineEq(50, 0, 140, 0, mouseDistance * 3), 50);
      // console.log(this.dmScale);
      feDisplacementMapEl.scale.baseVal = this.dmScale;
      console.log(feDisplacementMapEl.scale.baseVal);
      requestAnimationFrame(() => this.render());
    }
  }

  new Menu();
});
