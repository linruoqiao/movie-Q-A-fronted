<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const appStore = useAppStore()
const viteTitle = computed(() => {
  return appStore.title || 'CineMind'
})

// import HomePage from '@/views/home/home.vue'

// const routes = [
//   { path: '/', name: 'Home', component: HomePage }
// ]

// const router=createRouter({
//   history:createWebHistory(),
//   routes
// })

// export default router

</script>

<template>
  <div class="header">
    <div class="left">
      <!-- Logo SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 721 721" fill="none">
      <g clip-path="url(#clip0_1637_2935)">
      <g clip-path="url(#clip1_1637_2935)">
      <path d="M304.246 295.411V249.828C304.246 245.989 305.687 243.109 309.044 241.191L400.692 188.412C413.167 181.215 428.042 177.858 443.394 177.858C500.971 177.858 537.44 222.482 537.44 269.982C537.44 273.34 537.44 277.179 536.959 281.018L441.954 225.358C436.197 222 430.437 222 424.68 225.358L304.246 295.411ZM518.245 472.945V364.024C518.245 357.304 515.364 352.507 509.608 349.149L389.174 279.096L428.519 256.543C431.877 254.626 434.757 254.626 438.115 256.543L529.762 309.323C556.154 324.679 573.905 357.304 573.905 388.971C573.905 425.436 552.315 459.024 518.245 472.941V472.945ZM275.937 376.982L236.592 353.952C233.235 352.034 231.794 349.154 231.794 345.315V239.756C231.794 188.416 271.139 149.548 324.4 149.548C344.555 149.548 363.264 156.268 379.102 168.262L284.578 222.964C278.822 226.321 275.942 231.119 275.942 237.838V376.986L275.937 376.982ZM360.626 425.922L304.246 394.255V327.083L360.626 295.416L417.002 327.083V394.255L360.626 425.922ZM396.852 571.789C376.698 571.789 357.989 565.07 342.151 553.075L436.674 498.374C442.431 495.017 445.311 490.219 445.311 483.499V344.352L485.138 367.382C488.495 369.299 489.936 372.179 489.936 376.018V481.577C489.936 532.917 450.109 571.785 396.852 571.785V571.789ZM283.134 464.79L191.486 412.01C165.094 396.654 147.343 364.029 147.343 332.362C147.343 295.416 169.415 262.309 203.48 248.393V357.791C203.48 364.51 206.361 369.308 212.117 372.665L332.074 442.237L292.729 464.79C289.372 466.707 286.491 466.707 283.134 464.79ZM277.859 543.48C223.639 543.48 183.813 502.695 183.813 452.314C183.813 448.475 184.294 444.636 184.771 440.797L279.295 495.498C285.051 498.856 290.812 498.856 296.568 495.498L417.002 425.927V471.509C417.002 475.349 415.562 478.229 412.204 480.146L320.557 532.926C308.081 540.122 293.206 543.48 277.854 543.48H277.859ZM396.852 600.576C454.911 600.576 503.37 559.313 514.41 504.612C568.149 490.696 602.696 440.315 602.696 388.976C602.696 355.387 588.303 322.762 562.392 299.25C564.791 289.173 566.231 279.096 566.231 269.024C566.231 200.411 510.571 149.067 446.274 149.067C433.322 149.067 420.846 150.984 408.37 155.305C386.775 134.192 357.026 120.758 324.4 120.758C266.342 120.758 217.883 162.02 206.843 216.721C153.104 230.637 118.557 281.018 118.557 332.357C118.557 365.946 132.95 398.571 158.861 422.083C156.462 432.16 155.022 442.237 155.022 452.309C155.022 520.922 210.682 572.266 274.978 572.266C287.931 572.266 300.407 570.349 312.883 566.028C334.473 587.141 364.222 600.576 396.852 600.576Z" fill="white"/>
      </g>
      </g>
      <defs>
      <clipPath id="clip0_1637_2935">
      <rect width="720" height="720" fill="white" transform="translate(0.606934 0.899902)"/>
      </clipPath>
      <clipPath id="clip1_1637_2935">
      <rect width="484.139" height="479.818" fill="white" transform="translate(118.557 120.758)"/>
      </clipPath>
      </defs>
      </svg>
      <span class="site-title">{{ viteTitle }}</span>
    </div>

    <div class="right">
      <router-link to="/home" class="nav-item">Home</router-link>
      <a href="#" class="nav-item">Browse</a>
      <a href="#" class="nav-item">Genres</a>
      <a href="#" class="nav-item">About</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--el-header-height);
  padding: 0 2rem;
  background: linear-gradient(90deg, #0f0f0f, #1a1a1a);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  color: white;

  .left {
    display: flex;
    align-items: center;

    .logo-icon {
      height: 32px;
      width: 32px;
      filter: drop-shadow(0 0 5px #6dd5fa);
    }

    .site-title {
      margin-left: 10px;
      font-size: 22px;
      font-weight: bold;
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(45deg, #00f2fe, #4facfe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .right {
    display: flex;
    gap: 1.5rem;

    .nav-item {
      font-size: 16px;
      color: #ccc;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: #4facfe;
        transition: width 0.3s ease;
      }

      &:hover {
        color: #fff;
      }

      &:hover::after {
        width: 100%;
      }
    }
  }
}
</style>
