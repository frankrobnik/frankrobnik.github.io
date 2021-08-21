import anime from 'animejs';

const bezDown = 'cubicBezier(0.550, 0.055, 0.675, 0.190)'; // easeOutQuart
const bezUp = 'cubicBezier(0.215, 0.610, 0.355, 1.00)'; // easeInQuad
const animation = anime({
  targets: '.attention .dot',
  // rx ry cx cy // 128 x 128
  cy: [
    {value: 64, duration: 500, easing: bezUp},
    {value: 120, duration: 500, easing: bezDown, delay: 100},
  ],
  loop: true
});

animation.play();
//     <script type="text/javascript" src="./js/main.bundle.js"></script>