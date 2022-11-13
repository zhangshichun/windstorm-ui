<script setup>
import { ref } from 'vue';
import { SeamlessScroll } from 'windstorm-ui';
</script>

<template>
  <div>
    <SeamlessScroll class="the-demo-list">
      <div class="the-demo-list__item">1</div>
      <div class="the-demo-list__item">2</div>
      <div class="the-demo-list__item">3</div>
      <div class="the-demo-list__item">4</div>
      <div class="the-demo-list__item">5</div>
      <div class="the-demo-list__item">6</div>
      <div class="the-demo-list__item">7</div>
      <div class="the-demo-list__item">8</div>
    </SeamlessScroll>
  </div>
</template>

<style lang="scss" scoped>
.the-demo-list {
  height: 180px;

  &__item {
    height: 32px;
    font-size: 16px;
    line-height: 32px;
  }

  :deep(.seamless-scroll__box--odd .seamless-scroll__box-top>*:nth-child(2n+1)) {
    background-color: rgba(0, 255, 0, 0.6);
  }

  :deep(.seamless-scroll__box--odd .seamless-scroll__box-bottom>*:nth-child(2n)) {
    background-color: rgba(0, 255, 0, 0.6);
  }

  :deep(.seamless-scroll__box--even .seamless-scroll__box-top>*:nth-child(2n+1)) {
    background-color: rgba(0, 255, 0, 0.6);
  }

  :deep(.seamless-scroll__box--even .seamless-scroll__box-bottom>*:nth-child(2n+1)) {
    background-color: rgba(0, 255, 0, 0.6);
  }
}
</style>
