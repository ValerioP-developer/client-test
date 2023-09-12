<script>
import { Toaster } from "vue-sonner";

export default {
  components: {
    Toaster,
  },
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <router-link to="/"></router-link>
      </nav>
    </div>
  </header>
  <toaster position="top-center" richColors />
  <router-view />
</template>
