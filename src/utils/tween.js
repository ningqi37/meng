import {ref, onBeforeUnmount, inject, provide} from 'vue';

import TWEEN from '@tweenjs/tween.js';
//初版
export default {
    install: function(app) {
        app.config.globalProperties.$tween = {
            pause:this.pause,
            use:this.use,
        }
        app.config.globalProperties.$tweener = TWEEN;
    },
    pause: function(tw) {
        tw.pause();
    },
    use({
        begin,
        end,
        time = 1500,
        delay = 0,
        easing = TWEEN.Easing.Linear.None,
        onStart,
        onUpdate,
        onComplete,
    }) {
        // 内部对应动画响应和视图渲染自动维护
        let timer = requestAnimationFrame(function move() {
            timer = requestAnimationFrame(move);
            TWEEN.update();
        });
        new TWEEN.Tween(begin)
            .to(end, time)
            .delay(delay)
            .easing(easing)
            .onStart(() => {
                onStart && onStart();
            })
            .onUpdate((value, step) => {
                onUpdate && onUpdate(value);
            })
            .onComplete(() => {
                onComplete && onComplete();
                cancelAnimationFrame(timer);
            })
            .start();
    },
};

// export default {
//     install: function(app) {
//       const $tweener = ref(TWEEN);
  
//       const $tween = {
//         pause(tw) {
//           tw.pause();
//         },
//         use({
//           begin,
//           end,
//           time = 1500,
//           delay = 0,
//           easing = TWEEN.Easing.Linear.None,
//           onStart,
//           onUpdate,
//           onComplete,
//         }) {
//           // 内部对应动画响应和视图渲染自动维护
//           let timer = requestAnimationFrame(function move() {
//             timer = requestAnimationFrame(move);
//             $tweener.value.update();
//           });
//           new TWEEN.Tween(begin)
//             .to(end, time)
//             .delay(delay)
//             .easing(easing)
//             .onStart(() => {
//               onStart && onStart();
//             })
//             .onUpdate((value, step) => {
//               onUpdate && onUpdate(value);
//             })
//             .onComplete(() => {
//               onComplete && onComplete();
//               cancelAnimationFrame(timer);
//             })
//             .start();
//         },
//       };
  
//       // 提供 $tween 和 $tweener 实例
//       provide('$tween', $tween);
//       provide('$tweener', $tweener);
      
//     //   // 将 $tween 和 $tweener 注册为全局变量
//     //   app.config.globalProperties.$tween = $tween;
//     //   app.config.globalProperties.$tweener = $tweener.value;
//     return{
//         $tween,
//         $tweener,
//     };
//     },
//   };
